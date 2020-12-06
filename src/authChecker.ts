import { AuthChecker } from "type-graphql";

const customAuthChecker:AuthChecker<any> = ({ context:{req} }) =>{
    if(req && req.userId){
        return true;  
    }
    return false
}

export default customAuthChecker;