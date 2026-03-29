import axios from 'axios';
import { useState } from 'react';
import type { ChatFormData, ChatResponse, Message } from '../../types';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import { TypingIndicator } from './TypingIndicator';

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [error, setError] = useState('');
   const [conversationId] = useState(() => crypto.randomUUID());
   const [isBotTyping, setIsBotTyping] = useState<boolean>(false);

   const onSubmit = async ({ prompt }: ChatFormData) => {
      setMessages((prev) => [
         ...prev,
         {
            content: prompt,
            role: 'user',
         },
      ]);
      setIsBotTyping(true);
      setError('');

      try {
         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            conversationId,
         });
         setMessages((prev) => [
            ...prev,
            {
               content: data.message,
               role: 'bot',
            },
         ]); // with prev lambda funct use the latest version of the messages array
      } catch (err) {
         setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
         setIsBotTyping(false);
      }
   };

   return (
      <div className="font-sans text-sm flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-4 overflow-y-auto px-2">
            <ChatMessages messages={messages} />
            <TypingIndicator show={isBotTyping} />
            {error?.length > 0 ? (
               <p className="px-5 py-3 rounded-xl bg-red-200 text-red-800 text-xs self-center">
                  {error}
               </p>
            ) : null}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
