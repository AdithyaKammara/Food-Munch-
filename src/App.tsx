import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/home/Hero'
import WhyUs from './components/home/WhyUs'
import DeliveryBanner from './components/home/DeliveryBanner'
import MenuSection from './components/menu/MenuSection'
import CartDrawer from './components/cart/CartDrawer'
import CheckoutDialog from './components/checkout/CheckoutDialog'
import AuthDialog from './components/checkout/AuthDialog'
import TrackingDialog from './components/orders/TrackingDialog'
import HistoryDialog from './components/orders/HistoryDialog'

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to content
      </a>

      <Navbar />
      <CartDrawer />
      <CheckoutDialog />
      <AuthDialog />
      <TrackingDialog />
      <HistoryDialog />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <WhyUs />
        <MenuSection />
        <DeliveryBanner />
      </main>

      <Footer />
    </>
  )
}