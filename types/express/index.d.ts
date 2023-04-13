import { AuthPayload } from "../../dto/Auth.dto";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: AuthPayload;
    }
  }
}
