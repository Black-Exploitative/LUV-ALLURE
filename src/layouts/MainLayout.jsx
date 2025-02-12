import Navbar from "../components/Navbar";
import PropTypes from "prop-types";

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}


MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};