import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../css/BookAppointmentPage.css"

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        const response = await axios.get(
          `https://mehdijaffri.pythonanywhere.com/api/doctors/${doctorId}/list_available_appointments/?date=${date}`
        );
        setTimeSlots(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching available time slots:', error);
      }
    };

    fetchAvailableTimeSlots();
  }, [doctorId, date]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      date,
      email,
      phone_number: phoneNumber,
      message,
      doctor: doctorId,
      time_slot: selectedTimeSlot,
    };

    const isPatient = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'https://mehdijaffri.pythonanywhere.com/api/patients/book_appointment/',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(isPatient && { Authorization: `Token ${isPatient}` }),
          },
        }
      );

      console.log('Appointment booked successfully:', response.data);
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <div>
      <h1>Book an Appointment</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Time Slot:</label>
          <select value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)} required>
            <option value="">Select a time slot</option>
            {timeSlots.map((slot) => (
              <option key={slot.time_slot} value={slot.time_slot}>
                {slot.time_slot}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>
        <div>
          <label>Message:</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
        </div>
        <div>
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
