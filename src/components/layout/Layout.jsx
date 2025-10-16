import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout-container">
      <header className="layout-header">
        <Header />
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
