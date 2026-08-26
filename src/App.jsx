import { useScrollReveal } from './hooks/useScrollReveal';

import Navbar         from './components/Navbar';
import Hero           from './components/Hero';
import Introduction   from './components/Introduction';
import DemoWebsites   from './components/DemoWebsites';
import Services       from './components/Services';
import Projects       from './components/Projects';
import Process        from './components/Process';
import WhyChooseUs    from './components/WhyChooseUs';
import About          from './components/About';
import Technologies   from './components/Technologies';
import Pricing        from './components/Pricing';
import FAQ            from './components/FAQ';
import Reviews        from './components/Reviews';
import Contact        from './components/Contact';
import WhatsAppCTA    from './components/WhatsAppCTA';
import Footer         from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import WhatsAppFloat  from './components/WhatsAppFloat';
import MobileBottomBar from './components/MobileBottomBar';
import './components/MobileGlass.css';

export default function App() {
  useScrollReveal();

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <WhatsAppFloat />
      <MobileBottomBar />

      <main id="main-content">
        <Hero />
        <Introduction />
        <DemoWebsites />
        <Services />
        <Projects />
        <Process />
        <WhyChooseUs />
        <About />
        <Technologies />
        <Pricing />
        <Reviews />
        <FAQ />
        <Contact />
        <WhatsAppCTA />
      </main>

      <Footer />
    </>
  );
}
