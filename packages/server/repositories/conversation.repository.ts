// Implementation detail - don't export directly
const conversations = new Map<string, string>();

// export public interface of the module
export const conversationRepository = {
   getLastResponseId(conversationId: string) {
      return conversations.get(conversationId);
   },
   setLastResponseId(conversationId: string, responseId: string) {
      return conversations.set(conversationId, responseId);
   },
};
