import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Shop />} />
      </Routes>
    </Router>
  );
}
