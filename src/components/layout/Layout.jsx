import React from 'react';
import Header from './Header';
import Footer from './Footer'; 
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../ScrollToTop';
import './Layout.css';

export default function Layout() {
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
