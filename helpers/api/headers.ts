import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Headers {
  "Content-Type": string;
  authorization?: string;
  [key: string]: string | undefined;
}

export const getHeaders = async (): Promise<Headers> => {
  const headers: Headers = { "Content-Type": "application/json" };

  try {
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.token) {
        headers.authorization = `Bearer ${user.token}`;
      }
    }
  } catch (error) {
    console.error("Error parsing user from AsyncStorage:", error);
  }

  return headers;
};
