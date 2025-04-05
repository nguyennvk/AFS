
import React from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../Theme';

interface HomepageButtonProps {
  title: string;
}

export default function HomepageButton({ title }: HomepageButtonProps) {
  const router = useRouter();

  // Handle click event inside the component
  const onClick = () => {
    router.push('/home');
  };

  return (
    <button
      onClick={onClick}
      className="bg-transparent cursor-pointer"
    >
      {title}
    </button>
  );
}
