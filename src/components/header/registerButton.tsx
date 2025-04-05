"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

interface RegisterButtonProps {
    title: string;
    className?: string;
}


export default function RegisterButton({ title }: RegisterButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={()=>{
        router.push("/register");      
      }} className="bg-blue-500 text-white p-4 shadow-md cursor-pointer hover:bg-blue-700 hover:shadow-lg transition-all rounded-lg cursor-pointer"
    >
      {title}
    </button>
  );
};
