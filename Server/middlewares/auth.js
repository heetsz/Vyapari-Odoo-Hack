import User from '../models/User.js';

// Require a signed cookie named 'user'. Attach `req.user` with DB user if found.
export const requireAuth = async (req, res, next) => {
  try {
    const signed = req.signedCookies && req.signedCookies.user;
    if (!signed) return res.status(401).json({ message: 'Unauthorized' });

    let parsed;
    try {
      parsed = JSON.parse(signed);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid cookie' });
    }

    if (!parsed || !parsed.id) return res.status(401).json({ message: 'Unauthorized' });

    // Fast-path: trust signed cookie contents (skip DB) when AUTH_TRUST_COOKIE env var is truthy.
    // This is much faster because it avoids a DB round-trip on every request.
    // Tradeoff: if the user record is deleted/disabled in DB, the cookie will still be accepted.
    const trustCookie = process.env.AUTH_TRUST_COOKIE === 'true' || process.env.AUTH_TRUST_COOKIE === '1';
    if (trustCookie) {
      // attach minimal user shape similar to what controllers expect
      req.user = { _id: parsed.id, email: parsed.email, role: parsed.role };
      return next();
    }

    // Default: fetch fresh user from DB but use lean() and project only needed fields for speed
    const user = await User.findById(parsed.id).select('_id email role').lean();
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default requireAuth;
