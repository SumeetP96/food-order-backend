import { Types } from "mongoose";

export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodTypes: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface VendorLoginInput {
  email: string;
  password: string;
}

export interface EditVendorInput {
  name: string;
  address: string;
  phone: string;
  foodTypes: [string];
}

export interface EditVendorService {
  serviceAvailable: boolean;
}

export interface VendorPayload {
  _id: Types.ObjectId;
  email: string;
  name: string;
  foodTypes: [string];
}
