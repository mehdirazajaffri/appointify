// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box } from '@mui/system';
// import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
// import { css } from '@emotion/react';
// import styled from '@emotion/styled';

// const DoctorsList = ({ doctors }) => {
//   const navigate = useNavigate();

//   const handleBookAppointment = (doctorId) => {
//     navigate(`/book-appointment/${doctorId}`);
//   };

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center">
//       {doctors.map(doctor => (
//         <DoctorCard key={doctor.id}>
//           <CardMedia
//             component="img"
//             src={doctor.image}
//             alt={doctor.user.first_name}
//             css={css`
//               height: 200px;
//             `}
//           />
//           <CardContent>
//             <Typography variant="h5" component="div" align="center">
//               {doctor.user.first_name} {doctor.user.last_name}
//             </Typography>
//             <Typography variant="subtitle1" align="center">
//               {doctor.specialization}
//             </Typography>
//             <Typography variant="body2" align="center">
//               Degree: {doctor.degree}
//             </Typography>
//             <Typography variant="body2" align="center">
//               Experience: {doctor.experience} years
//             </Typography>
//             <Typography variant="body2" align="center">
//               Available Time Slots:
//             </Typography>
//             <ul>
//               {doctor.time_slots.map((timeSlot, index) => (
//                 <li key={index}>{timeSlot}</li>
//               ))}
//             </ul>
//             <Button
//               variant="contained"
//               onClick={() => handleBookAppointment(doctor.id)}
//               fullWidth
//             >
//               Book Appointment
//             </Button>
//           </CardContent>
//         </DoctorCard>
//       ))}
//     </Box>
//   );
// };

// const DoctorCard = styled(Card)`
//   width: 300px;
//   margin: 10px;
// `;

// export default DoctorsList;

import React, { useState, useEffect } from 'react';
import { useNavigation, useParams } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const BookAppointmentForm = () => {
  const { doctorId } = useParams();
  const navigate = useNavigation();
  const [formData, setFormData] = useState({
    phone_number: '',
    message: '',
    time_slot: '',
    date: ''
  });
  const [doctorsList, setDoctorsList] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    // Fetch doctors list
    fetch('http://localhost:8000/api/doctors/')
      .then(response => response.json())
      .then(data => {
        setDoctorsList(data.results);
      })
      .catch(error => {
        console.error('Error fetching doctors list:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch time slots
    const formattedDate = formData.date.split('-').reverse().join('-');
    fetch(`http://localhost:8000/api/doctors/${doctorId}/list_available_appointments/?date=${formattedDate}`)
      .then(response => response.json())
      .then(data => {
        setTimeSlots(data);
      })
      .catch(error => {
        console.error('Error fetching time slots:', error);
      });
  }, [doctorId, formData.date]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/patients/book_appointment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          doctor: parseInt(doctorId),
        }),
      });
      if (response.ok) {
        // Handle successful booking
        navigate('/success');
      } else {
        // Handle error
        console.error('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Phone Number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
        />
        <FormControl>
          <InputLabel id="doctor-label">Doctor</InputLabel>
          <Select
            labelId="doctor-label"
            name="doctor"
            value={doctorId}
            onChange={handleInputChange}
            required
          >
            {doctorsList.map(doctor => (
              <MenuItem key={doctor.id} value={doctor.id}>{doctor.user.username}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="time-slot-label">Time Slot</InputLabel>
          <Select
            labelId="time-slot-label"
            name="time_slot"
            value={formData.time_slot}
            onChange={handleInputChange}
            required
          >
            {timeSlots.map(slot => (
              <MenuItem key={slot.time_slot} value={slot.time_slot}>{slot.time_slot}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleInputChange}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Book Appointment
        </Button>
      </form>
    </div>
  );
};

export default BookAppointmentForm;
