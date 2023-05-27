import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import ProTip from "./ProTip";
import DoctorsPage from "./pages/DoctorPage";
import Navbar from "./Navbar";
import { Routes, Route } from "react-router-dom";
import BookAppointmentPage from "./pages/BookAppointmentPage";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function App() {
  return (
    <Container>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Appointify - Your Doctor at your FingerTip
        </Typography>
        <DoctorsPage />
        <Routes>
          <Route path="/book-appointment/:doctorId" element={<BookAppointmentPage />} />
        </Routes>
        
      </Box>
    </Container>
  );
}
