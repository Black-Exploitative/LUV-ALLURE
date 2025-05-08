// frontend/src/pages/navpages/dresses/FormalDresses.jsx
import { StyleDressesTemplate } from "../../../components/templates/DressCategoryTemplate";

const FormalDresses = () => {
  return (
    <StyleDressesTemplate 
      tag="Formal"
      banner="/images/dresses/formal-dresses-banner.jpg"
      title="Formal Dresses"
      subtitle="Sophisticated styles for elegant occasions"
    />
  );
};

export default FormalDresses;