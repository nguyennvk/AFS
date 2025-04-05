import React from 'react';
import HomepageButton from './homepageButton';
import DropDownMenu from './dropDownMenu';
import { ThemeToggle } from '@components/Theme';

export default function AuthenticatedHeaderComponent() {
    return (
      <header className="bg-blue-600 text-white grid grid-cols-10 p-4 shadow-md fixed top-0 h-22 w-full z-10">
        <HomepageButton title="AFS.com" />
        <div className="col-span-9 flex justify-end items-center">
            <div className="container mx-auto padding-4 flex justify-end items-center space-x-4 mr-20">
            <DropDownMenu></DropDownMenu>
            </div>
            <ThemeToggle />
        </div>
      </header>
    );
  };
  
