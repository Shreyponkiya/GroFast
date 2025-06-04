import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-8 lg:px-25">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          © 2025 GroFast. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-gray-700">
            Terms
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            Privacy
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;