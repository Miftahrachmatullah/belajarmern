import { Request, Response } from "express";
import * as yup from "yup";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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

      res.status(200).json({
        message: "Register successful",
        data: {
          fullName,
          username,
          email,
        },
      });
    } catch (error) {
      const err = error as Error;

      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};