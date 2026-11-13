'use strict';

/**
 * FPDS — Input Validation Middleware
 * Manual validation (no extra libraries needed).
 * Returns 422 Unprocessable Entity on invalid input.
 */

const VALID_PLATFORMS = ['twitter', 'instagram', 'linkedin', 'facebook', 'tiktok'];

/**
 * Validate POST /api/profiles body.
 * Required: platform, handle, displayName, followers, following, postsCount, accountAgeDays
 * Optional: bio, profileUrl
 */
function validateProfile(req, res, next) {
  const errors = [];
  const {
    platform,
    handle,
    displayName,
    followers,
    following,
    postsCount,
    accountAgeDays,
    bio,
    profileUrl,
  } = req.body;

  // platform
  if (!platform || typeof platform !== 'string') {
    errors.push({ field: 'platform', message: 'Required string.' });
  } else if (!VALID_PLATFORMS.includes(platform.toLowerCase())) {
    errors.push({ field: 'platform', message: `Must be one of: ${VALID_PLATFORMS.join(', ')}` });
  }

  // handle
  if (!handle || typeof handle !== 'string' || handle.trim().length === 0) {
    errors.push({ field: 'handle', message: 'Required non-empty string.' });
  }

  // displayName
  if (!displayName || typeof displayName !== 'string' || displayName.trim().length === 0) {
    errors.push({ field: 'displayName', message: 'Required non-empty string.' });
  }

  // numeric fields — must be non-negative integers
  const numericFields = { followers, following, postsCount, accountAgeDays };
  for (const [fieldName, value] of Object.entries(numericFields)) {
    if (value === undefined || value === null) {
      errors.push({ field: fieldName, message: 'Required non-negative integer.' });
    } else {
      const num = Number(value);
      if (!Number.isInteger(num) || num < 0) {
        errors.push({ field: fieldName, message: 'Must be a non-negative integer.' });
      }
    }
  }

  // optional bio
  if (bio !== undefined && typeof bio !== 'string') {
    errors.push({ field: 'bio', message: 'Must be a string when provided.' });
  }

  // optional profileUrl — basic check
  if (profileUrl !== undefined && typeof profileUrl !== 'string') {
    errors.push({ field: 'profileUrl', message: 'Must be a string when provided.' });
  }

  if (errors.length > 0) {
    return res.status(422).json({ error: 'Validation failed', details: errors });
  }

  // Normalise types so controllers receive clean data
  req.body.platform      = platform.toLowerCase();
  req.body.followers     = Number(followers);
  req.body.following     = Number(following);
  req.body.postsCount    = Number(postsCount);
  req.body.accountAgeDays = Number(accountAgeDays);

  next();
}

module.exports = { validateProfile };

