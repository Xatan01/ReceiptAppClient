import React from 'react';
import GoogleLoginButton from './Components/GoogleLoginButton';

const Login = () => {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" />

        <button type="submit">Login</button>
      </form>
      <div className="separator">Or</div>
      <GoogleLoginButton />
    </div>
  );
};

export default Login;