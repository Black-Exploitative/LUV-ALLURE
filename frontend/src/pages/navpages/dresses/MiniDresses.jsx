// frontend/src/pages/navpages/dresses/MiniDresses.jsx
import { StyleDressesTemplate } from "../../../components/templates/DressCategoryTemplate";

const MiniDresses = () => {
  return (
    <StyleDressesTemplate 
      tag="Mini"
      banner="/images/dresses/mini-dresses-banner.jpg"
      title="Mini Dresses"
      subtitle="Chic, short styles for a fun and youthful look"
    />
  );
};

export default MiniDresses;