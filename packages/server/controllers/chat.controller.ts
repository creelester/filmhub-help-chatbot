import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import { chatSchema } from '../validationSchema';

export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = chatSchema.safeParse(req.body);
      if (!parseResult.success) {
         res.status(400).json(parseResult.error.format());
         return;
      }
      const { prompt, conversationId } = req.body;

      try {
         const response = await chatService.sendMessage(prompt, conversationId);
         res.json({
            message: response.message,
         });
      } catch (error) {
         res.status(500).json({ error: 'Failed to generate a response' });
      }
   },
};
