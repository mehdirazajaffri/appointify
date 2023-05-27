import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const BookAppointmentForm = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone_number: '',
    message: '',
    time_slot: '9AM-10AM',
    date: ''
  });

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
        navigate('/');
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
          <InputLabel id="time-slot-label">Time Slot</InputLabel>
          <Select
            labelId="time-slot-label"
            name="time_slot"
            value={formData.time_slot}
            onChange={handleInputChange}
            required
          >
            <MenuItem value="9AM-10AM">9AM-10AM</MenuItem>
            <MenuItem value="10AM-11AM">10AM-11AM</MenuItem>
            <MenuItem value="11AM-12PM">11AM-12PM</MenuItem>
            <MenuItem value="12PM-1PM">12PM-1PM</MenuItem>
            <MenuItem value="1PM-2PM">1PM-2PM</MenuItem>
            <MenuItem value="2PM-3PM">2PM-3PM</MenuItem>
            <MenuItem value="3PM-4PM">3PM-4PM</MenuItem>
            <MenuItem value="4PM-5PM">4PM-5PM</MenuItem>
            <MenuItem value="5PM-6PM">5PM-6PM</MenuItem>
            <MenuItem value="6PM-7PM">6PM-7PM</MenuItem>
            <MenuItem value="7PM-8PM">7PM-8PM</MenuItem>
            <MenuItem value="8PM-9PM">8PM-9PM</MenuItem>
            <MenuItem value="9PM-10PM">9PM-10PM</MenuItem>
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
