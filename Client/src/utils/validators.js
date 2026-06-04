import * as Yup from 'yup';

// ── Auth Schemas ───────────────────────────────────────────────────────────────

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

// ── Video Schemas ──────────────────────────────────────────────────────────────

export const videoUploadSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .max(5000, 'Description must be at most 5000 characters'),
  category: Yup.string()
    .required('Please select a category'),
  visibility: Yup.string()
    .oneOf(['public', 'private', 'unlisted'], 'Invalid visibility')
    .required('Please select visibility'),
});

// ── Community Schemas ──────────────────────────────────────────────────────────

export const createCommunitySchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .required('Community name is required'),
  description: Yup.string()
    .max(500, 'Description must be at most 500 characters'),
  isPublic: Yup.boolean(),
});

export const createChannelSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Channel name is required')
    .max(40, 'Channel name must be at most 40 characters')
    .matches(/^[a-z0-9-_]+$/, 'Use lowercase letters, numbers, dashes, or underscores')
    .required('Channel name is required'),
  type: Yup.string()
    .oneOf(['text', 'voice', 'announcement'], 'Invalid channel type')
    .required('Channel type is required'),
  description: Yup.string()
    .max(200, 'Description must be at most 200 characters'),
});

// ── Message Schemas ────────────────────────────────────────────────────────────

export const messageSchema = Yup.object({
  content: Yup.string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be at most 2000 characters')
    .required('Message is required'),
});

// ── Profile Schemas ────────────────────────────────────────────────────────────

export const updateProfileSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  bio: Yup.string()
    .max(300, 'Bio must be at most 300 characters'),
  email: Yup.string()
    .email('Enter a valid email'),
});
