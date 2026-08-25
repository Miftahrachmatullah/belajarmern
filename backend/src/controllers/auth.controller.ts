import { Request, Response } from "express";
import * as yup from "yup";

import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";

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
      })
      res.status(200).json({
        message: "Register successful",
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async login(req: Request, res: Response) {
    const {
      identifier,
      password
    } = req.body as unknown as TLogin;
    try {
      // ambil data user berdasarkan "identifier" --> username dan email 

      const userByIdentifier = await UserModel.findOne({
        $or: [
          {
            email: identifier
          },
          {
            username: identifier,
          },
        ],
      });

      if(!userByIdentifier) {
        return res.status(403).json({
          message: "user not found",
          data: null
      });
      }

      // validasi password 
      const validatePassword: boolean = 
        encrypt(password) === userByIdentifier.password;

      if(!validatePassword) {
        return res.status(403).json({
          message: "invalid password",
          data: null
      });
      }

      const token  = generateToken({ 
        id: userByIdentifier._id, 
        role: userByIdentifier.role, 
      });

      res.status(200).json({
        message: "login successful",
        data: token,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async(req: Request, res: Response) {
    try {
      const user = req.user;
      res.status(200).json({
        message: "get user data successful",
        data: user,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async me(req: IReqUser, res: Response) {
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      res.status(200).json({
        message: "Success get user profile",
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
};