import React, { useState, useEffect } from 'react';
import Property from './Property';
import Navbar from './Navbar';
import PropertyReportForm from './PropertyReportForm';
import './dashboard.css'

function Dashboard() {
  
    const [preferences, setPreferences] = useState({
      beds: '',
      price: '',
      livings: '',
      wc: '',
      area: '',
      ketchen: '',
      furnished: '',
      city: '',
      district: '',
      width: '',
      length: ''
    })
  
    const [recommendations, setRecommendations] = useState([]);
    const [recommendation, setRecommendation] = useState([]);
  
    const handleChange = (e) => {
      const {name, value} = e.target;
      setPreferences({ ...preferences, [name]: value});
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      setRecommendations([]);
      
      fetch('http://localhost:3001/submit-prefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setRecommendations(data); // Update the state with the recs
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    };
  
    useEffect(() => {
      fetch('http://localhost:3001/get-recommendations')
          .then(response => response.json())
          .then(data1 => {
              setRecommendation(data1);
          })
          .catch(error => console.error('Error fetching recommendations:', error));
    }, []); // The empty array ensures this effect runs only once after the initial render
  
  
    return (
      <div className='App max-w-screen-xl mx-auto'>
        <Navbar />
        
        <div className='dashboard-container bg-white'>
          
          <div className='search-container '>
            <div className='search-prefs'>
              <h2>Property Prefrences</h2>
              <form onSubmit={handleSubmit}>
                {/*Dynamically generate input fields based on the prefrences state */}
                {Object.keys(preferences).map((key) => (
                  <div key={key}>
                    <label>
                      {key.charAt(0).toUpperCase() + key.slice(1)};
                      <input 
                        type="text"
                        name={key}
                        value={preferences[key]}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                ))}
                <button type='submit'>Submit</button>
              </form>
            </div>
  
          
            <div className='search-results'>
              <h2>Search Results</h2>
              <div className='property-list'>
                {recommendations.map((rec, index) => (
                  <Property key={index} {...rec} />
                ))}
              </div>
            </div>
          </div>
          
          <div >  
            <div>
              <h2>Recommended Properties</h2>
              <div className='property-list'>
                {recommendation.map((rec, index) => (
                  <Property key={index} {...rec} />
                ))}
              </div>
            </div>
          </div>
  
          <div className='report-form'>
            <PropertyReportForm />
          </div>
  
        </div>
  
      </div>
    );
  };
  export default Dashboard;