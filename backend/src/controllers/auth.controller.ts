import { Request, Response } from "express";
import * as yup from "yup";

import UserModel from "../models/user.model.js";
import { encrypt } from "../utils/encryption.js";
import { generateToken } from "../utils/jwt.js";
import { IReqUser } from "../middlewares/auth.middleware.js";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = yup.object({
  fullName: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required(),
});

export default {
  async register(req: Request, res: Response) {
    try {
      const {
        fullName,
        username,
        email,
        password,
        confirmPassword,
      } = req.body as TRegister;

      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName,
        username,
        email,
        password,
      });

      const user = result.toObject();
      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({
        message: "Register successful",
        data: userWithoutPassword,
      });
    } catch (error) {
      const err = error as Error;

      return res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body as TLogin;

      const user = await UserModel.findOne({
        $or: [
          { email: identifier },
          { username: identifier },
        ],
      });

      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials",
          data: null,
        });
      }

      const validatePassword =
        encrypt(password) === user.password;

      if (!validatePassword) {
        return res.status(401).json({
          message: "Invalid credentials",
          data: null,
        });
      }

      const token = generateToken({
        id: user._id,
        role: user.role,
      });

      return res.status(200).json({
        message: "Login successful",
        data: token,
      });
    } catch (error) {
      const err = error as Error;

      return res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async me(req: IReqUser, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          message: "Unauthorized",
          data: null,
        });
      }

      const result = await UserModel.findById(req.user.id);

      if (!result) {
        return res.status(404).json({
          message: "User not found",
          data: null,
        });
      }

      return res.status(200).json({
        message: "Success get user profile",
        data: result,
      });
    } catch (error) {
      const err = error as Error;

      return res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};