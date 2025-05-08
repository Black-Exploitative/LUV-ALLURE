// frontend/src/pages/navpages/dresses/RedDresses.jsx
import { ColorDressesTemplate } from "../../../components/templates/DressCategoryTemplate";

const RedDresses = () => {
  return (
    <ColorDressesTemplate 
      color="Red"
      banner="/images/dresses/red-dresses-banner.jpg"
      title="Red Dresses"
      subtitle="Bold, vibrant styles for a statement look"
    />
  );
};

export default RedDresses;