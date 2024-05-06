import React, { useState } from 'react';
import axios from 'axios';

const PropertyReportForm = () => {
    const [propertyId, setPropertyId] = useState('');
    const [downloadLink, setDownloadLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateReport = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:3001/api/generate-report/${propertyId}`, {
                responseType: 'blob', // important for downloading the PDF correctly
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadLink(url);
        } catch (err) {
            setError('Failed to generate report. Please check the property ID and try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Generate Property Insights Report</h1>
            <form onSubmit={handleGenerateReport}>
                <label>
                    Property ID:
                    <input
                        type="text"
                        value={propertyId}
                        onChange={(e) => setPropertyId(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>
            </form>
            {downloadLink && (
                <div>
                    <a href={downloadLink} download={`PropertyReport-${propertyId}.pdf`}>
                        Download Report
                    </a>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default PropertyReportForm;
