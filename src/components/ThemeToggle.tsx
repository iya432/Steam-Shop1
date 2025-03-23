import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [animate, setAnimate] = useState(false);

  // Reset animation status after animation completes
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 500); // Match animation duration from CSS
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const handleToggle = () => {
    setAnimate(true);
    toggleDarkMode();
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-colors duration-200 ${
        isDarkMode
        ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      aria-label={isDarkMode ? 'Включить светлую тему' : 'Включить темную тему'}
      title={isDarkMode ? 'Включить светлую тему' : 'Включить темную тему'}
    >
      {isDarkMode ? (
        <SunIcon className={`w-5 h-5 theme-toggle-icon ${animate ? 'sun-icon-animate' : ''}`} />
      ) : (
        <MoonIcon className={`w-5 h-5 theme-toggle-icon ${animate ? 'moon-icon-animate' : ''}`} />
      )}
    </button>
  );
};

export default ThemeToggle;
