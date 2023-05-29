import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/AppointmentPage.css';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsSignedIn(false);
        return;
      }

      try {
        const response = await axios.get('/patients/appointments/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        console.log(response.data);
        setAppointments(response.data);
        setIsSignedIn(true);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="container">
      <h1>My Appointments</h1>
      {!isSignedIn && <p>Please sign in to view your appointments.</p>}
      {isSignedIn && appointments.length === 0 && <p>No appointments found.</p>}
      {isSignedIn && appointments.length > 0 && (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <h3>{appointment.doctor.user.first_name} {appointment.doctor.user.last_name}</h3>
              <p>Date: {appointment.date}</p>
              <p>Time Slot: {appointment.time_slot}</p>
              <p>Status: {appointment.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentsPage;
