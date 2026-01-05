import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router-dom';
import ScrollToTop from '../ScrollToTop';
import { trackPageView } from '../../ga';
import CookieConsent from "react-cookie-consent";
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
      <CookieConsent
        location="bottom"
        buttonText="Accept Cookies"
        cookieName="smartconverter_cookie_consent"
        style={{ background: "rgba(43, 55, 59, 0.9)",
          fontSize: "14px" }}
        buttonStyle={{ color: "#ffffff", background: "#4CAF50", fontSize: "13px" }}
        expires={150}
      >
        SmartConverter uses cookies to analyze traffic, improve user experience,
        and display relevant advertisements. By continuing to use this site, you
        agree to our use of cookies.{" "}
        <a
          href="/privacy-policy"
          style={{ color: "#ffffff", textDecoration: "underline" }}
        >
          Learn more
        </a>
      </CookieConsent>

    </div>
  );
}
