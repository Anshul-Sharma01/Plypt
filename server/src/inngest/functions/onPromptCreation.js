import { inngest } from "../client.js";
import { Prompt } from "../../models/prompt.model.js";
import { NonRetriableError } from "inngest";
import { analyzePrompt } from "../../utils/aiCommunicator.js";

export const onPromptCreation = inngest.createFunction(
  {
    id: "on-prompt-creation",
    name: "On Prompt Creation",
    retries: 2,
  },
  {
    event: "prompt/creation",
  },
  async ({ event }) => {
    console.log("🚀 Inngest function triggered! Event received:", JSON.stringify(event, null, 2));

    try {
      const { promptId } = event.data;

      if (!promptId) {
        console.error("❌ No promptId in event data");
        throw new NonRetriableError("promptId is missing from event data");
      }

      console.log(`📝 Processing AI review for prompt ID: ${promptId}`);

      // Step 1: Fetch prompt from database
      console.log("🔄 Step 1: Fetching prompt from database...");
      const prompt = await Prompt.findById(promptId).select("-slug -craftor -price -pictures");

      if (!prompt) {
        console.error(`❌ Prompt ${promptId} not found in database`);
        throw new NonRetriableError("Prompt Not Found");
      }

      console.log(`✅ Prompt fetched successfully: "${prompt.title}"`);
      console.log(`  → Content length: ${prompt.content?.length || 0} characters`);

      // Step 2: Analyze prompt with AI
      console.log("🔄 Step 2: Analyzing prompt with AI...");
      console.log(`  → Content preview: "${prompt.content?.substring(0, 100)}..."`);

      const aiResponse = await analyzePrompt(prompt.content);

      if (!aiResponse || !aiResponse.rating || !aiResponse.review) {
        console.error(`❌ Invalid AI response:`, aiResponse);
        throw new NonRetriableError("AI analysis failed or returned invalid data");
      }

      console.log(`✅ AI analysis successful!`);
      console.log(`  → Rating: ${aiResponse.rating}/10`);
      console.log(`  → Review: "${aiResponse.review.substring(0, 100)}..."`);

      // Step 3: Update prompt with AI review
      console.log("🔄 Step 3: Updating prompt with AI review...");

      const updatedPrompt = await Prompt.findByIdAndUpdate(
        promptId,
        { aiReview: aiResponse },
        { new: true }
      ).select("-slug -craftor -price -pictures");

      if (!updatedPrompt) {
        console.error(`❌ Failed to update prompt ${promptId}`);
        throw new NonRetriableError("Failed to update prompt");
      }

      console.log(`✅ Prompt updated successfully in database`);
      console.log(`✅✅✅ Function completed successfully for prompt ${promptId}`);

      return {
        success: true,
        promptId,
        rating: aiResponse.rating,
        review: aiResponse.review
      };

    } catch (err) {
      console.error(`❌❌❌ Error in Inngest function:`, err.message);
      console.error(`Stack trace:`, err.stack);

      // If it's a NonRetriableError, don't retry
      if (err instanceof NonRetriableError) {
        console.error(`  → This is a NonRetriableError, will not retry`);
        throw err;
      }

      // For other errors, let Inngest handle retries
      console.error(`  → This error will trigger a retry`);
      throw err;
    }
  }
);
