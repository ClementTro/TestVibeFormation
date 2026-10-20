import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLenis from './hooks/useLenis.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Manifesto from './components/Manifesto.jsx';
import News from './components/News.jsx';
import Partners from './components/Partners.jsx';
import Newsletter from './components/Newsletter.jsx';
import Footer from './components/Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useLenis();

  // Reveal générique : tout élément [data-reveal] apparaît au scroll
  useLayoutEffect(() => {
    const els = gsap.utils.toArray('[data-reveal]');
    gsap.set(els, { y: 48, opacity: 0 });
    const triggers = ScrollTrigger.batch(els, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: 'power3.out' }),
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div className="page">
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <News />
        <Partners />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}