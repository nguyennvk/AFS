'use client';

import React, { useState } from "react";

interface SearchToProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showLabel?: boolean;
}

export default function SearchTo({ value, onChange, placeholder = "Enter city or airport", showLabel = true }: SearchToProps) {
  return (
    <div>
      {showLabel && (
        <label htmlFor="to" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          To
        </label>
      )}
      <input
        type="text"
        id="to"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200"
        style={{ 
          backgroundColor: 'var(--form-input-bg)', 
          color: 'var(--input-text)',
          borderColor: 'var(--border)',
          borderWidth: '1px'
        }}
      />
    </div>
  );
}
