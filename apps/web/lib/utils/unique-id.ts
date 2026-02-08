// 生成唯一id，用于消息标识
export const generateId = () =>
  Date.now().toString() + Math.random().toString(36).slice(2);
