import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import {
  CreateCustomerInput,
  CustomerEditInput,
  CustomerLoginInput,
  OrderInput,
} from "../dto";
import { Customer, Food, Order } from "../models";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  SendOtp,
  ValidatePassword,
} from "../utility";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerInputs = plainToClass(CreateCustomerInput, req.body);

    const inputErrors = await validate(customerInputs, {
      validationError: { target: true },
    });
    if (inputErrors.length > 0) {
      return res.status(400).json(inputErrors);
    }

    const { email, phone, password } = req.body;

    const existingCustomer = await Customer.findOne({
      email: email.toLowerCase(),
    });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ message: "This email address is already in use!" });
    }

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    const createdCustomer = await Customer.create({
      email: email.toLowerCase(),
      password: userPassword,
      phone: phone,
      salt: salt,
      otp: otp,
      otpExpiry: expiry,
      firstName: "",
      lastName: "",
      address: "",
      verified: false,
      lat: 0,
      lng: 0,
    });

    if (createdCustomer) {
      await SendOtp(otp, phone);

      const signature = GenerateSignature({
        _id: createdCustomer._id,
        email: createdCustomer.email,
        verified: createdCustomer.verified,
      });

      return res.status(201).json({
        signature,
        verified: createdCustomer.verified,
        email: createdCustomer.email,
      });
    }

    return res.status(400).json({ message: "Error while signing up!" });
  } catch (e: any) {
    console.log(e.message);
    next(e);
  }
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(CustomerLoginInput, req.body);
  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }

  const { email, password } = req.body;

  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const validPassword = await ValidatePassword(password, customer.password);
    if (validPassword) {
      const signature = GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      return res.status(200).json({
        signature,
        email: customer.email,
        verified: customer.verified,
      });
    }
  }

  return res.status(400).send({ message: "Invalid credentials!" });
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp } = req.body;
    const customer = req.user;

    if (customer) {
      const profile = await Customer.findById(customer._id);

      if (
        profile &&
        profile.otp === parseInt(otp) &&
        profile.otpExpiry >= new Date()
      ) {
        profile.verified = true;
        const updatedProfile = await profile.save();

        const signature = GenerateSignature({
          _id: updatedProfile._id,
          email: updatedProfile.email,
          verified: updatedProfile.verified,
        });

        return res.status(200).json({
          signature,
          verified: updatedProfile.verified,
          email: updatedProfile.email,
        });
      }
    }
    return res.status(400).json({ message: "OPT verification failed!" });
  } catch (e: any) {
    console.log(e.message);
    next(e);
  }
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expiry } = GenerateOtp();

      profile.otp = otp;
      profile.otpExpiry = expiry;

      await profile.save();
      await SendOtp(otp, profile.phone);

      return res
        .status(200)
        .json({ message: "OTP sent to your registered phone number." });
    }
  }

  return res.status(400).json({ message: "Error generateing OTP!" });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      return res.status(200).json(profile);
    }
  }

  return res.status(400).json({ message: "Error getting user profile!" });
};

export const UpdateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const customerInputs = plainToClass(CustomerEditInput, req.body);
      const inputErrors = await validate(customerInputs, {
        validationError: { target: false },
      });

      if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
      }

      const { firstName, lastName, address } = req.body;

      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const updatedProfile = await profile.save();

      return res.status(200).json(updatedProfile);
    }
  }

  return res.status(400).json({ message: "Error updating profile!" });
};

export const AddToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");

    let cartItems = [];
    const foodItem = <OrderInput>req.body;
    const food = await Food.findById(foodItem._id);

    if (food && profile) {
      cartItems = profile.cart;

      if (cartItems.length) {
        const existingFood = cartItems.find(
          (item) => item.food._id.toString() === foodItem._id
        );

        if (existingFood) {
          const index = cartItems.indexOf(existingFood);
          if (foodItem.unit > 0) {
            cartItems[index] = { food, unit: foodItem.unit };
          } else {
            cartItems.splice(index, 1);
          }
        } else {
          cartItems.push({ food, unit: foodItem.unit });
        }
      } else {
        cartItems.push({ food, unit: foodItem.unit });
      }

      profile.cart = cartItems as any;
      const updatedProfile = await profile.save();

      return res.status(200).json({ cart: updatedProfile.cart });
    }
  }

  return res.status(400).json({ message: "Error adding to cart!" });
};

export const GetCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    if (profile) {
      return res.status(200).json({ cart: profile.cart });
    }
  }

  return res.status(400).json({ message: "Cart is empty!" });
};

export const DeleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      profile.cart = [] as any;
      const updatedProfile = await profile.save();

      return res.status(200).json({ cart: updatedProfile.cart });
    }
  }

  return res.status(400).json({ message: "Cart alredy empty!" });
};

export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    const profile = await Customer.findById(customer._id);

    const cart = <[OrderInput]>req.body;

    let cartItems = [];

    let netAmount = 0;

    let vendorId = null;

    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods.forEach((food) => {
      cart.forEach(({ _id, unit }) => {
        if (food._id.toString() === _id) {
          vendorId = food.vendorId;
          netAmount += food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });

    if (cartItems.length) {
      const currentOrder = await Order.create({
        orderId: orderId,
        vendorId: vendorId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: "COD",
        PaymentResponse: "",
        orderStatus: "Waiting",
        remarks: "",
        deliveryId: "",
        appliedOffers: false,
        offerId: null,
        readyTime: 45,
      });

      if (currentOrder) {
        profile.orders.push(currentOrder);
        profile.cart = [] as any;

        const updatedProfile = await profile.save();

        if (updatedProfile) {
          return res.status(200).json({ order: currentOrder });
        }
      }
    }
  }

  return res.status(400).json({ message: "Error creating order!" });
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");

    if (profile) {
      return res.status(200).json({ orders: profile.orders });
    }
  }

  return res.status(400).json({ message: "Error getting orders!" });
};

export const GetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");

    if (order) {
      return res.status(200).json({ order: order });
    }
  }

  return res.status(400).json({ message: "Error getting order!" });
};
