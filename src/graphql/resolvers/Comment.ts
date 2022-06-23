import {Comment} from "../../typeorm/entity/Comment";
import {Post} from "../../typeorm/entity/Post";
import {IComment, UComment} from "../../../type";

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
		updateComment: async (
			_,
			{data: {body, commentId}}: UComment,
			{user}
		) => {
			if (!user) {
				throw new Error("You must login to Update a comment");
			}
			
			if (!body || !commentId) {
				throw new Error("Invalid Data");
			}
			
			const comment = await Comment.findOne({
				where: {id: commentId},
				relations: {author: true, post: true},
			});
			
			if (user?.id !== comment.author.id) {
				throw new Error("You can't update this comment");
			}
			
			// comment.body = body;
			
			return await Comment.save({...comment, body});
		},
		deleteComment: async (_, {commentId}, {user}) => {
			if (!user) {
				throw new Error("You must login to Update a comment");
			}
			
			if (!commentId) {
				throw new Error("Invalid data");
			}
			
			const comment = await Comment.findOne({
				where: {id: commentId},
				relations: {author: true, post: true},
			});
			
			if (user?.id !== comment.author.id) {
				throw new Error("You can't delete this comment");
			}
			
			await Comment.remove(comment);
			
			return true;
		},
	},
};
