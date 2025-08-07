import { BrowserRouter } from "react-router-dom";
import HelperRoutes from "./routes/HelperRoutes";
import HeaderCustom from "./layouts/HeaderCustom";

function App() {
  return (
    <>
      <BrowserRouter>
        <HeaderCustom></HeaderCustom>
        <HelperRoutes></HelperRoutes>
      </BrowserRouter>
    </>
  );
}

export default App;
