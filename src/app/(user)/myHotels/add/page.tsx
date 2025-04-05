"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

const AddHotel = () => {
  const [hotelName, setHotelName] = useState('');
  const [hotelStreet, setHotelStreet] = useState('');
  const [hotelCountry, setHotelCountry] = useState('');
  const [hotelCity, setHotelCity] = useState('');
  const [hotelLocationLong, setHotelLocationLong] = useState('');
  const [hotelLocationLat, setHotelLocationLat] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');
  const [hotelLogo, setHotelLogo] = useState<File | null>(null);
  const [hotelImages, setHotelImages] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    // Fetch the list of countries when the component loads
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries'); // Replace with your API endpoint
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    // Fetch the list of cities when the selected country changes
    const fetchCities = async () => {
      if (!hotelCountry) return;

      try {
        const response = await fetch(`/api/cities?country=${hotelCountry}`); // Replace with your API endpoint
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, [hotelCountry]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setHotelLogo(file);
  };

  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setHotelImages(e.target.files);
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^(-?\d*\.?\d*)$/.test(value)) {
      setHotelLocationLong(value);
    }
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^(-?\d*\.?\d*)$/.test(value)) {
      setHotelLocationLat(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', hotelName);
    formData.append('street', hotelStreet);
    formData.append('country', hotelCountry);
    formData.append('city', hotelCity);
    formData.append('long', hotelLocationLong);
    formData.append('lat', hotelLocationLat);
    formData.append('description', hotelDescription);

    if (hotelLogo) formData.append('logo', hotelLogo);
    if (hotelImages) {
      Array.from(hotelImages).forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await fetch('/api/hotel/add', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();
    console.log(data);
    setIsSubmitting(false);

    if (response.status == 201) {
      alert('Hotel added successfully');
      router.push('/myHotels');
    } else {
      alert('Error adding hotel '+data.error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-white">Add Your New Hotel</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white font-semibold">Hotel Name</label>
          <input
            type="text"
            placeholder="Hotel Name"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-white font-semibold">Country</label>
          <select
            value={hotelCountry}
            onChange={(e) => setHotelCountry(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 text-white"
            required
          >
            <option value="">Select Country</option>
            {countries?.length > 0 ? (
            countries.map((country) => (
                <option key={country} value={country}>
                {country}
                </option>
            ))
            ) : (
            <option disabled>Loading countries...</option>
            )}
        </select>
        </div>

        <div>
          <label className="block text-white font-semibold">City</label>
          <select
            value={hotelCity}
            onChange={(e) => setHotelCity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 text-white"
            required
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold">Street Address</label>
          <input
            type="text"
            placeholder="Street Address"
            value={hotelStreet}
            onChange={(e) => setHotelStreet(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-semibold">Longitude</label>
            <input
              type="text"
              placeholder="Longitude"
              value={hotelLocationLong}
              onChange={handleLongitudeChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-white font-semibold">Latitude</label>
            <input
              type="text"
              placeholder="Latitude"
              value={hotelLocationLat}
              onChange={handleLatitudeChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-white font-semibold">Hotel Description</label>
          <textarea
            placeholder="Description"
            value={hotelDescription}
            onChange={(e) => setHotelDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white font-semibold">Hotel Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-white font-semibold">Additional Hotel Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleImageUpload}
              className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full p-3 mt-4 text-white font-semibold cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Hotel...' : 'Add Hotel'}
        </button>
      </form>
    </div>
  );
}
export default AddHotel;