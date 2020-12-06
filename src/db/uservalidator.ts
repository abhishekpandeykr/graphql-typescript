import { nanoid } from "nanoid"

export default function UserValidator(db:any) {
    return {
        register(newUser:any) {
            const user = {...newUser, id:nanoid()}
            return db.get("users").push(user).write()
        },

        isUserAlreadyExist(newUser:any){
            const user = db.get("users").filter({email:newUser.email}).value()
            if(user && !user.length){
                this.register(newUser)
               return {
                   data:true,
                   message:`${newUser.email} Registered Successfully`
               }
            } else {
                return {
                    data:false,
                    message:`${newUser.email} already Exist`
                }
            }
        },

        findUserByEmail(user:any) {
            return db.get("users").find({email:user.email}).value()
        }
    }
}