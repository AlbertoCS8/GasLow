import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import BuscaRadio from "./BuscaRadio.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/busca-radio" element={<BuscaRadio />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
