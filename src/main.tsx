import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "./index.css";
import App from "./App.tsx";
import { ContextAppProvider } from "./context/contextUserProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContextAppProvider>
      <ToastContainer
        position={"top-center"}
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
      />
      <App />
    </ContextAppProvider>
  </StrictMode>
);
