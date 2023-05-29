import { Global, css } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { useState } from 'react';
import Navbar from './Navbar';
import "./css/navbar.css";
import AppointmentsPage from './pages/AppointmentPage';
import AvailableSlotsPage from './pages/AvailableSlotsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import DoctorListingPage from './pages/DoctorListingPage';
import PatientRegistrationPage from './pages/RegistrationPage';
import SignInPage from './pages/SignInPage';
import './App.css';

// Define a custom theme
const theme = createTheme();

// Global CSS styles
const globalStyles = css`
  body {
    margin: 0;
    padding: 0;
  }
`;

const App = () => {
  // Set base URL for API requests
  axios.defaults.baseURL = 'https://mehdijaffri.pythonanywhere.com/api/';

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleSetUser = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    setUser(null);
    // Redirect to the Sign In page
    window.location.href = '/signin';
  }


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Global styles={globalStyles} />
      <Router>
        <Navbar isUser={user} />
        {user && (
          <div className="user-data">
            <p>Welcome, {user.first_name} {user.last_name}</p>
            <p>Email: {user.email}</p>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
        <Switch>
          <Route path="/" exact component={DoctorListingPage} />
          <Route path="/signin">
            <SignInPage setUser={handleSetUser} />
          </Route>
          <Route path="/appointments" component={AppointmentsPage} />
          <Route path="/doctors/:id/slots" component={AvailableSlotsPage} />
          <Route path="/book-appointment/:doctorId" component={BookAppointmentPage} />
          <Route path="/patient-registration" component={PatientRegistrationPage} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
