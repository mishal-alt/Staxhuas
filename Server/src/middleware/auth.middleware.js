import { verifyAccessToken } from '../utils/token.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    console.log('AUTH_ERROR: No token provided');
    throw new ApiError(401, 'Not authorized, token failed or missing', 'AUTH_ERROR');
  }

  try {
    const decoded = verifyAccessToken(token);
    console.log('Decoded Token ID:', decoded.id);
    req.user = await User.findById(decoded.id)
      .select('-password')
      .populate({
        path: 'batch',
        populate: { path: 'course' }
      });
    if (!req.user) {
      console.log('AUTH_ERROR: User not found for ID', decoded.id);
      throw new ApiError(401, 'Not authorized, user not found', 'AUTH_ERROR');
    }
    next();
  } catch (error) {
    console.log('AUTH_ERROR: Token verification failed:', error.message);
    throw new ApiError(401, 'Not authorized, token failed', 'AUTH_ERROR');
  }
});

export const authMiddleware = protect;

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action', 'AUTH_ERROR');
    }
    next();
  };
};

