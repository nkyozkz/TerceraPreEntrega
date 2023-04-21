import dotenv from "dotenv";
dotenv.config();
let modelo;

switch (process.env.factory) {
  case "FS":
    let { default: fsModel } = await import(
      "./dao/fileSystem/managers/cartManager.js"
    );
    modelo = fsModel;

    break;
  case "MONGO":
    let { CartsModel: mongoModel } = await import(
      "./dao/mongodb/cartsModel.js"
    );

    modelo = mongoModel;
    break;
  default:
    let { default: defaultModel } = await import("./dao/mongodb/cartsModel.js");

    modelo = defaultModel;
    break;
}
export let CartsModel = modelo;
