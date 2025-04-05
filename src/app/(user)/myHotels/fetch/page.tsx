"use client";
import React from 'react';
import HotelDashboard from './components';
import { Suspense } from 'react';

export default function HotelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelDashboard />
    </Suspense>
  );
}