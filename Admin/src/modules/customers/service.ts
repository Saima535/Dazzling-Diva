import { Types } from "mongoose";
import { z } from "zod";

import { connectToDatabase } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { issueCustomerToken } from "@/lib/customer-auth";
import { CustomerModel } from "@/models/customer";
import { OrderModel } from "@/models/order";
import { ProductModel } from "@/models/product";
import { WishlistModel } from "@/models/wishlist";

export const registerCustomerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  phone: z.string().default(""),
});

export const loginCustomerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function registerCustomer(input: z.input<typeof registerCustomerSchema>) {
  const values = registerCustomerSchema.parse(input);
  await connectToDatabase();

  const exists = await CustomerModel.findOne({ email: values.email.toLowerCase() });
  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  const customer = await CustomerModel.create({
    name: values.name,
    email: values.email.toLowerCase(),
    phone: values.phone,
    passwordHash: await hashPassword(values.password),
  });

  const token = await issueCustomerToken(String(customer._id));
  return {
    token,
    customer: {
      id: String(customer._id),
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
  };
}

export async function loginCustomer(input: z.input<typeof loginCustomerSchema>) {
  const values = loginCustomerSchema.parse(input);
  await connectToDatabase();
  const customer = await CustomerModel.findOne({ email: values.email.toLowerCase() });

  if (!customer) {
    throw new Error("Invalid email or password.");
  }

  const valid = await verifyPassword(customer.passwordHash, values.password);
  if (!valid) {
    throw new Error("Invalid email or password.");
  }

  customer.lastLoginAt = new Date();
  await customer.save();

  const token = await issueCustomerToken(String(customer._id));
  return {
    token,
    customer: {
      id: String(customer._id),
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
  };
}

export async function getCustomerOrders(customerId: string) {
  await connectToDatabase();
  return OrderModel.find({ customerId: new Types.ObjectId(customerId) })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getWishlist(customerId: string) {
  await connectToDatabase();
  const wishlist = await WishlistModel.findOne({
    customerId: new Types.ObjectId(customerId),
  }).lean();

  if (!wishlist?.productIds?.length) {
    return [];
  }

  return ProductModel.find({
    _id: { $in: wishlist.productIds },
    status: "published",
  }).lean();
}

export async function addToWishlist(customerId: string, productId: string) {
  await connectToDatabase();
  return WishlistModel.findOneAndUpdate(
    { customerId: new Types.ObjectId(customerId) },
    {
      $addToSet: { productIds: new Types.ObjectId(productId) },
    },
    { upsert: true, new: true },
  );
}

export async function removeFromWishlist(customerId: string, productId: string) {
  await connectToDatabase();
  return WishlistModel.findOneAndUpdate(
    { customerId: new Types.ObjectId(customerId) },
    {
      $pull: { productIds: new Types.ObjectId(productId) },
    },
    { new: true },
  );
}
