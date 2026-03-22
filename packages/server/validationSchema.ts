import z from 'zod';

export const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt too long, max allowed 1000 chars'), // limiting tokens
   conversationId: z.string().uuid(),
});
