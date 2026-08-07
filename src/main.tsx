import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import Explore from "./pages/Explore";
import HowItWorks from "./pages/HowItWorks";
import Landing from "./pages/Landing";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
    </Routes>
  </BrowserRouter>,
);
