import React from 'react';

interface LoginButtonProps {
  title: string;
  onClick?: () => void;
}


export default function LoginButton({ title, onClick }: LoginButtonProps) {
  return (
    <button
      className="cursor-pointer"

      onClick={onClick}
    >
      {title}
    </button>
  );
};
