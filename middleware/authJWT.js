'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

/**
 * Verify Bearer JWT in Authorization header.
 * On success, attaches req.user = { id, role, name, email|nis }.
 */
function authJWT(req, res, next){
  const header = req.headers.authorization || '';
  const m = header.match(/^Bearer\s+(.+)$/i);
  if(!m){
    return res.status(401).json({ error: 'Unauthorized', message: 'Token tidak ditemukan' });
  }
  try {
    const payload = jwt.verify(m[1], JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    const reason = err.name === 'TokenExpiredError' ? 'Token kedaluwarsa' : 'Token tidak valid';
    return res.status(401).json({ error: 'Unauthorized', message: reason });
  }
}

/**
 * Restrict route to a specific role (or array of roles).
 *   router.delete('/:id', authJWT, requireRole('admin'), handler);
 */
function requireRole(...roles){
  const allowed = roles.flat();
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if(!allowed.includes(req.user.role)){
      return res.status(403).json({ error: 'Forbidden', message: 'Akses ditolak untuk peran ini' });
    }
    next();
  };
}

module.exports = { authJWT, requireRole };
