import React, { useState } from "react";
import { ContextUser, type TypingContextUser } from "./contextUser";

export const ContextAppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [branding] = useState<TypingContextUser>({
    id_user: import.meta.env.VITE_APP_USER_ID,
    name: import.meta.env.VITE_APP_USER_NAME,
    cuenta: import.meta.env.VITE_APP_USER_CUENTA,
  });

  return (
    <ContextUser.Provider value={branding}>{children}</ContextUser.Provider>
  );
};
