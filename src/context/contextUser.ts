import { createContext } from "react";

export interface TypingContextUser {
  id_user: number;
  name: string;
}

export const ContextUser = createContext<TypingContextUser>({
  id_user: 0,
  name: "",
});
