import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 absolute bottom-0 w-full">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} - Ashis, Jiaxin, Tamanna, Tanaya, Vatsal
        </p>
      </div>
    </footer>
  );
};

export default Footer;