import { AuthPayload } from "../../dto/Auth.dto";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthPayload;
    }
  }
}
