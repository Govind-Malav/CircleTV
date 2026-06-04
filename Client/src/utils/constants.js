// ── App-wide constants ────────────────────────────────────────────────────────

export const APP_NAME = 'CircleTV';
export const APP_TAGLINE = 'Stream. Share. Together.';

// API
export const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL   = import.meta.env.VITE_APP_SOCKET_URL || 'http://localhost:5000';

// Auth
export const ACCESS_TOKEN_KEY  = 'token';
export const USER_KEY          = 'user';
export const THEME_KEY         = 'circletv_theme';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const SHORTS_PAGE_SIZE  = 10;
export const MESSAGES_PAGE_SIZE = 30;

// Video categories
export const VIDEO_CATEGORIES = [
  'All',
  'Gaming',
  'Music',
  'Education',
  'Technology',
  'Comedy',
  'Sports',
  'News',
  'Cooking',
  'Travel',
  'Fitness',
  'Science',
  'Fashion',
  'Art',
  'Podcasts',
  'Film & Animation',
];

// Video quality options
export const VIDEO_QUALITY_OPTIONS = [
  { label: '1080p HD', value: '1080p' },
  { label: '720p HD',  value: '720p'  },
  { label: '360p',     value: '360p'  },
  { label: 'Auto',     value: 'auto'  },
];

// Video visibility
export const VIDEO_VISIBILITY = {
  PUBLIC:   'public',
  PRIVATE:  'private',
  UNLISTED: 'unlisted',
};

// Chat message types
export const MESSAGE_TYPES = {
  TEXT:        'text',
  IMAGE:       'image',
  VIDEO_SHARE: 'video_share',
  EMOJI:       'emoji',
  FILE:        'file',
};

// Community roles (ordered by authority)
export const COMMUNITY_ROLES = {
  OWNER:     'owner',
  ADMIN:     'admin',
  MODERATOR: 'moderator',
  MEMBER:    'member',
};

export const ROLE_WEIGHTS = {
  owner:     4,
  admin:     3,
  moderator: 2,
  member:    1,
};

// Community channel types
export const CHANNEL_TYPES = {
  TEXT:         'text',
  VOICE:        'voice',
  ANNOUNCEMENT: 'announcement',
};

// Watch party status
export const PARTY_STATUS = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  ENDED:   'ended',
};

// Notification types
export const NOTIFICATION_TYPES = {
  LIKE:            'like',
  COMMENT:         'comment',
  SUBSCRIBE:       'subscribe',
  MENTION:         'mention',
  REPLY:           'reply',
  WATCHPARTY_INV:  'watchparty_invite',
  COMMUNITY_INV:   'community_invite',
  MESSAGE:         'message',
};

// Reaction emojis for Watch Party
export const PARTY_REACTIONS = ['👍', '❤️', '😂', '😮', '🔥'];

// Keyboard shortcuts (Watch/Video player)
export const VIDEO_SHORTCUTS = {
  PLAY_PAUSE: ' ',
  MUTE:       'm',
  FULLSCREEN: 'f',
  SEEK_BACK:  'ArrowLeft',
  SEEK_FWD:   'ArrowRight',
  VOL_UP:     'ArrowUp',
  VOL_DOWN:   'ArrowDown',
};

// Upload limits
export const MAX_VIDEO_SIZE_MB   = 500;
export const MAX_IMAGE_SIZE_MB   = 5;
export const MAX_THUMBNAIL_SIZE  = 5 * 1024 * 1024; // 5MB bytes
export const MAX_VIDEO_SIZE      = MAX_VIDEO_SIZE_MB * 1024 * 1024;

// Typing debounce
export const TYPING_DEBOUNCE_MS = 500;
export const TYPING_CLEAR_MS   = 3000;

// Search debounce
export const SEARCH_DEBOUNCE_MS = 300;
