import {Post} from "../../typeorm/entity/Post";
import {IPost} from "../../../type";

export default {
	Query: {
		getAllPosts: async () => {
			return await Post.find({relations: {author: true}});
		},
		getPost: async (_, {id}) =>
			await Post.findOne({where: {id}, relations: {author: true}}),
	},
	Mutation: {
		createPost: async (
			_,
			{data: {title, body, imageCover}}: IPost,
			{user}
		) => {
			if (!title || !body) {
				throw new Error("Invalid Data");
			}
			
			if (!user) {
				throw new Error("You must login to create a post");
			}
			
			return await Post.save({
				title,
				body,
				author: user,
				imageCover,
			});
		},
		updatePost: async (
			_,
			{data: {title, body, imageCover, id}}: IPost,
			{user}
		) => {
			if (!user) {
				throw new Error("You must login to create a post");
			}
			
			if (!id) {
				throw new Error("Invalid data");
			}
			
			const post = await Post.findOne({
				where: {id},
				relations: {author: true},
			});
			
			if (post?.author?.id !== user?.id) {
				throw new Error("You can't update this post");
			}
			
			if (title || body || imageCover) {
				if (title) post.title = title;
				if (body) post.body = body;
				if (imageCover) post.imageCover = imageCover;
				
				return await Post.save(post);
			} else {
				throw new Error("Invalid Data");
			}
		},
		deletePost: async (_, {id}, {user}) => {
			if (!user) {
				throw new Error("You must login to create a post");
			}
			
			if (!id) {
				throw new Error("Invalid data");
			}
			
			const post = await Post.findOne({
				where: {id},
				relations: {author: true},
			});
			
			if (post?.author?.id !== user?.id) {
				throw new Error("You can't remove this post");
			}
			
			await Post.remove(post);
			
			return true;
		},
	},
};
