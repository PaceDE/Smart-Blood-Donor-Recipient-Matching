import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLocationDot

} from '@fortawesome/free-solid-svg-icons';


async function fetchAddressByCoords(lat, lng) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    if (!res.ok) throw new Error('Failed reverse geocode');
    const data = await res.json();
    return data.display_name || 'Address not found';
}

async function fetchCoordsByAddress(address) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    if (!res.ok) throw new Error('Failed geocode');
    const data = await res.json();
    if (data.length === 0) throw new Error('Address not found');
    return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        address: data[0].display_name,
    };
}

function ClickableMap({ setCoordinates, setAddress }) {
    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            try {
                const address = await fetchAddressByCoords(lat, lng);
                setAddress("");
                setCoordinates({ lat, lng, address });
            } catch {
                setCoordinates({ lat, lng, address: 'Error fetching address' });
            }
        },
    });
    return null;
}
function RecenterMap({ lat, lng }) {
    const map = useMap();
    map.setView([lat, lng]);
    return null;
}

const LocationPicker = ({coordinates,setCoordinates}) => {
    const [address, setAddress] = useState('');
   
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGeocode = async () => {
        if (!address.trim()) {
            setError('Please enter an address');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            const result = await fetchCoordsByAddress(address);
            setCoordinates(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full mx-auto p-5 border-1 border-gray-300 rounded-xl">
            <div className=''>
                <div className="flex items-center gap-x-5">
                    <FontAwesomeIcon icon={faLocationDot} className="text-red-500 text-2xl" />
                    <h3 className="text-[25px] font-medium">Select Yout Location</h3>
                </div>
            </div>

            <div className="mb-5 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter nearest Landmark then select precisely.."
                    className="flex-grow px-4 py-2 text-lg placeholder:text-[12px] md:placeholder:text-lg rounded-md h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
                    onKeyPress={(e) => e.key === 'Enter' && handleGeocode()}
                />
                <button
                    onClick={handleGeocode}
                    disabled={isLoading}
                    className="flex items-center text-center gap-2 px-5 py-3 text-white font-semibold rounded-md transition duration-200 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800">
                    {isLoading ? 'Searching...' : 'Find Location'}
                </button>
            </div>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            <div className="mb-4 bg-[#f0fdf4] p-5 rounded-xl">
                <p className="text-[#16a34a]">
                    <strong>Address:</strong> {coordinates.address}
                </p>
                <p className='text-gray-600'>
                    <strong>&#91;Latitude , Longitude&#93; :</strong> &#91;{coordinates.lat.toFixed(6)} , {coordinates.lng.toFixed(6)} &#93;
                </p>
               
            </div>

            <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
                <MapContainer
                    center={[coordinates.lat, coordinates.lng]}
                    zoom={13}
                    className="h-full w-full"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[coordinates.lat, coordinates.lng]}>
                        <Popup>{coordinates.address}</Popup>
                    </Marker>
                    <ClickableMap setCoordinates={setCoordinates} setAddress={setAddress} />
                    <RecenterMap lat={coordinates.lat} lng={coordinates.lng} />
                </MapContainer>
            </div>
        </div>
    );
};

export default LocationPicker;
