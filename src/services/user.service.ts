import User from "../models/user.model";
import IUser from "../interfaces/user.interface";
import constants from "../config/constants.config";
import _ from "lodash";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
const {MAXAGE, SECRET} =  constants;

export default class UserService {

    //checks if user exists
    async userExists(emailOrId: string) {
        const user = await User.find({emailOrId});
        return !(_.isEmpty(user));
    }

    //finds a user by email or id
    async find(data: string) {
        if (isValidObjectId(data)) {
            return await this.findById(data);
        } else {
            return await this.findByEmail(data);
        }
    }
    
    //finds a user by email
    async findByEmail(email: string) {
        return await User.findOne({email}, "-__v");
    }

    //finds a user by id
    async findById(id: string) {
        return await User.findById(id, "-__v");
    }

    //create room
    async createUser(user: IUser) {
        return await User.create(user);
    }

    //get all users
    async getAllUsers() {
        return await User.find({}, "-__v");
    }

    //edit user details with id
    async editUserById(id: string, obj: Partial<IUser>) {
        return await User.findByIdAndUpdate(id, { $set: obj }, { new: true });
    }

    //deleting a user details with an id
    async deleteUserById(id: string) {
        return await User.findByIdAndDelete(id);
    }

    //creates a json web token
    generateAuthToken (user: IUser) {
        return jwt.sign({
            fullName: user.fullName,
            email: user.email,
            role: user.role
        }, SECRET, {
            expiresIn: MAXAGE
        });
    };
}