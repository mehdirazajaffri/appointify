import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../css/DoctorListingPage.css'; // Import the custom CSS file

const DoctorListingPage = () => {
  const [doctors, setDoctors] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/doctors/');
        setDoctors(response.data.results);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctorId) => {
    history.push(`/book-appointment/${doctorId}`);
  };

  return (
    <div className="doctor-listing-container">
      <h1>Doctor Listing Page</h1>
      {doctors.map((doctor) => (
        <div key={doctor.id} className="doctor-card">
          <img src={doctor.image} alt={doctor.user.username} className="doctor-image" />
          <div className="doctor-details">
            <h2>{doctor.user.username}</h2>
            <p>Specialization: {doctor.specialization}</p>
            <p>About: {doctor.about}</p>
            <p>Degree: {doctor.degree}</p>
            <p>Experience: {doctor.experience} years</p>
            <button
              className="book-appointment-button"
              onClick={() => handleBookAppointment(doctor.id)}
            >
              Book Appointment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorListingPage;
