import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

const validateRequest =
  (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    next();
  };

export default validateRequest;

