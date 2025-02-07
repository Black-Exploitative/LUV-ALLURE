import { BrowserRouter as Router, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import Shop from "./pages/Shop";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Hero />
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} /> */}
      </Routes>
    </Router>
  );
}
