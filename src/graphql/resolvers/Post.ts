import { Post } from "../../typeorm/entity/Post";
import { IPost } from "../../../type";
import { User } from "../../typeorm/entity/User";

export default {
  Query: {
    getAllPosts: async () => {
      return await Post.find({ relations: { author: true } });
    },
    getPost: async (_, { id }) =>
      await Post.findOne({ where: { id }, relations: { author: true } }),
  },
  Mutation: {
    createPost: async (
      _,
      { data: { title, body, authorId, imageCover } }: IPost
    ) => {
      if (!title || !body || !authorId) {
        throw new Error("Invalid Data");
      }

      const user = await User.findOne({ where: { id: authorId } });

      return await Post.save({
        title,
        body,
        author: user,
        imageCover,
      });
    },
  },
};
