import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
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
  return <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
      <Route path="/products/:slug" element={<Layout><ProductDetailPage /></Layout>} />
      <Route path="/brands" element={<Layout><BrandsPage /></Layout>} />
      <Route path="/brands/:brand" element={<Layout><BrandDetailPage /></Layout>} />
      <Route path="/rental" element={<Layout><RentalPage /></Layout>} />
      <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
      <Route path="/services/:slug" element={<Layout><ServiceDetailPage /></Layout>} />
      <Route path="/repair" element={<Layout><RepairPage /></Layout>} />
      <Route path="/request-quote" element={<Layout><RequestQuotePage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>;
}
