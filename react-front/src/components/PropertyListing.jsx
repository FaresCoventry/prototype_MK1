import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import propPic from '../assets/bigproperty.jpg'
import smallPic from '../assets/smallproperty.jpg'
import './propertylisting.css'
import PropertyReportForm from './PropertyReportForm';

const PropertyListing = () => {

    const { id } = useParams();
    const [property, setProperty] = useState(null);
  
    useEffect(() => {
      fetch(`http://localhost:3001/api/properties/${id}`)
        .then(response => response.json())
        .then(data => {
          setProperty(data);
        })
        .catch(error => console.log(error));
    }, [id]);
  
    if (!property) return <div>Loading...</div>;


    const categoryMapping = {
        3: "Villa",
        6: "Apartment",
        7: "Building",
        9: "House",
        21: "Furnished apartment"
      };

    const containerStyle = {
        width: '100%', // Adjusted for full width or specify a larger fixed width
        height: '500px' // Increased height for a larger map view
      };

    const center = {
        lat: property.location.lat,
        lng: property.location.lng
      };


  return (
    <div className="max-w-screen-xl mx-auto" style={{ width: '1605px' }}>
      {/* Main container */}
      <div className="bg-white">
        {/* Property Content Section */}
        <div className="grid grid-cols-3 gap-6 p-5">
          {/* Main Info */}
          <div className="col-span-2">
            <img src={propPic} alt="Property" className="mb-4"/>
            <h1 className="text-2xl font-bold mb-2">SAR {property.price}</h1>
            <div className="font-medium mb-2">{property.beds} Beds &bull; {property.wc} Baths &bull; {property.area} sqm</div>
            <ul className="list-disc list-inside mb-4">
              <li>Sophisticated {property.beds} Bedroom {property.furnished ? 'furnished' : 'not furnished'} {categoryMapping[property.category]} for Purchase in {property.city}, {property.district}</li>
              <li>{property.area} sq.m.</li>
              <li>Chiller Free</li>
              <li>Spacious Living and Dining Area</li>
            </ul>
          </div>

          {/* Sidebar */}
          <div>
            <div className="mb-4">
              <img src={smallPic} alt="Agent" className="mb-2" />
              <div className="text-lg font-medium">Fares Ali</div>
              <button className="bg-blue-600 text-white rounded px-4 py-2 mb-2">Call</button>
              <button className="bg-blue-600 text-white rounded px-4 py-2">Email</button>
            </div>
            <div className="p-4 bg-gray-100">
              <div className="font-medium mb-2">Prospecter Real Estate</div>
              <div className="font-medium mb-2">ID: {property.id}</div>
              <PropertyReportForm />
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="px-5 py-4 grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Property Information</h3>
            <table className="text-sm">
              <tr><td className="pr-4 py-1">Type</td><td>{categoryMapping[property.category]}</td></tr>
              <tr><td className="pr-4 py-1">Bedrooms</td><td>{property.beds}</td></tr>
              <tr><td className="pr-4 py-1">Living Rooms</td><td>{property.livings}</td></tr>
              <tr><td className="pr-4 py-1">Bathrooms</td><td>{property.wc}</td></tr>
              <tr><td className="pr-4 py-1">Area</td><td>{property.area} sq.m.</td></tr>
              <tr><td className="pr-4 py-1">Kitchens</td><td>{property.ketchen} sq.m.</td></tr>
              <tr><td className="pr-4 py-1">Furnished</td><td>{property.furnished ? 'Yes' : 'No'}</td></tr>
              <tr><td className="pr-4 py-1">Added on</td><td>{property.createdAt}</td></tr>
            </table>
          </div>

            {/* Google Map Section */}
            <div>
                <h3 className="font-semibold mb-3">Property Location</h3>
                <LoadScript
                    googleMapsApiKey="AIzaSyDyfWB6bmr8PsGb_UVjLQvzbgMD-7crbfs" // Replace with your API key
                    >
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={15}
                    >
                        <Marker
                            position={center}
                            icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                            }}
                        />
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListing;
