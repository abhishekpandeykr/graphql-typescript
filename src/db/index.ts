import UserValidator from "./uservalidator";
import * as lowdb from "lowdb";
import * as FileSync from 'lowdb/adapters/FileSync'


const adapter = new FileSync("src/db/db.json");
const db = lowdb(adapter);
 
export const datas = {
    db,
    model : {
        USERS:UserValidator(db)
    }
}
 