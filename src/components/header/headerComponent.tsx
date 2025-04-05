"use client"
import React from 'react';
import HomepageButton from './homepageButton';
import RegisterButton from './registerButton';
import LoginButton from './loginButton';
import { useRouter } from 'next/navigation';
export default function HeaderComponent( ) {
    const router = useRouter();
    return (
      <header className="bg-blue-600 text-white grid grid-cols-10 p-4 shadow-md fixed top-0 w-full z-10">
        <HomepageButton title="AFS.com" />
        <div className="col-span-9 flex justify-end items-center">
            <div className="container mx-auto padding-4 flex justify-end items-center space-x-4">
                <RegisterButton title="Register" />
                <LoginButton title="Login" onClick={()=>{router.push("/login")}}/>
            </div>
        </div>
      </header>
    );
  };
  
