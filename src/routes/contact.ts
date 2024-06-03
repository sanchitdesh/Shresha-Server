import express, { Router } from "express";
import { createContactForm } from "../controllers/contact.js";

const app: Router = express.Router();

app.post("/create", createContactForm);

export default app;
