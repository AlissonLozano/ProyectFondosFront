import { Fragment, type ReactNode } from "react";

//FRAGMENT ********************* COMPONENT *********************************
const GatewayApps = ({ children }: { children: ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default GatewayApps;
