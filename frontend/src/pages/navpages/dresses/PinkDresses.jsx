// frontend/src/pages/navpages/dresses/PinkDresses.jsx
import { ColorDressesTemplate } from "../../../components/templates/DressCategoryTemplate";

const PinkDresses = () => {
  return (
    <ColorDressesTemplate 
      color="Pink"
      banner="/images/dresses/pink-dresses-banner.jpg"
      title="Pink Dresses"
      subtitle="Feminine, romantic styles from blush to fuchsia"
    />
  );
};

export default PinkDresses;