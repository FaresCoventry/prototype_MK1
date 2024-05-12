// src/components/Property.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import propPic from '../assets/propertyPicture.jpg'
import './Property.css'; // Make sure to create a corresponding CSS file

const Property = ({ id, price, beds, wc, area, ketchen, furnished, city, district, width, length }) => {

  let navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/property/${id}`); // assuming you want to navigate to this route
  };

  return (
    <div className='property-card'>
      <img src={propPic} alt="Property" className='property-image' />
      <div className='property-details'>
        <h3>Price: {price}</h3>
        <h2>{city}</h2>
        <h2>{id}</h2>
        <p>{district}</p>
        <div className='property-info'>
          <p>Beds: {beds}</p>
          <p>Baths: {wc}</p>
          <p>Area sqm: {area}</p>
          {/* Add more details as necessary */}
        </div>
        <button className='invest-button' onClick={handleNavigate}>Buy Property</button>
      </div>
    </div>
  );
};

export default Property;
