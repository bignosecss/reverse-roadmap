function customMessage(statusCode: number, message: string, data = {}): object {
  return {
    statusCode,
    message: [message],
    data,
  };
}
export default customMessage;
