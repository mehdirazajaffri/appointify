import React, { useState } from 'react';
import axios from 'axios';
import '../css/RegistrationPage.css';


const PatientRegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      user: {
        username,
        email,
        phone_number: phoneNumber,
        first_name: firstName,
        last_name: lastName,
        password,
      },
      gender,
    };

    try {
      const response = await axios.post(
        'https://mehdijaffri.pythonanywhere.com/api/patients/register_patient/',
        requestBody
      );

      console.log('Registration successful:', response.data);

      // Reset the form fields
      setUsername('');
      setEmail('');
      setPhoneNumber('');
      setFirstName('');
      setLastName('');
      setPassword('');
      setGender('');
    } catch (error) {
      console.error('Error registering patient:', error);
    }
  };

  return (
    <div>
      <h1>Patient Registration</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
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
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default PatientRegistrationPage;
