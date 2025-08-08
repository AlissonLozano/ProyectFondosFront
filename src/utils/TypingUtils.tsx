import type { ReactNode } from "react";

/* eslint @typescript-eslint/no-explicit-any: "off" */
export type TypingRoutes = {
  link: string;
  component: any;
  label?: string;
  logo?: ReactNode;
  description?: string;
};
