import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { type TypingRoutes } from "../utils/TypingUtils";
import { ListRoutes } from "./routes";
import GatewayApps from "./GatewayApps";

const toRoutes = (ListRoutes: Array<TypingRoutes>) => {
  const routes = ListRoutes.map(({ link, component: Component }) => {
    return (
      <Route
        key={link}
        path={link}
        element={
          <GatewayApps>
            <Suspense fallback={<div>Cargando...</div>}>
              <Component />
            </Suspense>
          </GatewayApps>
        }
      />
    );
  });

  return routes;
};

export const RoutesLink = () => {
  return <Routes>{toRoutes(ListRoutes)}</Routes>;
};
