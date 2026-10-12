import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../../config/jwt";
import { createUser, findUserByEmail } from "./auth.service";
import { validateSignup, validateLogin } from "./auth.validation";

export const signup = async (req: Request, res: Response) => {
  try {
    const error = validateSignup(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const { name, email, password, role = "contributor" } = req.body;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(name, email, hashedPassword, role);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const error = validateLogin(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
