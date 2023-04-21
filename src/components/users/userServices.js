import { UsersModel } from "./dao/mongodb/usersModel.js";

export class UsersServices{
    constructor(){
        this.userModel=new UsersModel()
    }
    createUser=(user)=>{
        return this.userModel.createUser(user)
    }
    searchUser=(email)=>{
        return this.userModel.searchUser(email)
    }
    searchUserById=(id)=>{
        return this.userModel.searchUserById(id)
    }
}
