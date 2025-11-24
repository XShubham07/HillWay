import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetailsPage from "./pages/TourDetailsPage";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Packages from "./pages/Packages";  // NEW PAGE

export default function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* TOUR RELATED */}
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:id" element={<TourDetailsPage />} />

        {/* BLOG */}
        <Route path="/blog" element={<Blog />} />

        {/* PACKAGES — NEW */}
        <Route path="/packages" element={<Packages />} />

        {/* CONTACT */}
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
