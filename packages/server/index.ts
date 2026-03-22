import { PORT } from '@/constants';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import express from 'express';
import OpenAI from 'openai';
import { chatSchema } from './validationSchema';

dotenv.config();

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

// Middleware function to auto parse requests to JSON
app.use(express.json());

// Routes
const conversations = new Map<string, string>();

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
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 100,
         previous_response_id: conversations.get(conversationId),
      });
      conversations.set(conversationId, response.id);
      res.json({
         message: response.output_text,
      });
   } catch (error) {
      res.status(500).json({ error: 'Failed to generate a response' });
   }
});

// Server starter
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
