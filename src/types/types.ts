import { NextFunction, Request, Response } from "express";

//====================================USER TYPES===========================

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

//====================================CONTROLLER TYPES===========================

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

//====================================PRODUCT TYPES===========================

export interface NewProductRequestBody {
  name: string;
  price: number;
  stock: number;
  category: string;
  color: string;
  description: string; // Added color property
  size: string;
}

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
  color?: string;
  size?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
  color?: string; // Added color property
  size?: string; // Added color property
}

export type InvalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};

//====================================ORDER TYPES===========================

export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  size: string;
  quantity: number;
  productId: string;
  color: string; // Added color property
  description: string; // Added color property
};

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}

export interface ContactProps {
  name: string;
  email: string;
  message: string;
  phone: string;
}
