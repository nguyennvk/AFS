"use client";
import React from 'react';
import HotelPage from './components';
import { Suspense } from 'react';
import HomepageButton from '@components/header/homepageButton';
import { ThemeToggle } from '@components/Theme';

export default function HotelPage1() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative pt-16 ml-20">
      <HomepageButton title='AFS.com'/>
      <div className='absolute top-0 right-0 mr-10 mt-5'>
      <ThemeToggle />
      </div>
      </div>
      <HotelPage />
    </Suspense>
  );
}

