'use client';

import Link from 'next/link';
import { ThemeToggle } from '../Theme';
import HomepageButton from './homepageButton';

export default function Header() {
  return (
    <header className="fixed top-0 w-full backdrop-blur-sm p-4 z-10 transition-all duration-300 border-b dark:border-gray-800" style={{ backgroundColor: 'var(--header-bg)' }}>
      <div className="container mx-auto flex justify-between items-center">
        <HomepageButton title='AFS.com'></HomepageButton>
        <div className="flex items-center space-x-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-300 transition-all duration-200"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ 
              backgroundColor: 'var(--button-bg)',
              color: 'var(--button-text)'
            }}
          >
            Register
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 