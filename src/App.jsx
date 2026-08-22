import { useScrollReveal } from './hooks/useScrollReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Introduction from './components/Introduction';
import Services from './components/Services';
import Projects from './components/Projects';
import DemoWebsites from './components/DemoWebsites';
import Process from './components/Process';
import WhyChooseUs from './components/WhyChooseUs';
import About from './components/About';
import Technologies from './components/Technologies';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import WhatsAppCTA from './components/WhatsAppCTA';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Introduction />
        <Services />
        <Projects />
        <DemoWebsites />
        <Process />
        <WhyChooseUs />
        <About />
        <Technologies />
        <Pricing />
        <FAQ />
        <WhatsAppCTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
