import Hero from "../components/Hero";
import OfferSection from "../components/OfferSection";
import Navbar from "../components/Navbar";
import { Toaster } from 'react-hot-toast';


export default function Home() {
  return (
    <div>
     <Navbar cartItemCount={cartItemCount} />
      <Hero />
      <OfferSection />
    </div>
  );
}
