import React from 'react'

const ScrollToTop = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // for smooth scrolling
        });
        };
  return <>
        <button
        onClick={scrollToTop}
        className="fixed bottom-5 text-xs opacity-50 left-5 bg-primaryLight hover:bg-primary hover:text-white text-grey-100 font-bold py-2 px-4 rounded-full shadow-lg"
        aria-label="Scroll to top"
        >
        Back to top
        </button>
    </>
}

export default ScrollToTop