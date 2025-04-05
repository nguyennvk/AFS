"use client";
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function UserInfoForm() {
  const router = useRouter();
  const [passport, setPassport] = useState('');
  
  const searchParams = useSearchParams();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassport(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const personalInfo = await fetch('/api/user/getInfo', {
      method: 'GET',
      credentials: 'include',
    });
    if (!personalInfo.ok) {
      console.error('Error fetching personal info:', personalInfo.statusText);
      router.push("/home")
      return;
    }

    const personalInfoData = await personalInfo.json();
    if (personalInfoData.error) {
      console.error('Error from server:', personalInfoData.error);
      router.push("/home")
      return;
    }
    const flightIds = searchParams.get('flightId');
    const req = await fetch('/api/booking/add-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flightIds: [flightIds],
        hotel_id: null,
        room_number: null,
        start_date: null,
        end_date: null,
        firstName: personalInfoData.account_first_name,
        lastName: personalInfoData.account_last_name,
        email: personalInfoData.account_email,
        passportNumber: passport,
      }),
    })
    if (!req.ok) {
      console.error('Error submitting form:', req.statusText);
      return;
    }
    const res = await req.json();
    if (res.error) {
      console.error('Error from server:', res.error);
      return;
    }
    // Handle successful response
    alert('Booking successful!');
    router.push("/home")


    // You can send the data via fetch or API here
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold">Please enter your passport number</h2>

        <input
          type="text"
          name="passportNumber"
          placeholder="Passport Number"
          value={passport}
          onChange={handleChange}
          className="w-full p-2 border border-gray-400 rounded text-gray-500 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          onSubmit={handleSubmit}
          className="w-full bg-blue-600 rounded hover:bg-blue-700 hover:shadow-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
