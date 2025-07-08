import { inngest } from "../client.js";
import { Prompt } from "../../models/prompt.model.js";
import { NonRetriableError } from "inngest";


export const onPromptCreation = inngest.createFunction(
    { 
        id : "on-prompt-creation", retries : 2 
    },
    {
        event : "prompt/creation"
    },
    async({ event, step }) => {
        try{

        }catch(err){
            
        }
    }
)

