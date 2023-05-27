import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AvailableSlotsPage = () => {
  const { id } = useParams();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`/doctors/${id}/list_available_appointments/?date=2023-05-27`);
        setSlots(response.data);
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchSlots();
  }, [id]);

  return (
    <div>
      <h1>Available Slots Page</h1>
      {slots.map((slot) => (
        <div key={slot.time_slot}>
          <h2>{slot.doctor_name}</h2>
          <p>{slot.time_slot}</p>
          <p>{slot.date}</p>
        </div>
      ))}
    </div>
  );
};

export default AvailableSlotsPage;
