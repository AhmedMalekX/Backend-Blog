import * as bcrypt from "bcryptjs";
import { User } from "../../typeorm/entity/User";
import { LoginInput, RegisterInput } from "../../../type";
import { loginUser } from "../../helpes/loginUser";

export default {
  Query: {
    getAllUsers: async () => {
      return await User.find({});
    },

    getUser: async (_, { id }: { id: any }) => {
      return await User.findOne({
        where: {
          id,
        },
      });
    },
  },

  Mutation: {
    register: async (
      _,
      { data: { firstName, lastName, email, password } }: RegisterInput
    ) => {
      // Check for coming data
      if (!firstName || !lastName || !email || !password) {
        throw new Error("Invalid Credential");
      }

      // Check if email already exists
      const emailExists = await User.findOne({
        where: {
          email,
        },
      });

      if (emailExists) {
        throw new Error("Email Already Taken");
      }

      // Hash Password
      const salt = await bcrypt.genSalt(12);
      const encryptedPassword = await bcrypt.hash(password, salt);

      // Register User
      return User.save({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
      });
    },
    login: async (_, { data: { userMethod, password } }: LoginInput) => {
      // Check for coming data
      if (!userMethod || !password) {
        throw new Error("Invalid Credential");
      }

      await loginUser(userMethod, password);

      return "logged in user";
    },
  },
};
