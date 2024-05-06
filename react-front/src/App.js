import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PropertyListing from './components/PropertyListing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/property/:id" element={<PropertyListing />} />
      </Routes>
    </Router>
  );
}

export default App;
