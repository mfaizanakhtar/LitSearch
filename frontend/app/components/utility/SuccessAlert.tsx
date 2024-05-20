import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import genericState from '@/app/states/genericState';

interface SuccessAlertProps {}

const SuccessAlert: React.FC<SuccessAlertProps> = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const { alertVisible, alertText, setAlertVisible } = genericState();

  useEffect(() => {
    let fadeOutTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (alertVisible) {
      // Reset the fadeOut state
      setFadeOut(false);

      // Start the fade-out effect after 2 seconds
      fadeOutTimer = setTimeout(() => {
        setFadeOut(true);
      }, 5000);

      // Hide the alert completely after the fade-out effect
      hideTimer = setTimeout(() => {
        setAlertVisible(false);
      }, 5500); // 2000ms + 500ms (duration of the fade-out transition)
    }

    // Clean up the timers when the component unmounts or visibility changes
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [alertVisible, setAlertVisible]);

  if (!alertVisible) return null;

  return (
    <div
      className={`z-50 fixed top-4 right-4 w-1/4 rounded-md bg-green-50 p-4 shadow-lg transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{alertText}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
              onClick={() => setFadeOut(true)}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;
