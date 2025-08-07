import { lazy } from "react";
const ViewsInicio = lazy(() => import("../apps/ViewSInicio"));

export const ListRoutes = [
  {
    link: "/prueba",
    component: ViewsInicio,
  },
];
