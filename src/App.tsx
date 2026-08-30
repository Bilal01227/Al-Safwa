import { useEffect } from "react";
import { HashRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { ProductsPage, ProductDetailPage } from "./pages/Products";
import { BrandsPage, BrandDetailPage } from "./pages/Brands";
import RentalPage from "./pages/Rental";
import { ServicesPage, ServiceDetailPage } from "./pages/Services";
import { RequestQuotePage, RepairPage } from "./pages/Forms";
import ContactPage from "./pages/Contact";
import Admin from "./pages/Admin";
import { business } from "./lib/business";
import { CTAButton } from "./components/kit";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [pathname]);
  return null;
}

function NotFound() {
  return <div className="grid-light bg-paper px-4 py-28 text-center">
    <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-safety">Error · Route not found</p>
    <h1 className="mt-4 font-display text-7xl font-semibold uppercase leading-none md:text-9xl">404</h1>
    <p className="mx-auto mt-5 max-w-md text-smoke">This page is not in the {business.name} site map. The catalogue, rental fleet and services are one click away.</p>
    <div className="mt-8 flex justify-center gap-3"><CTAButton to="/" variant="dark">Back to home</CTAButton><CTAButton to="/products" variant="safety">Browse products</CTAButton></div>
    <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.16em] text-smoke">Lost? <Link to="/contact" className="text-safety underline-offset-4 hover:underline">Contact us</Link></p>
  </div>;
}

export default function App() {
  return <HashRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<Layout><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/brands/:brand" element={<BrandDetailPage />} />
        <Route path="/rental" element={<RentalPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/repair" element={<RepairPage />} />
        <Route path="/request-quote" element={<RequestQuotePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes></Layout>} />
    </Routes>
  </HashRouter>;
}
