import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_PRIVATE_KEY, { expiresIn: "24h" });
};

export const authToken = (req, res, next) => {
  const authToken = req.headers.token;

  if (!authToken)
    return res.status(401).send({
      status: 401,
      response: "Token not recibed",
    });

  jwt.verify(authToken, process.env.JWT_PRIVATE_KEY, (error, credentials) => {
    if (error)
      return res.status(403).send({
        status: 403,
        response: "No authorized",
      });
    req.user = credentials.user;
    next();
  });
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res.status(401).render("error", {
          mensaje: info.messages ? info.messages : info.toString(),
        });

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const extractCookie = (req) =>
  req && req.cookies ? req.cookies[process.env.COOKIE_NAME_JWT] : null;

export const authorization = (rol) => {
  return async (req, res, next) => {
    let token = req.headers.token;
    
      fetch("http://localhost:8080/api/sessions/current", {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if(data.status==200&&data.response.rol==rol){
            next()
          }else if(data.status==200&&data.response.rol!==rol){
            return res.status(401).send({
              status:401,
              response:`No autorizado: Solo los ${rol} pueden acceder a este contenido, tu rol es ${data.response.rol}`
            })
          }else{
            return res.status(401).send({
              status:401,
              response:"Token invalido o inexistente"
            })
          }
        });
  };
};
