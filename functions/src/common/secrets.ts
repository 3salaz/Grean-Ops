// Placeholder – we will integrate Firebase Secret Manager later
export const getSecret = async (name: string): Promise<string> => {
  throw new Error("Secret manager not implemented yet: " + name);
};
