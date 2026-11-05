import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ToastProvider } from "./hooks/useToast";
import { CatalogProvider } from "./hooks/useCatalog";
import "@fontsource/big-shoulders-display/800";
import "@fontsource/big-shoulders-display/900";
import "@fontsource/instrument-sans/400";
import "@fontsource/instrument-sans/500";
import "@fontsource/instrument-sans/600";
import "@fontsource/instrument-sans/700";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <CatalogProvider>
          <App />
        </CatalogProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
