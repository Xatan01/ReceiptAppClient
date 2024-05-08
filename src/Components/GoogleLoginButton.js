import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ authorizationCode: googleAuthorizationCode }) // Assuming you have the Google authorization code
      });
      const data = await response.json();
      // Handle the response data
      // Store user details and token in local storage
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleGoogleLogin}>Login with Google</button>
  );
};

export default GoogleLoginButton;
