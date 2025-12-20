
import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Nav,
  Button,
} from 'rsuite';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { pdfToolCategories, imageToolCategories } from '../../data/tools.jsx';
import './Header.css';

const ToolsDropdown = ({ title, toolCategories, activeKey }) => {
  return (
    <Nav.Menu title={title} trigger="hover">
      <div className="tools-dropdown-container">
        {toolCategories.map(category => {
          const isCurrentCategoryActive = category.tools.some(tool => `/${tool.key}` === activeKey);
          return (
            <div className="tool-category-column" key={category.title}>
              <h6 className={`tool-category-title ${isCurrentCategoryActive ? 'active-category' : ''}`}>
                {category.title}
              </h6>
              {category.tools.map(tool => (
                <Nav.Item
                  as={Link}
                  to={`/${tool.key}`}
                  key={tool.key}
                  eventKey={`/${tool.key}`}
                  className="tool-link-item"
                >
                  <div className="tool-link-content">
                    <span className="tool-icon" style={{ color: tool.color }}>{tool.icon}</span>
                    <span className="tool-label">{tool.label}</span>
                  </div>
                </Nav.Item>
              ))}
            </div>
          );
        })}
      </div>
    </Nav.Menu>
  );
};

const CustomNavbar = ({ activeKey, user, ...props }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/signin");
    }).catch((error) => {
      // An error happened.
      console.error("Sign out error:", error);
    });
  };

  return (
    <Navbar {...props} className="custom-navbar">
      <Navbar.Brand as={Link} to="/" style={{ padding: '0px',margin:'5px 0px' }}>
        <img src="/logo.png" alt="logo" height="60" width={80} />
      </Navbar.Brand>
      <Nav activeKey={activeKey} style={{ flex: 1 }}>
        <ToolsDropdown title="ALL PDF TOOLS" toolCategories={pdfToolCategories} activeKey={activeKey} />
        <ToolsDropdown title="ALL IMAGE TOOLS" toolCategories={imageToolCategories} activeKey={activeKey} />
      </Nav>
      {/* <Nav pullRight>
        {user ? (
          <>
            <Nav.Item>{user.email}</Nav.Item>
            <Nav.Item>
              <Button appearance="primary" color="red" onClick={handleLogout}>Logout</Button>
            </Nav.Item>
          </>
        ) : (
          <>
            <Nav.Item as={Link} to="/signin">
              <Button appearance="subtle">Login</Button>
            </Nav.Item>
            <Nav.Item as={Link} to="/signup">
              <Button appearance="primary" color="red">Sign up</Button>
            </Nav.Item>
          </>
        )}
      </Nav> */}
    </Navbar>
  );
};

export default function Header() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <CustomNavbar activeKey={location.pathname} user={user} />
  );
}
