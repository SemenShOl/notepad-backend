import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { body } from "express-validator";
import UserModel from "../models/user.js";

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    try {
      const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        passwordHash,
      });
      const user = await doc.save();

      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secret123",
        {
          expiresIn: "30d",
        }
      );

      res.json({ ...user._doc, token });
    } catch (e) {
      res.status(401).json({ message: "Такая почта или логин уже существуют" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(402).json({ message: "Неверный логин или пароль" });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(403).json({ message: "Неверный логин или пароль " });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    res.json({ ...user._doc, token });
  } catch (e) {
    console.log(e);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
};
