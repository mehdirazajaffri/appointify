import React, { useEffect, useState } from 'react';
import DoctorsList from '../components/DoctorsList';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/doctors/', {
          headers: {
            accept: 'application/json'
          }
        });
        const data = await response.json();
        setDoctors(data.results);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Doctors List</h1>
      <DoctorsList doctors={doctors}/>
    </div>
  );
};

export default DoctorsPage;
