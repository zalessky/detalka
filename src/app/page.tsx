import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Facts from '@/components/Facts';
import Vibro from '@/components/Vibro';
import Special from '@/components/Special';
import Works from '@/components/Works';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import Booking from '@/components/Booking';
import Route from '@/components/Route';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { MAX_URL } from '@/lib/site';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Facts />
        <Vibro />
        <Special />
        <Works />
        <Gallery />
        <Reviews />
        <Booking />
        <Route />
      </main>
      <Footer />
      <a className="fab" href={MAX_URL} target="_blank" rel="noopener" aria-label="Написать в MAX" title="Написать в MAX">
        <img src="/images/brand/max-logo.png" alt="" />
      </a>
      <Reveal />
    </>
  );
}
