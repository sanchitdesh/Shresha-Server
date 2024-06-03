import express from "express";
import { createContactForm } from "../controllers/contact.js";
const app = express.Router();
app.post("/create", createContactForm);
export default app;
