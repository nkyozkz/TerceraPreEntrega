import { ProductsServices } from "./productsServices.js";
import mongoose from "mongoose";

export class ProductsController {
  constructor() {
    this.productsServices = new ProductsServices();
  }
  isValidProduct = (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return this.productsServices.isValidProduct(id);
    } else {
      return false;
    }
  };
  getAllProducts = (req) => {
    return this.productsServices.getAllProducts(req);
  };
  addProduct = (req) => {
    return this.productsServices.addProduct(req);
  };
  getProductWhitId = (req) => {
    let id = req.params.pid;
    if (mongoose.Types.ObjectId.isValid(id)) {
      return this.productsServices.getProductsWithId(id);
    }
    return {
      status: 400,
      response: "Formato de id no valido",
    };
  };
  updateProducts = (req) => {
    let idActualizar = req.params.pid;
    if (mongoose.Types.ObjectId.isValid(idActualizar)) {
      let nuevaInformacion = req.body;
      return this.productsServices.updateProducts(
        idActualizar,
        nuevaInformacion
      );
    } else {
      return {
        status: 400,
        response: "Coloca un id valido",
      };
    }
  };
  deleteProducts = async (req) => {
    let idEliminar = req.params.pid;
    if (mongoose.Types.ObjectId.isValid(idEliminar)) {
      return this.productsServices.deleteProducts(idEliminar);
    } else {
      return {
        status: 400,
        response: "Coloca un id valido",
      };
    }
  };
}
