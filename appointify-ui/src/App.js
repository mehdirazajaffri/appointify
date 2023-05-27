import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Global, css } from '@emotion/react';
import axios from 'axios';

import DoctorListingPage from './pages/DoctorListingPage';
import SignInPage from './pages/SignInPage';
import AvailableSlotsPage from './pages/AvailableSlotsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import PatientRegistrationPage from './pages/RegistrationPage';
import Navbar from './Navbar';
import "./css/navbar.css"
import AppointmentsPage from './pages/AppointmentPage';

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Global styles={globalStyles} />
      <Router>
      <Navbar />
        <Switch>
          <Route path="/" exact component={DoctorListingPage} />
          <Route path="/signin" component={SignInPage} />
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
