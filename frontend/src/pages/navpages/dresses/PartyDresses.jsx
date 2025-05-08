// frontend/src/pages/navpages/dresses/PartyDresses.jsx
import { StyleDressesTemplate } from "../../../components/templates/DressCategoryTemplate";

const PartyDresses = () => {
  return (
    <StyleDressesTemplate 
      tag="Party"
      banner="/images/dresses/party-dresses-banner.jpg"
      title="Party Dresses"
      subtitle="Glamorous styles for celebrations and special events"
    />
  );
};

export default PartyDresses;