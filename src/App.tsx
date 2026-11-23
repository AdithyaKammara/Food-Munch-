import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/home/Hero'
import StorySection from './components/home/StorySection'
import DeliveryBanner from './components/home/DeliveryBanner'
import MenuSection from './components/menu/MenuSection'
import OffersStrip from './components/home/OffersStrip'
import CartDrawer from './components/cart/CartDrawer'
import LazyPanels from './components/layout/LazyPanels'

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-forest-800 focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-cream-50"
      >
        Skip to content
      </a>

      <Navbar />
      <CartDrawer />
      <LazyPanels />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <MenuSection />
        <OffersStrip />
        <StorySection />
        <DeliveryBanner />
      </main>

      <Footer />
    </>
  )
}