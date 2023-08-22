import { Application, NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ApiError } from "../errors/ApiError";
import { logger } from "./logger";

export type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | any;

interface RouterProps {
  base?: string;
  middlewares?: Handler[];
}

export class Router {
  private base: string;
  private middlewares: Handler[];

  constructor(public app: Application, props?: RouterProps) {
    this.base = props?.base ?? "";
    this.middlewares = props?.middlewares ?? [];
  }

  public handle(handler: Handler) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await handler(req, res, next);

        return data && this.isSerializable(data) ? res.json(data) : res.send();
      } catch (error) {
        console.error(error);

        if (error instanceof z.ZodError) {
          return res
            .status(400)
            .json({ error: error.format(), success: false });
        }

        const status = error instanceof ApiError ? error.statusCode : 500;

        return res
          .status(status)
          .json({
            error: error instanceof Error ? error.message : error,
            success: false,
          });
      }
    };
  }

  private extends({
    base = this.base,
    middlewares = this.middlewares,
  }: RouterProps) {
    return new Router(this.app, { base, middlewares });
  }

  public isSerializable(obj: any): boolean {
    try {
      JSON.parse(JSON.stringify(obj));
      return true;
    } catch (error) {
      return false;
    }
  }

  group(base: string, callback: (router: Router) => any) {
    callback(this.extends({ base: this.base + base }));
    return this;
  }

  get(path: string, handler: Handler) {
    path = this.base + path;
    logger.info(`get ${path}`);
    this.app.get(path, ...this.middlewares, this.handle(handler));
    return this;
  }

  post(path: string, handler: Handler) {
    path = this.base + path;
    logger.info(`post ${path}`);
    this.app.post(path, ...this.middlewares, this.handle(handler));
    return this;
  }

  put(path: string, handler: Handler) {
    path = this.base + path;
    logger.info(`put ${path}`);
    this.app.put(path, ...this.middlewares, this.handle(handler));
    return this;
  }

  delete(path: string, handler: Handler) {
    path = this.base + path;
    logger.info(`delete ${path}`);
    this.app.delete(path, ...this.middlewares, this.handle(handler));
    return this;
  }

  patch(path: string, handler: Handler) {
    path = this.base + path;
    logger.info(`patch ${path}`);
    this.app.patch(path, ...this.middlewares, this.handle(handler));
    return this;
  }

  middleware(...middlewares: Handler[]) {
    return this.extends({ middlewares: [...this.middlewares, ...middlewares] });
  }
}
