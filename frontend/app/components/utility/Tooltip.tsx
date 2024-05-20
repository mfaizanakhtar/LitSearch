import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactElement;
  text: string;
  isBottom?:boolean;
  widthClass?: string; // Optional prop to pass a width class
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, isBottom }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 mb-2 p-2 text-sm text-white bg-gray-800 rounded-lg shadow-sm z-50 transition-opacity duration-300 ${
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-95' 
        } ${isBottom ? 'top-full mt-2' : 'bottom-full'}`}
        style={{ whiteSpace: 'nowrap' }} // Ensures the text does not wrap to the next line
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
