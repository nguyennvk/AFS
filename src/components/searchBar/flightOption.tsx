'use client';

import React from "react";

interface FlightOptionsCheckboxProps {
  isRoundTrip: boolean;
  onChange: (value: boolean) => void;
}

export default function FlightOptionsCheckbox({ isRoundTrip, onChange }: FlightOptionsCheckboxProps) {
  return (
    <div className="flex gap-4 mb-4">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          checked={!isRoundTrip}
          onChange={() => onChange(false)}
          className="w-4 h-4 focus:ring-blue-500"
          style={{
            backgroundColor: 'var(--input-bg)',
            borderColor: 'var(--border)'
          }}
        />
        <span style={{ color: 'var(--foreground)' }}>One Way</span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          checked={isRoundTrip}
          onChange={() => onChange(true)}
          className="w-4 h-4 focus:ring-blue-500"
          style={{
            backgroundColor: 'var(--input-bg)',
            borderColor: 'var(--border)'
          }}
        />
        <span style={{ color: 'var(--foreground)' }}>Round Trip</span>
      </label>
    </div>
  );
}

