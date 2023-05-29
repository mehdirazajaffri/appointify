import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../css/RegistrationPage.css';


const PatientRegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  const history = useHistory();

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
        '/patients/register_patient/',
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

      history.push('/');
    } catch (error) {
      console.log('Registration unsuccessful:', error.response.data);
      if (error.response && error.response.data && error.response.data.user) {
        // read all the keys of the user object into an array
        const userObjectKeys = Object.keys(error.response.data.user);
        // concatenate all the error messages from the array into a string
        const errorMessage = userObjectKeys.map((key) => {
          return `${key}: ${error.response.data.user[key]}`;
        }).join(' ');
        setError(errorMessage);
      } else {
        setError('Something went wrong. Please try again.');
      }
      console.error('Error registering patient:', error);
    }
  };

  return (
    <div>
      <h1>Patient Registration</h1>
      {error && <div className="error">{error}</div>}
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
