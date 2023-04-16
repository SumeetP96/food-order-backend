import { IsEmail, Length } from "class-validator";
import { Types } from "mongoose";

export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;
}

export interface CustomerPayload {
  _id: Types.ObjectId;
  email: string;
  verified: boolean;
}
