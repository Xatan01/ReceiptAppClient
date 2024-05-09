import React, { useState } from "react";
import axios from 'axios'
import './loginPage.css';

export default function LoginPage() {
  const [authMode, setAuthMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Start processing
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        email,
        password,
      });
      setIsProcessing(false); // Hide the processing indicator
      if (response.status === 200) {
        // Login successful
        const {token} = response.data;
        localStorage.setItem('token', token);
        console.log('Login successful');
        // Redirect or update UI for logged-in user
      } else {
        console.error('Login failed:', response.data.message);
        // Update UI to display error message
      }
    } catch (error) {
      console.error('There was an error submitting the login form:', error);
      setIsProcessing(false); // Ensure we handle errors gracefully
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Start processing
    try {
      const response = await axios.post('http://localhost:3001/api/signup', {
        email,
        password,
        fullName,
      });
      setIsProcessing(false); // Hide the processing indicator
      if (response.status === 200) {
        // Signup successful
        console.log('Signup successful');
        // Redirect or update UI for signed-up user
      } else {
        console.error('Signup failed:', response.data.message);
        // Update UI to display error message
      }
    } catch (error) {
      console.error('There was an error submitting the signup form:', error);
      setIsProcessing(false); // Ensure we handle errors gracefully
    }
  };
  

  const handleForgotPassword = () => {
    // Add your forgot password logic here
    console.log("Forgot password...");
  };

  const validateLoginForm = () => {
    return email.trim() !== "" && password.trim() !== "";
  };

  const validateSignupForm = () => {
    return email.trim() !== "" && password.trim() !== "" && fullName.trim() !== "";
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={authMode === "signin" ? handleLogin : handleSignup}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">{authMode === "signin" ? "Sign In" : "Sign Up"}</h3>
          {authMode === "signup" && (
            <div className="form-group mt-3">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="e.g Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" disabled={authMode === "signin" ? !validateLoginForm() : !validateSignupForm() || isProcessing}>
              {isProcessing ? "Processing..." : "Submit"}
            </button>
          </div>
          <p className="text-center mt-2">
            <a href="#" onClick={handleForgotPassword}>Forgot password?</a>
          </p>
          <div className="text-center">
            {authMode === "signin" ? (
              <>
                Not registered yet?{" "}
                <span className="link-primary" onClick={changeAuthMode}>
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already registered?{" "}
                <span className="link-primary" onClick={changeAuthMode}>
                  Sign In
                </span>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
