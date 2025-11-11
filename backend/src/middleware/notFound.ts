import type { RequestHandler } from 'express';

import { HTTP_STATUS } from '../utils/httpStatus';

const notFound: RequestHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
};

export default notFound;

