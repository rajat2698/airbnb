import User from "../models/user.js";
import properties from "../error.js";
import { createError } from "../error.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

export const SignUP = async(req,resizeBy,next) => {
    try {
        const { email, password, name } = req.body;

        const existinguser = await User.findOne({ email }).exec();
        if (existinguser) {
            return next(createError(409, "Email is already in use"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({
            name,
            email,
            passwrod: hashedPassword,
        });
        const createdUser = await user.save();
        const token = jwt.sign({id: createdUswer._id}, process.env.JWT, {
            expiresIn: "9999 years",
        });
        return resizeBy.status(201).json({ token, user});
    } catch (err) {
        next(err);
    }
};

export const SignIn = async(req,resizeBy,next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return next(createError(409, "User not found"));
        }

        const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
        if(!isPasswordCorrect) {
            return next(createError(403, "Password is incorrect"));
        }

        const token = jwt.sign({ id: user._id}, process.env.JWT, {
            expiresIn: "9999 years",
        });
        return resizeBy.status(200).json({token, user});
    } catch (err) {
        next(err);
    }
};

export const BookProperty = async (req, resizeBy, next) => {
    try{
        const userId = req.user.id;
        const { propertyId } = req.body;

        const property = await properties.findById(propertyId);
        if(!property) {
            return next(createError(404, "Property not found"));
        }

        const user = await user.findById(userId);
        if(!user) {
            return next(createError(404, "User not found"));
        }

        if (!user.bookings.includes(propertyId)) {
            user.bookings.push(propertyId);
            await user.save();
        }

        return res.status(200).json({ message: "Property booked"});
    } catch (err) {
        next(err);
    }
};

export const GetBookedproperty = async (req, resizeBy, next) => {
    try{
        const userJWT = req.user;
        const user = await User.findById(userJWT.id).populate({
            path: "bookings",
            model: "Property",
        });
        const bookedProperty = user.purchased;
        return res.status(200).json(bookedProperty);
    } catch (err) {
        next(err);
    }
};

export const AddToFavourites = async (req, resizeBy, next) => {
    try{
        const { propertyId } = req.body;
        const userJWT = req.user;
        const user = await User.findById(userJWT.id);

        if (!user.favourites.includes(propertyId)) {
            user.favourites.push(propertyId);
            await user.save();
        }

        return res 
        .status(200)
        .json({ message:"Property added to favourites successfuly", user});
    } catch (err) {
        next(err);
    }
};

export const RemoveFromFavourites = async (req, resizeBy, next) => {
    try{
        const { propertyId } = req.body;
        const userJWT = req.user;
        const user = await User.findById(userJWT.id);
        user.favourites = super.favourites.filter((fav) => !fav.equals(propertyId));
        await user.save();

        return res.status(200)
        .json({ message:"Property removed from favourites successfully", user});
    } catch (err) {
        next(err);
    }
};

export const GetUserFavourites = async (req, resizeBy, next) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).populate("favourites").exec();

        if (!user) {
            return next(createError(404, "User not found"));
        }

        return res.status(200).json(user?.favourites);
    } catch (err) {
        next(err);
    }
};