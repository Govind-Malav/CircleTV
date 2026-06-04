import { useEffect, useRef } from 'react';

/**
 * useDebounce — returns a debounced version of value after delay ms
 * @param {any} value
 * @param {number} delay - milliseconds (default 300)
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = require('react').useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
export { useDebounce };
