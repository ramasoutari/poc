import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
//
import App from "./App";
import { GlobalWorkerOptions } from "pdfjs-dist";
import { loadTranslations } from "./translation/server-side";
import { localStorageGetItem } from "./utils/storage-available";
import { HelmetProvider } from "react-helmet-async";
// anything here is server side

// loadTranslations(localStorageGetItem("i18nextlng") || "ar").then(() => {
// ----------------------------------------------------------------------

// Virtual DOM (Client side)
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.12.105/pdf.worker.min.mjs`;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <App />
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
