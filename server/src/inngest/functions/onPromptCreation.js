import { inngest } from "../client.js";
import { Prompt } from "../../models/prompt.model.js";
import { NonRetriableError } from "inngest";
import { analyzePrompt } from "../../utils/aiCommunicator.js";

export const onPromptCreation = inngest.createFunction(
  {
    id: "on-prompt-creation",
    retries: 2,
  },
  {
    event: "prompt/creation",
  },
  async ({ event, step }) => {
    console.log("🚀 Inngest function triggered! Event received:", event);
    try {
      const { promptId } = event.data;
      console.log(`📝 Processing AI review for prompt ID: ${promptId}`);

      const promptObject = await step.run("fetch-prompt", async () => {
        const prompt = await Prompt.findById(promptId).select("-slug -craftor -price -pictures");
        if (!prompt) {
          throw new NonRetriableError("Prompt Not Found");
        }
        return prompt;
      });

      const aiResponse = await step.run("analyze-prompt", async () => {
        const response = await analyzePrompt(promptObject.content);
        if (!response || !response.rating || !response.review) {
          throw new NonRetriableError("AI analysis failed or returned invalid data");
        }
        console.log(`✅ AI Response received:`, JSON.stringify(response, null, 2));
        return response;
      });

      const updatedPrompt = await step.run("update-ai-review", async () => {
        const result = await Prompt.findByIdAndUpdate(
          promptObject._id,
          { aiReview: aiResponse },
          { new: true }
        ).select("-slug -craftor -price -pictures");
        console.log(`✅ Prompt ${promptObject._id} updated with AI review`);
        return result;
      });

      console.log(`✅ Function completed successfully for prompt ${promptId}`);
      return { success: true, updatedPrompt };
    } catch (err) {
      console.error(`❌ Error in Inngest function:`, err);
      // If it's a NonRetriableError, don't retry
      if (err instanceof NonRetriableError) {
        throw err;
      }
      // For other errors, let Inngest handle retries
      throw err;
    }
  }
);
