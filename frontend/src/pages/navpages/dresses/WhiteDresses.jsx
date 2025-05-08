// frontend/src/pages/navpages/dresses/WhiteDresses.jsx
import { ColorDressesTemplate } from "../../../components/templates/DressCategoryTemplate";

const WhiteDresses = () => {
  return (
    <ColorDressesTemplate 
      color="White"
      banner="/images/dresses/white-dresses-banner.jpg"
      title="White Dresses"
      subtitle="Pure, radiant styles for a fresh look"
    />
  );
};

export default WhiteDresses;