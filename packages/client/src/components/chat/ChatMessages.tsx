import { useEffect, useRef, type ClipboardEventHandler } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../../types';

const ChatMessages = ({ messages }: { messages: Message[] }) => {
   const lastMessageRef = useRef<HTMLDivElement | null>(null);

   const onCopySelection: ClipboardEventHandler<HTMLDivElement> = (e) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection && e.clipboardData) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   useEffect(() => {
      if (lastMessageRef) {
         lastMessageRef.current?.scrollIntoView({
            behavior: 'smooth',
         });
      }
   }, [messages]);

   return (
      <div className="flex flex-col gap-3">
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
      </div>
   );
};

export default ChatMessages;
