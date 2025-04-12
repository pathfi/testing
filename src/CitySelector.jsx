import React, { useState, useEffect } from 'react';

const CitySelector = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    // Fetch countries on component mount
    useEffect(() => {
        const fetchCountries = async () => {
            const response = await fetch('https://crio-location-selector.onrender.com/countries');
            const data = await response.json();
            setCountries(data);
        };
        fetchCountries();
    }, []);

    // Fetch states when a country is selected
    const handleCountryChange = async (e) => {
        const country = e.target.value;
        setSelectedCountry(country);
        setSelectedState('');
        setSelectedCity('');
        const response = await fetch(`https://crio-location-selector.onrender.com/country=${country}/states`);
        const data = await response.json();
        setStates(data);
        setCities([]); // Reset cities when country changes
    };

    // Fetch cities when a state is selected
    const handleStateChange = async (e) => {
        const state = e.target.value;
        setSelectedState(state);
        setSelectedCity('');
        const response = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`);
        const data = await response.json();
        setCities(data);
    };

    // Display selected location
    const displaySelectedLocation = () => {
        if (selectedCity) {
            return `You selected ${selectedCity}, ${selectedState}, ${selectedCountry}`;
        }
        return '';
    };

    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginTop:'20px'}}>
            <h1>Select Your Location</h1>
            <div>
                <label htmlFor="country">Select Country:</label>
                <select id="country" value={selectedCountry} onChange={handleCountryChange}>
                    <option value="">--Select Country--</option>
                    {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="state">Select State:</label>
                <select id="state" value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
                    <option value="">--Select State--</option>
                    {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="city">Select City:</label>
                <select id="city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState}>
                    <option value="">--Select City--</option>
                    {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>
            <div id="selected-location">{displaySelectedLocation()}</div>
        </div>
    );
};

export default CitySelector;