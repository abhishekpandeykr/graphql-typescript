import { datas } from './db/index';
import {ApolloServer} from 'apollo-server-express';
import * as Express from 'express';
import {buildSchema} from 'type-graphql'
import { UserResolver, loginSecret } from './resolvers/user/UserResolver';
import "reflect-metadata"
import { formatError } from 'graphql';
import customAuthChecker from './authChecker';
import { verify } from 'jsonwebtoken';

const main = async () => {
    const app = Express(); 
    const {db, model} = datas
    const schema = await buildSchema({
        resolvers:[UserResolver],
        authChecker:customAuthChecker
    })

    const apolloServer = new ApolloServer({
        schema,
        formatError:formatError,
        context:({req, res}) => {
            return {res,db, model, req}
        }, 
    })
    // Applying Auth Middleware
    app.use((req, _, next) => {
        const authToken = req.headers.authorization as any;
        if(authToken){
            const data = verify(authToken, loginSecret) as any;
            (req as any).userId = data.userId
        }
        next()
    })

    apolloServer.applyMiddleware({app})

    app.listen(3000, "localhost", () => {
        console.log("Server is running at", 3000)
    });

};

main();