
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Button, ButtonToolbar } from 'rsuite';
import './SignIn.css'; // Import the CSS file

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error.code, error.message);
        alert(`Sign-in failed: ${error.message}`);
      });
  };

  return (
    <div className="signin-container">
      <div className="signin-panel">
        <h3>Login</h3>
        <form onSubmit={handleSignIn} className="signin-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="input-field"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className=".signin-toolbar">
            <ButtonToolbar>
              <Button appearance="primary" type="submit" block>Sign in</Button>
            </ButtonToolbar>
            <div className="signup-link">
              <Button appearance="link" as={Link} to="/signup">New user? Sign up</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
