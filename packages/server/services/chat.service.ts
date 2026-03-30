import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';
import { conversationRepository } from '../repositories/conversation.repository';

const template = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'chatbot.txt'),
   'utf-8'
);

// Private implementation detail
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const filmhubInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'Filmhub.md'),
   'utf-8'
);
const instructions = template.replace('{{filmhubInfo}}', filmhubInfo);
type ChatResponse = {
   id: string;
   message: string;
};

// Public interface
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         input: prompt,
         temperature: 0.2,
         instructions,
         max_output_tokens: 500,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
      });
      conversationRepository.setLastResponseId(conversationId, response.id);
      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
