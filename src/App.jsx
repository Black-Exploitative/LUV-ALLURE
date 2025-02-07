import { BrowserRouter as Router, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import Shop from "./pages/Shop";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} /> */}
      </Routes>
    </Router>
  );
}
