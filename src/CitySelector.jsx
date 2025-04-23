import React, { useState, useEffect } from 'react';

const CitySelector = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch countries on component mount
    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('https://crio-location-selector.onrender.com/countries');
                if (!response.ok) {
                    throw new Error('Failed to fetch countries');
                }
                const data = await response.json();
                setCountries(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    // Fetch states when a country is selected
    const handleCountryChange = async (e) => {
        const country = e.target.value;
        setSelectedCountry(country);
        setSelectedState('');
        setSelectedCity('');
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`https://crio-location-selector.onrender.com/country=${country}/states`);
            if (!response.ok) {
                throw new Error('Failed to fetch states');
            }
            const data = await response.json();
            setStates(data);
            setCities([]); // Reset cities when country changes
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch cities when a state is selected
    const handleStateChange = async (e) => {
        const state = e.target.value;
        setSelectedState(state);
        setSelectedCity('');
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`);
            if (!response.ok) {
                throw new Error('Failed to fetch cities');
            }
            const data = await response.json();
            setCities(data);
        } catch (err) {
            setError('Something went wrong. Please try again!');
        }finally {
            setLoading(false);
        }
    };

    // Display selected location
    const displaySelectedLocation = () => {
        if (selectedCity) {
            return `You selected ${selectedCity}, ${selectedState}, ${selectedCountry}`;
        }
        return '';
    };

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
    <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '1rem' }}>
        Select Location
    </h2>
    {loading && <p>Loading...</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}

    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <select
            value={selectedCountry}
            onChange={handleCountryChange}
            style={{ padding: '0.5rem', minWidth: '150px' }}
        >
            <option value="">Select Country</option>
            {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
            ))}
        </select>

        <select
            value={selectedState}
            onChange={handleStateChange}
            disabled={!selectedCountry}
            style={{ padding: '0.5rem', minWidth: '150px' }}
        >
            <option value="">Select State</option>
            {states.map((state) => (
                <option key={state} value={state}>{state}</option>
            ))}
        </select>

        <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
            style={{ padding: '0.5rem', minWidth: '150px' }}
        >
            <option value="">Select City</option>
            {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
            ))}
        </select>
    </div>
    {selectedCity && (
        <div id="selected-location" style={{ marginTop: '1rem', fontWeight: '500' }}>
            You selected {selectedCity}, {selectedState}, {selectedCountry}
        </div>
    )}
</div>

    );
};

export default CitySelector;