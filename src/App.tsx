import { BrowserRouter } from "react-router-dom";
import HeaderCustom from "./layouts/HeaderCustom";
import { RoutesLink } from "./routes/HelperRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <HeaderCustom></HeaderCustom>
        <RoutesLink></RoutesLink>
      </BrowserRouter>
    </>
  );
}

export default App;
