import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isUser }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Doctors</Link>
        </li>
        {isUser && (
          <li>
            <Link to="/appointments">My Appointments</Link>
          </li>
        )}
        {!isUser && (
          <>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/patient-registration">Register</Link>
            </li>
          </>
        )}

      </ul>
    </nav>
  );
};

export default Navbar;
