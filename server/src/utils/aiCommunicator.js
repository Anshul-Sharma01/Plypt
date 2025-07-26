import { createAgent, gemini } from "@inngest/agent-kit";

export const analyzePrompt = async (prompt) => {
  const supportAgent = createAgent({
    model: gemini({
      model: "gemini-2.0-flash",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "AI Prompt Analyzer & Reviewer",
    system: `You are an expert AI prompt engineer and reviewer with the ability to simulate how an AI model would interpret and respond to prompts.

        Your role is to evaluate prompts submitted by users in an AI marketplace. For each prompt you receive:
        1. Imagine yourself as the AI model receiving that prompt and mentally simulate the type of output it would generate.
        2. Assess how clear, specific, and actionable the prompt is.
        3. Evaluate how effective the prompt would be in generating meaningful, creative, or useful responses.
        4. Point out any ambiguities, weaknesses, or areas for improvement.
        5. Finally, assign a rating score from 1 to 10 where:
        - 1 = Poor and unusable
        - 5 = Decent but needs work
        - 10 = Excellent and production-worthy

        Return your evaluation as a JSON object with the following structure:

        \`\`\`json
        {
        "review": "A short, honest, and constructive summary of the evaluation.",
        "rating": <number from 1 to 10>
        }
        \`\`\`  
        Do not include anything else outside the code block.`,
  });

  const response = await supportAgent.run(`
    Analyze the following user-submitted prompt for use in a generative AI application:

    "${prompt}"

    Please perform a simulated mental test of how an AI would respond to this prompt. Consider clarity, specificity, creativity, usefulness, and overall quality.

    Then provide your evaluation using the JSON structure as explained above.
`);

  const raw = response.output[0].content;
  console.log("AI Raw Response (raw content):", raw);


  try {
    const reg = raw.match(/```json\s*([\s\S]*?)\s*```/i);
    const jsonString = reg ? reg[1] : raw.trim();
    return JSON.parse(jsonString);
  } catch (err) {
    console.log(`Failed to parse JSON from AI Communicator: ${err.message}`);
    return null;
  }
};
