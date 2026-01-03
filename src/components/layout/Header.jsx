
import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Nav,
  Button,
  Drawer,
} from 'rsuite';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { pdfToolCategories, imageToolCategories } from '../../data/tools.jsx';
import useMediaQuery from '../../hooks/useMediaQuery.jsx';
import { FiMenu } from 'react-icons/fi';
import './Header.css';
import logo from '../../assets/logo.png';

const ToolsDropdown = ({ title, toolCategories, activeKey, onSelect }) => {
  const isMobile = useMediaQuery('(max-width: 992px)');

  return (
    <Nav.Menu title={title} trigger={isMobile ? 'click' : 'hover'}>
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
                  onSelect={onSelect}
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

const MobileHeader = ({ activeKey, user, onLogout }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSelect = () => {
    setOpen(false);
  };

  return (
    <>
      <Navbar className="mobile-navbar">
        <Nav>
          <Nav.Item icon={<FiMenu size={24} />} onClick={() => setOpen(true)} />
        </Nav>
        <Nav>
          <Navbar.Brand as={Link} to="/" style={{ padding: '0px', margin: '5px 0' }}>
            <img src={logo} alt="logo" height="50" width={70} />
          </Navbar.Brand>
        </Nav>
      </Navbar>
      <Drawer open={open} onClose={() => setOpen(false)} placement="left" size={'full'}>
        <Drawer.Header>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className='black-color'>{user.email}</span>
              <Button onClick={onLogout} appearance="primary" color="blue" size="md">
                Logout
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button onClick={() => navigate("/signin")} appearance="primary" color="blue" size="md">
                Login
              </Button>
              <Button onClick={() => navigate("/signup")} appearance="primary" color="blue" size="md">
                Sign up
              </Button>
            </div>
          )}
        </Drawer.Header>
        <Drawer.Body>
          <Nav vertical>
            <ToolsDropdown title="ALL PDF TOOLS" toolCategories={pdfToolCategories} activeKey={activeKey} onSelect={handleSelect} />
            <ToolsDropdown title="ALL IMAGE TOOLS" toolCategories={imageToolCategories} activeKey={activeKey} onSelect={handleSelect} />
          </Nav>
        </Drawer.Body>
      </Drawer>
    </>
  );
};

const DesktopHeader = ({ activeKey, user, onLogout }) => (
  <Navbar className="custom-navbar">
    <Navbar.Brand as={Link} to="/" style={{ padding: '0px', margin: '5px 0px' }}>
      <img src={logo} alt="logo" height="60" width={80} />
    </Navbar.Brand>
    <Nav activeKey={activeKey} style={{ flex: 1 }}>
      <ToolsDropdown title="ALL PDF TOOLS" toolCategories={pdfToolCategories} activeKey={activeKey} />
      <ToolsDropdown title="ALL IMAGE TOOLS" toolCategories={imageToolCategories} activeKey={activeKey} />
    </Nav>
    <Nav pullRight>
      {user ? (
        <>
          <Nav.Item>{user.email}</Nav.Item>
          <Nav.Item>
            <Button appearance="primary" color="red" onClick={onLogout}>Logout</Button>
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
    </Nav>
  </Navbar>
);

export default function Header() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const isMobile = useMediaQuery('(max-width: 992px)');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate("/signin");
    }).catch((error) => {
      console.error("Sign out error:", error);
    });
  };

  if (isMobile === null) return null;

  return isMobile ? (
    <MobileHeader activeKey={location.pathname} user={user} onLogout={handleLogout} />
  ) : (
    <DesktopHeader activeKey={location.pathname} user={user} onLogout={handleLogout} />
  );
}
