import { UsersServices } from "./userServices.js";

export class UserController{
    constructor(){
        this.userService=new UsersServices()
    }
    createUser=(user)=>{
        return this.userService.createUser(user)
    }
    searchUser=(email)=>{
        return this.userService.searchUser(email)
    }
    searchUserById=(id)=>{
        return this.userService.searchUserById(id)
    }
}