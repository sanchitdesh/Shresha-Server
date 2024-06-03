import { NextFunction, Request, Response } from "express";
import { Contact } from "../models/contact.js";
import { ContactProps } from "../types/types.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({
  path: "./.env"
});

// Creating transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, // your email address
    pass: process.env.PASSWORD // your email password
  },
  tls: {
    rejectUnauthorized: false // This is necessary for some SMTP servers
  }
});

export const createContactForm = async (
  req: Request<{}, {}, ContactProps>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, message, phone } = req.body;

    // Validate request body
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    console.log(name, email, message, phone);

    // Save contact to the database
    await Contact.create({ name, email, message, phone });

    // Define mail options
    let mailOptions = {
      from: email, // sender address
      to: process.env.EMAIL, // list of receivers
      subject: "Contact Form Submission", // Subject line
      text: `You have received a new message from ${name} (${email}, ${phone}):\n\n${message}` // plain text body
    };
    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Success",
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};
