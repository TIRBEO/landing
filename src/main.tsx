import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Landing from "./pages/Landing";
import Legal from "./pages/legal/Legal";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/privacy" element={<Legal slug="privacy" />} />
      <Route path="/terms" element={<Legal slug="terms" />} />
      <Route path="/cookies" element={<Legal slug="cookies" />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  </BrowserRouter>,
);
