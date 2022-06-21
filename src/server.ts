import {ApolloServer} from "apollo-server-express";
import {ApolloServerPluginDrainHttpServer} from "apollo-server-core";
import * as express from "express";
import * as http from "http";
import * as path from "path";
import {makeExecutableSchema} from "@graphql-tools/schema";
import {loadFilesSync} from "@graphql-tools/load-files";
import {config} from "dotenv";

config({path: path.join(__dirname, "../", "config.env")});

import {AppDataSource} from "./typeorm/data-source";

export async function startApolloServer() {
	AppDataSource.initialize()
		.then(() => {
			console.log("Connected To Database 🤖");
		})
		.catch((err) => {
			console.error("Error during Connecting To Database", err);
		});
	
	const typeDefs = loadFilesSync(
		path.join(__dirname, "graphql/typeDefs/**/*.graphql")
	);
	const resolvers = loadFilesSync(
		path.join(__dirname, "graphql/resolvers/**/*.{js,ts}")
	);
	
	const schema = makeExecutableSchema({typeDefs, resolvers});
	
	const app = express();
	const httpServer = http.createServer(app);
	const server = new ApolloServer({
		schema,
		csrfPrevention: true,
		cache: "bounded",
		plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
	});
	await server.start();
	server.applyMiddleware({app});
	await new Promise<void>((resolve) =>
		httpServer.listen({port: 4000}, resolve)
	);
	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}
