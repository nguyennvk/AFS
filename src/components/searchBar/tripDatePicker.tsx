'use client';

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns"; // Used for date formatting

interface TripDatePickerProps {
  departureDate: string;
  returnDate?: string;
  isRoundTrip: boolean;
  onDepartureDateChange: (value: string) => void;
  onReturnDateChange: (value: string) => void;
}

export default function TripDatePicker({
  departureDate,
  returnDate,
  isRoundTrip,
  onDepartureDateChange,
  onReturnDateChange
}: TripDatePickerProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label htmlFor="departure" className="block text-sm font-medium mb-1">
          Departure Date
        </label>
        <input
          type="date"
          id="departure"
          value={departureDate}
          onChange={(e) => onDepartureDateChange(e.target.value)}
          min={today}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isRoundTrip && (
        <div>
          <label htmlFor="return" className="block text-sm font-medium mb-1">
            Return Date
          </label>
          <input
            type="date"
            id="return"
            value={returnDate}
            onChange={(e) => onReturnDateChange(e.target.value)}
            min={departureDate || today}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}
