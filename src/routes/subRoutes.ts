import { ListRoutes } from "./routes";

export const ListRoutesModule = ListRoutes.filter(({ label }) => {
  return label;
});
