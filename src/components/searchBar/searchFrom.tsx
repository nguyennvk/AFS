'use client';

import React, { useState } from "react";

interface SearchFromProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showLabel?: boolean;
}

export default function SearchFrom({ value, onChange, placeholder = "Enter city or airport", showLabel = true }: SearchFromProps) {
  return (
    <div>
      {showLabel && (
        <label htmlFor="from" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          From
        </label>
      )}
      <input
        type="text"
        id="from"
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
