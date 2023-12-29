import { body } from "express-validator";

export const registerValidator = [
  body("password", "Пароль больше 4-х символов").isLength({ min: 5 }),
  body("fullName", "Имя должно быть больше 2-х симоволов").isLength({
    min: 3,
  }),
  body("email", "Дожно быть email-ом").isEmail(),
];

export const postValidator = [
  body("title", "Заголовок должен быть не менее 3-х символов")
    .isLength({
      min: 3,
    })
    .isString(),
  body("text", "Текст должен быть не менее 3-х символов")
    .isLength({
      min: 3,
    })
    .isString(),
  body("tags", "Неверный тэг").isString().optional(),
];
