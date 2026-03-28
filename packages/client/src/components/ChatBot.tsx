import axios from 'axios';
import { useState, type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

type Message = {
   content: string;
   role: 'user' | 'bot';
};

const ChatBot = () => {
   const { register, handleSubmit, reset, formState } = useForm<FormData>();
   const [messages, setMessages] = useState<Message[]>([]);
   const [conversationId] = useState(() => crypto.randomUUID());

   const onSubmit = async ({ prompt }: FormData) => {
      reset();
      setMessages((prev) => [
         ...prev,
         {
            content: prompt,
            role: 'user',
         },
      ]);
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
      console.log(messages);
   };

   const submitHandler = handleSubmit(onSubmit);

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         submitHandler();
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-3 mb-10">
            {messages.map((msg, index) => (
               <div
                  className={`px-3 py-1 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
               >
                  <p key={index}>{msg.content}</p>
               </div>
            ))}
         </div>
         <form
            onSubmit={submitHandler}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-xl"
         >
            <Textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               className="resize-none border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
               placeholder="Ask anything"
               maxLength={1000}
            />
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
