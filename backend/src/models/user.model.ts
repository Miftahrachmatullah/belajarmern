import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";


export interface User {
  fullName: string;
  email: string;
  password: string;
  username: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>({
  fullName: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  username: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  role: {
    type: Schema.Types.String,
    enum: ["admin", "user"],
    default: "user",
  },
  profilePicture: {
    type: Schema.Types.String,
    default: "user.jpg",
  },
  isActive: {
    type: Schema.Types.Boolean,
    default: false,
  },
  activationCode: {
    type: Schema.Types.String,
  },
},
{
  timestamps: true,
});

UserSchema.pre("save", function (next) {
  const user = this;
  user.password = encrypt(user.password);
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
