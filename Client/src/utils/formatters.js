/**
 * formatDuration — seconds → h:mm:ss or m:ss
 */
export const formatDuration = (seconds = 0) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
};

/**
 * formatCount — abbreviate large numbers
 * 1200000 → "1.2M", 5500 → "5.5K"
 */
export const formatCount = (num = 0) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return String(num);
};

/**
 * formatViews — with "views" suffix
 */
export const formatViews = (num = 0) => {
  return `${formatCount(num)} ${num === 1 ? 'view' : 'views'}`;
};

/**
 * formatFileSize — bytes → human-readable
 */
export const formatFileSize = (bytes = 0) => {
  if (bytes >= 1_073_741_824) return (bytes / 1_073_741_824).toFixed(1) + ' GB';
  if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(1) + ' MB';
  if (bytes >= 1_024) return (bytes / 1_024).toFixed(1) + ' KB';
  return bytes + ' B';
};

/**
 * formatRelativeTime — e.g. "2 hours ago", "just now"
 */
export const formatRelativeTime = (dateInput) => {
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  if (diffWeeks < 5) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * formatDate — full date string
 */
export const formatDate = (dateInput, opts = {}) => {
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...opts,
  });
};

/**
 * formatTime — HH:MM or HH:MM AM/PM
 */
export const formatTime = (dateInput, use24h = false) => {
  const date = new Date(dateInput);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24h,
  });
};

/**
 * truncate — clip text to maxLen chars, append ellipsis
 */
export const truncate = (str = '', maxLen = 100) => {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
};

/**
 * slugify — turn "My Video Title!" → "my-video-title"
 */
export const slugify = (str = '') => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

/**
 * getInitials — "John Doe" → "JD"
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
