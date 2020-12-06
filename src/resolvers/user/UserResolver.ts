import { RegisterInput } from './input';
import "reflect-metadata"
import { Arg, Authorized, Ctx, Mutation, Query, Resolver, } from "type-graphql";
import * as bc from 'bcryptjs'
import { Context } from "vm";
import {sign} from "jsonwebtoken"

export const loginSecret = "MAZA_HAI_ZINDAGI"


@Resolver()
export class UserResolver {
    @Authorized()
    @Query(() => String , {name:"helloWorld"})
    hello(){
        return "Hi Therer"
    }

    @Mutation(() => String)
    async register(@Arg("input"){email, password, firstName, lastName}:RegisterInput, @Ctx() context:Context)
    {
        const hashedPassword = await bc.hash(password, 12);
        const user = {email, password:hashedPassword, firstName, lastName};
        const response = context.model.USERS.isUserAlreadyExist(user);
        return response.message
    }

    async isValidUser(user:any, {model,res}:any){
        const getUser = await model.USERS.findUserByEmail(user);
        if(getUser){
            const isUserAvlbl = await bc.compare(user.password,getUser.password);
            if(isUserAvlbl) {
                const accessToken = sign({userId:getUser.id},loginSecret, {expiresIn:"10d"});
                // const refreshToken = sign({userId:getUser.id}, loginSecret, {expiresIn:'7d'});
                // res.cookie('refresh-token', refreshToken,  { expires: new Date(Date.now() + 3600000), httpOnly: true },{ domain: 'localhost' });
                res.cookie('access-token', accessToken, {expires:new Date(Date.now() +900000),  httpOnly: true },{ domain: 'localhost' })
                return accessToken
            } else {
                return 'Not Authorized'
            }
        }
        return "No Auth"
    }

    @Mutation(() => String)
    async login(@Arg("email")email:string, @Arg("password")password:string,@Ctx() context:Context){
        const isUserAuth = await this.isValidUser({email, password}, context);
        return isUserAuth
    }

}