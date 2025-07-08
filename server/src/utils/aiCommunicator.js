import { createAgent, gemini } from "@inngest/agent-kit";


export const analyzePrompt = async(prompt) => {
    const supportAgent = createAgent({
        model : gemini({
            model : "gemini-2.0-flash",
            apiKey : process.env.GEMINI_API_KEY
        }),
        name : "AI Prompt Analuyzer & Reviewer",
        system : ""
    });

    const response = await supportAgent.run("");
    const raw = response.output[0].content;
    try{
        const reg = raw.match(/```json\s*([\s\S]*?)\s*```/i);
        const jsonString = reg ? reg[1] : raw.trim();
        return JSON.parse(jsonString);
    }catch(err){
        console.log(`Failed to parse json from AI Communicator : ${err.message}`);
        return null;
    }
}



