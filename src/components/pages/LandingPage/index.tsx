import Footer from '../../shared/Footer';
import NavBar from '../../shared/NavBar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-lime-50">
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}; 

export default LandingPage;