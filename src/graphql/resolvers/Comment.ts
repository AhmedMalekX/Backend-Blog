import {Comment} from "../../typeorm/entity/Comment";
import {Post} from "../../typeorm/entity/Post";
import {IComment} from "../../../type";

export default {
	Query: {
		getAllComments: async () =>
			await Comment.find({relations: {author: true, post: true}}),
		getCommentsByPostId: async (_, {postId}) => {
			const post = await Post.findOne({
				where: {id: postId},
				relations: {author: true, comments: true},
			});
			
			return await Comment.find({
				where: {id: post.comments.id},
				relations: {author: true, post: true},
			});
		},
		getCommentById: async (_, {id}) =>
			await Comment.findOne({
				where: {id},
				relations: {author: true, post: true},
			}),
	},
	Mutation: {
		createComment: async (
			_,
			{data: {body, postId}}: IComment,
			{user}
		) => {
			if (!user) {
				throw new Error("You must login to write a comment");
			}
			
			if (!body || !postId) {
				throw new Error("Invalid Data");
			}
			
			const post = await Post.findOne({
				where: {id: postId},
				relations: {author: true, comments: true},
			});
			
			return await Comment.save({body, post, author: user});
		},
	},
};
