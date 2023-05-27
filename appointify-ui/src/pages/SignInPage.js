import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../css/SignInPage.css';

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth-token/', {
        username,
        password
      });

      const { token } = response.data;
      console.log(response.data);
      // Save the token in localStorage
      localStorage.setItem('token', token);

      // Redirect to another page (e.g., DoctorListingPage)
      history.push('/');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="signin-container">
      <h1>Patient Sign In</h1>
      <form className="signin-form" onSubmit={handleSignIn}>
        <input
          type="text"
          className="input-field"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="signin-button">Sign In</button>
      </form>
    </div>
  );
};

export default SignInPage;