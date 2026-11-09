import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import Layout from "./components/Layout";
import { business } from "./lib/business";
import { CTAButton } from "./components/kit";

const Home = lazy(() => import("./pages/Home"));
const ProductsPage = lazy(() => import("./pages/Products").then((m) => ({ default: m.ProductsPage })));
const ProductDetailPage = lazy(() => import("./pages/Products").then((m) => ({ default: m.ProductDetailPage })));
const BrandsPage = lazy(() => import("./pages/Brands").then((m) => ({ default: m.BrandsPage })));
const BrandDetailPage = lazy(() => import("./pages/Brands").then((m) => ({ default: m.BrandDetailPage })));
const RentalPage = lazy(() => import("./pages/Rental"));
const ServicesPage = lazy(() => import("./pages/Services").then((m) => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import("./pages/Services").then((m) => ({ default: m.ServiceDetailPage })));
const RequestQuotePage = lazy(() => import("./pages/Forms").then((m) => ({ default: m.RequestQuotePage })));
const RepairPage = lazy(() => import("./pages/Forms").then((m) => ({ default: m.RepairPage })));
const ContactPage = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [pathname]);
  return null;
}

function useErrorMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex,nofollow";
    document.querySelector('link[rel="canonical"]')?.remove();
    document.querySelector('meta[property="og:url"]')?.remove();
    let descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.name = "description";
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.content = description;
  }, [title, description]);
}

function NotFound() {
  useErrorMeta("Page Not Found — Al Safwa Trading", "The requested page could not be found. Browse Al Safwa Trading's products, brands and services in Oman.");
  return <div className="grid-light bg-paper px-4 py-28 text-center">
    <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-safety">Error · Route not found</p>
    <h1 className="mt-4 font-display text-7xl font-semibold uppercase leading-none md:text-9xl">404</h1>
    <p className="mx-auto mt-5 max-w-md text-smoke">This page is not in the {business.name} site map. The catalogue, rental fleet and services are one click away.</p>
    <div className="mt-8 flex justify-center gap-3"><CTAButton to="/" variant="dark">Back to home</CTAButton><CTAButton to="/products/" variant="safety">Browse products</CTAButton></div>
    <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.16em] text-smoke">Lost? <Link to="/contact/" className="text-safety underline-offset-4 hover:underline">Contact us</Link></p>
  </div>;
}

function Forbidden() {
  useErrorMeta("Access Restricted — Al Safwa Trading", "You do not have permission to access this resource. Contact Al Safwa Trading if you believe this is an error.");
  return <div className="grid-light bg-paper px-4 py-28 text-center">
    <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-safety">Access control · Restricted</p>
    <h1 className="mt-4 font-display text-7xl font-semibold uppercase leading-none md:text-9xl">403</h1>
    <p className="mx-auto mt-5 max-w-md text-smoke">You do not have permission to access this resource. If you need access, contact the Al Safwa Trading team.</p>
    <div className="mt-8 flex justify-center gap-3"><CTAButton to="/" variant="dark">Back to home</CTAButton><CTAButton to="/contact/" variant="safety">Contact us</CTAButton></div>
  </div>;
}

export default function App() {
  return <BrowserRouter>
    <ScrollToTop />
    <Suspense fallback={null}>
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
        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>;
}
