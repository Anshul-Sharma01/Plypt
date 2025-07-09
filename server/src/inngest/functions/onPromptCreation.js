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
    try {
      const { promptId } = event.data;

      const promptObject = await step.run("fetch-prompt", async () => {
        const prompt = await Prompt.findById(promptId).select("-slug -craftor -price -pictures");
        if (!prompt) {
          throw new NonRetriableError("Prompt Not Found");
        }
        return prompt;
      });

      const aiResponse = await analyzePrompt(promptObject.content);



      const updatedPrompt = await step.run("update-ai-review", async () => {
        const result = await Prompt.findByIdAndUpdate(
          promptObject._id,
          { aiReview: aiResponse },
          { new: true }
        ).select("-slug -craftor -price -pictures");
        return result;
      });

      return { success: true, updatedPrompt };
    } catch (err) {
      console.error(`Error running the step: ${err.message}`);
      return { success: false, error: err.message };
    }
  }
);
