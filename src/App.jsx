// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

// REMOVE THIS LINE: import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetailsPage from "./pages/TourDetailsPage";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Packages from "./pages/Packages";

export default function App() {
  return (
    <BrowserRouter>
      {/* REMOVED: <TopBar /> */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:id" element={<TourDetailsPage />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
