import express from "express";
import passport from "passport";

import dotenv from "dotenv";
import { authorization, authToken } from "../../middlewares/authMiddlewares.js";
import { DataUserDTO } from "./dto/userDataDto.js";

dotenv.config();
const router = express.Router();

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: 400, response: "Usuario no identificado" });
    }

    return res.status(200).send({
      status: 200,
      message:
        "Inicio de sesion exitoso, recuerde no compartir el token con nadie y utilizarlo en el header con la key auth",
      response: req.user,
    });
  }
);

router.get("/faillogin", (req, res) => {
  return res.status(401).send({
    status: 401,
    response: "Usuario y/o contraseña incorrectos",
  });
});

//Todo --> REGISTER
router.post(
  "/createUser",
  passport.authenticate("register", {
    failureRedirect: "/session/failregister",
  }),
  async (req, res) => {
    return res.status(200).send({
      status: 200,
      response: "Usuario creado exitosamente",
    });
  }
);

router.get("/failregister", (req, res) => {
  return res.status(401).send({
    status: 400,
    response: "Email ya registrado, ingresa otro email",
  });
});

router.get("/current", authToken, async (req, res) => {
  let returnUser = new DataUserDTO(req.user);
  res.status(200).send({
    status: 200,
    response: returnUser,
  });
});

export default router;
