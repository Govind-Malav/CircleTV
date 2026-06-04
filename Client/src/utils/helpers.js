/**
 * generateAvatarUrl — UI Avatars fallback
 */
export const generateAvatarUrl = (name = '', size = 80) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7C3AED&color=fff&size=${size}&bold=true`;
};

/**
 * getVideoThumbnailUrl — returns thumbnail or a placeholder gradient
 * (Can be extended to use Cloudinary transforms)
 */
export const getVideoThumbnailUrl = (url, width = 480) => {
  if (!url) return null;
  // If Cloudinary, inject resize transform
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},c_fill/`);
  }
  return url;
};

/**
 * copyToClipboard — writes text to clipboard, returns promise
 */
export const copyToClipboard = async (text) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  // Fallback
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.opacity = '0';
  document.body.appendChild(el);
  el.select();
  const success = document.execCommand('copy');
  document.body.removeChild(el);
  return success;
};

/**
 * generateInviteLink — build a shareable watch party URL
 */
export const generateInviteLink = (type, id) => {
  const base = window.location.origin;
  if (type === 'watchparty') return `${base}/watch-party/${id}`;
  if (type === 'community') return `${base}/community/join/${id}`;
  return `${base}/${type}/${id}`;
};

/**
 * clamp — restrict number between min and max
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * debounce — returns a debounced version of fn
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * throttle — returns a throttled version of fn
 */
export const throttle = (fn, limit = 100) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
};

/**
 * groupBy — group an array by a key
 */
export const groupBy = (arr, keyFn) => {
  return arr.reduce((acc, item) => {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * noop — does nothing (useful as default prop)
 */
export const noop = () => {};

/**
 * isValidUrl — basic URL check
 */
export const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * sleep — Promise-based delay
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
