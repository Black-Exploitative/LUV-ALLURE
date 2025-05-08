// frontend/src/pages/navpages/dresses/GreenDresses.jsx
import { ColorDressesTemplate } from "../../../components/templates/DressCategoryTemplate";

const GreenDresses = () => {
  return (
    <ColorDressesTemplate 
      color="Green"
      banner="/images/dresses/green-dresses-banner.jpg"
      title="Green Dresses"
      subtitle="Fresh, natural styles in elegant emerald tones"
    />
  );
};

export default GreenDresses;