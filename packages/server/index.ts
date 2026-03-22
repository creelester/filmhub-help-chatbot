import { PORT } from '@/constants';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import express from 'express';

import { chatService } from './services/chat.service';
import { chatSchema } from './validationSchema';

dotenv.config();

const app = express();

// Middleware function to auto parse requests to JSON
app.use(express.json());

// Routes

app.get('/', (req: Request, res: Response) => {
   res.send('hello');
});

app.post('/api/chat', async (req: Request, res: Response) => {
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
});

// Server starter
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
