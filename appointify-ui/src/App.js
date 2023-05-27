import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Global, css } from '@emotion/react';
import axios from 'axios';

import DoctorListingPage from './pages/DoctorListingPage';
import SignInPage from './pages/SignInPage';
import AvailableSlotsPage from './pages/AvailableSlotsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';

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
        <Switch>
          <Route path="/" exact component={DoctorListingPage} />
          <Route path="/signin" component={SignInPage} />
          <Route path="/doctors/:id/slots" component={AvailableSlotsPage} />
          <Route path="/book-appointment/:doctorId" component={BookAppointmentPage} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
