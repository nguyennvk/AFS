"use client";
import React from 'react';
import ReservationPage from './components';
import { Suspense } from 'react';

export default function Reservation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReservationPage />
    </Suspense>
  );
}