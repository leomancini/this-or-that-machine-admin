export const getApiKey = () => {
  const apiKey = localStorage.getItem("apiKey");
  if (!apiKey) {
    throw new Error("API key not found. Please log in first.");
  }
  return apiKey;
};
