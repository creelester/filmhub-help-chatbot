export const TypingIndicator = ({ show }: { show: boolean }) => {
   return (
      <>
         {show && (
            <div className="flex px-3 py-3 gap-1 self-start bg-gray-200 rounded-2xl">
               <Dot />
               <Dot delay={0.2} />
               <Dot delay={0.4} />
            </div>
         )}
      </>
   );
};

const Dot = ({ delay }: { delay?: number }) => {
   const dotStyles = 'w-2 h-2 rounded-full bg-gray-600 animate-pulse';
   return (
      <div
         className={`${dotStyles} ${delay ? `[animation-delay:${delay}s]` : ''}`}
      />
   );
};
