import { type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import type { ChatFormData } from '../../types';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface ChatInputProps {
   onSubmit: (data: ChatFormData) => void;
}

const ChatInput = ({ onSubmit }: ChatInputProps) => {
   const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

   const handleFormSubmit = handleSubmit((data: ChatFormData) => {
      reset({ prompt: '' });
      onSubmit(data);
   });

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleFormSubmit();
      }
   };

   return (
      <form
         onSubmit={handleFormSubmit}
         onKeyDown={onKeyDown}
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-xl"
      >
         <Textarea
            {...register('prompt', {
               required: true,
               validate: (data: string) => data.trim().length > 0,
            })}
            className="resize-none border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            placeholder="Ask anything"
            maxLength={1000}
            autoFocus
         />
         <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatInput;
