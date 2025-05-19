import { Injectable } from "@nestjs/common";
import { UserRepo } from "@bank-bot/db";
import { ParsedWhatsAppMessage } from "@bank-bot/types";
import { OpenAiService } from "@bank-bot/nlp";
import { introductionPrompt } from '@bank-bot/nlp';


// check the user ny phone number
// if the user is not found, create a new user and prompt for onboarding(name, account number and bank) basically try connecting to their bank
// if the user is found, check if they have a session and continue the session

@Injectable()
export class ProcessMessage {
    constructor(
        private userRepo: UserRepo,
        private openAI: OpenAiService
    ){}

    async handleMessage(message: ParsedWhatsAppMessage){        
        const user = await this.userRepo.findUserByPhoneNumber(message.from);
        if(!user) {
            if (message.kind === "text") {
                const introductionResponse = await this.openAI.generateReply(message.text, introductionPrompt);
                console.log("Introduction response: ", introductionResponse);   
            }
                
    }
}}