/**
 * This enum stores specific configuration values related to DeepSeek usage in the
 * application, helping in maintaining consistency and ease of updates.
 *
 * @enum deepseekAI
 *
 * @member DEEPSEEK_CHAT - Identifier for the specific DeepSeek model version used.
 * @member BASIC_CHAT_DEEPSEEK_TEMPERATURE - Controls the randomness in the model's responses,
 *                                         with a higher value resulting in more random responses.
 */
export enum deepseekAI {
  DEEPSEEK_CHAT = 'deepseek-chat',
  BASIC_CHAT_DEEPSEEK_TEMPERATURE = 0.8,
  TIMEOUT = 30,
}

export enum vercelRoles {
  user = 'user',
  assistant = 'assistant',
}
