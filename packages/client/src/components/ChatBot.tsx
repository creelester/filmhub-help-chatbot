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
const ChatBot = () => {
   const { register, handleSubmit, reset, formState } = useForm<FormData>();
   const [messages, setMessages] = useState<string[]>([]);
   const [conversationId] = useState(() => crypto.randomUUID());

   const onSubmit = async ({ prompt }: FormData) => {
      reset();
      setMessages((prev) => [...prev, prompt]);
      const { data } = await axios.post<ChatResponse>('/api/chat', {
         prompt,
         conversationId,
      });
      setMessages((prev) => [...prev, data.message]); // use the latest version of the messages array
      console.log(data);
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
         <div>
            {messages.map((msg, index) => (
               <p key={index}>{msg}</p>
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
