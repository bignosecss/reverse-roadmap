/**
 * Enum for template strings used in chat interactions.
 *
 * This enum centralizes the templates for different types of chats, providing a
 * uniform approach to structuring the input for AI models. These templates are
 * used to guide the AI in generating relevant and contextual responses.
 *
 * @enum TEMPLATES
 *
 * @member BASIC_CHAT_TEMPLATE - A template for basic chat interactions, instructing
 *                               the AI to provide concise responses as a software
 *                               engineering expert. This template is used for
 *                               straightforward, single-turn dialogues.
 *
 * @member CONTEXT_AWARE_CHAT_TEMPLATE - A template for context-aware chat interactions,
 *                                       incorporating the current conversation history
 *                                       to maintain context. This template allows the
 *                                       AI to generate responses that are coherent and
 *                                       contextually relevant in multi-turn dialogues.
 *
 *  @member DOCUMENT_CONTEXT_CHAT_TEMPLATE - Template for chat interactions that require responses based on a specific
 *                                          document context. This template is structured to focus the AI's attention
 *                                          on the provided context, enabling it to generate informed responses to questions
 *                                          with regard to the document's content.
 */

export enum TEMPLATES {
  BASIC_SYSTEM_MESSAGE = 'You are a helpful, precise, and articulate assistant. Your primary goal is to provide accurate, useful, and well-structured responses. If you are unsure about something, acknowledge it rather than guessing.',
}
