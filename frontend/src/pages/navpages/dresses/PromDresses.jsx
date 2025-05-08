// frontend/src/pages/navpages/dresses/PromDresses.jsx
import { StyleDressesTemplate } from "../../../components/templates/DressCategoryTemplate";

const PromDresses = () => {
  return (
    <StyleDressesTemplate 
      tag="Prom"
      banner="/images/dresses/prom-dresses-banner.jpg"
      title="Prom Dresses"
      subtitle="Show-stopping styles for your special night"
    />
  );
};

export default PromDresses;