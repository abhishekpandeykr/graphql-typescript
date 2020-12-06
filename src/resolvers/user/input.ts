import { Field, InputType } from "type-graphql";
import "reflect-metadata"
import { IsEmail, Length } from "class-validator";

@InputType()
export class RegisterInput{
    @Field()
    @IsEmail()
    // TODO:- Custom validator for check the email
    email:string

    @Field()
    password:string

    @Field()
    @Length(1,30)
    firstName:string

    @Field()
    lastName:string
}