import axios from 'axios';
import {
   useEffect,
   useRef,
   useState,
   type ClipboardEvent,
   type KeyboardEvent,
} from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
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
   const [error, setError] = useState('');
   const [conversationId] = useState(() => crypto.randomUUID());
   const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
   const lastMessageRef = useRef<HTMLDivElement | null>(null);

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [
         ...prev,
         {
            content: prompt,
            role: 'user',
         },
      ]);
      setIsBotTyping(true);
      setError('');
      reset({ prompt: '' });

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

   const submitHandler = handleSubmit(onSubmit);

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         submitHandler();
      }
   };

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({
         behavior: 'smooth',
      });
   }, [messages]);

   useEffect(() => {
      console.log(error);
   }, [error]);

   const onCopySelection = (e: ClipboardEvent<HTMLDivElement>): void => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };
   return (
      <div className="font-sans text-sm flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-4 overflow-y-auto px-2">
            {/* messages */}
            {messages.map((msg, index) => (
               <div
                  onCopy={onCopySelection}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  key={index}
                  className={`px-5 py-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
               >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
               </div>
            ))}
            {/* typing indicator */}
            {isBotTyping && (
               <div className="flex px-3 py-3 gap-1 self-start bg-gray-200 rounded-2xl">
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse [animation-delay:0.4s]" />
               </div>
            )}
            {error.length > 0 ? (
               <p className="px-5 py-3 rounded-xl bg-red-200 text-red-800 text-xs self-center">
                  {error}
               </p>
            ) : null}
         </div>
         {/* text box */}
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
               autoFocus
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
