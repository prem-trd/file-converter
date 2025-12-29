import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer'; 
import { Outlet, useLocation } from 'react-router-dom';
import ScrollToTop from '../ScrollToTop';
import { trackPageView } from '../../ga';
import './Layout.css';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    <div className="layout-container">
      <ScrollToTop />
      <header className="layout-header">
        <Header />
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
