import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const GarbageReportForm = () => {
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState({ lat: null, lng: null });

    // Function to get user location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Please allow location access.");
            }
        );
    }, []);

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!image || !description || !location.lat) {
            alert("Please fill in all fields.");
            return;
        }
        alert(`Image uploaded, Description: ${description}, Location: ${location.lat}, ${location.lng}`);
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
            <h2 className="text-xl font-semibold text-center mb-4">Report Garbage</h2>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2 font-medium">Upload Image of Garbage:</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded-md" required />

                <label className="block mt-4 mb-2 font-medium">Garbage Description:</label>
                <textarea
                    className="w-full p-2 border rounded-md"
                    rows="4"
                    placeholder="Describe the garbage here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>

                <label className="block mt-4 mb-2 font-medium">Location:</label>
                <input type="text" value={location.lat ? `Lat: ${location.lat}, Lng: ${location.lng}` : "Fetching location..."} readOnly className="w-full p-2 border rounded-md" />

                <div className="h-64 w-full mt-4 rounded-md overflow-hidden border">
                    {location.lat && (
                        <MapContainer center={[location.lat, location.lng]} zoom={15} className="h-full w-full">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[location.lat, location.lng]} />
                        </MapContainer>
                    )}
                </div>

                <button type="submit" className="w-full mt-4 bg-green-600 text-white p-3 rounded-md hover:bg-green-700">
                    Submit Report
                </button>
            </form>
        </div>
    );
};

export default GarbageReportForm;
