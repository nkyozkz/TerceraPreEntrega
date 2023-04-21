import mongoose from "mongoose";
import { cartsSchema } from "./cartSchema.js";
import { transport } from "../../../../services/email/nodemailer.js";
const cartsCollection = "carts";
import dotenv from "dotenv";
dotenv.config;
let model = mongoose.model(cartsCollection, cartsSchema);

export class CartsModel {
  constructor() {
    this.db = model;
  }
  getAll = async () => {
    return await this.db
      .find()
      .then((carrito) => {
        if (carrito.length == 0) throw new Error("required");
        return {
          status: 200,
          payload: {
            result: "success",
            carts: carrito,
          },
        };
      })
      .catch((err) => {
        return {
          status: 400,
          payload: {
            result: `No hay ningún carrito`,
          },
        };
      });
  };
  createCart = async () => {
    const nuevoCarrito = {
      products: [],
    };
    let result = await this.db.create(nuevoCarrito);
    return result;
  };
  getOneCart = async (id) => {
    let carrito = await this.db.find({ _id: id });
    if (carrito.length > 0) {
      return {
        status: 200,
        payload: {
          result: "success",
          response: carrito,
        },
      };
    } else {
      return {
        status: 400,
        payload: {
          result: `Carrito no encontrado`,
        },
      };
    }
  };
  isValidCart = async (id) => {
    let carrito = await this.db.find({ _id: id });
    if (carrito.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  addProduct = async (productoId, carritoId) => {
    let buscarProductoDentro = await this.db.findOne({
      "products._id": productoId,
    });
    if (buscarProductoDentro) {
      await this.db.updateOne(
        { "products._id": productoId },
        { $inc: { "products.$.quantity": +1 } }
      );
      return {
        status: 200,
        payload: {
          result: "success",
          response: { status: "Actualizado Correctamente" },
        },
      };
    }
    await this.db.updateOne(
      { _id: carritoId },
      { $push: { products: { _id: productoId }, quantity: 1 } }
    );
    return {
      status: 200,
      payload: {
        result: "success",
        response: { status: "Actualizado Correctamente" },
      },
    };
  };

  deleteProduct = async (productoId, carritoId) => {
    let buscarProductoDentro = await this.db.findOne({
      "products._id": productoId,
    });
    if (buscarProductoDentro) {
      await this.db.updateOne(
        { "products._id": productoId },
        { $pull: { products: { _id: productoId } } }
      );
      return {
        status: 200,
        payload: {
          result: "success",
          response: { status: "Eliminado correctamente" },
        },
      };
    }
    return {
      status: 200,
      payload: {
        result: "success",
        response: { status: "Eliminado correctamente" },
      },
    };
  };
  updateWithArray = async (carritoId, products) => {
    let carrito = await this.db.updateOne({ _id: carritoId }, { products });
    return {
      status: 200,
      payload: {
        result: `productos agregados correctamente`,
        payload: carrito,
      },
    };
  };
  updateQuantity = async (carritoId, productoId, cantidadNueva) => {
    let buscarProductoDentro = await this.db.findOne({
      "products._id": productoId,
    });
    if (buscarProductoDentro) {
      await this.db.updateOne(
        { "products._id": productoId },
        { "products.$.quantity": cantidadNueva }
      );
      return {
        status: 200,
        payload: {
          result: `cantidades cambiadas correctamente`,
        },
      };
    }
    await this.db.updateOne(
      { _id: carritoId },
      { $push: { products: { _id: productoId }, quantity: cantidadNueva } }
    );
    return {
      status: 200,
      payload: {
        result: `cantidades cambiadas correctamente`,
      },
    };
  };
  deleteAllProducts = async (carritoId) => {
    let carrito = await this.db.updateOne(
      { _id: carritoId },
      { $set: { products: [] } }
    );
    return {
      status: 200,
      payload: {
        result: `Productos eliminados correctamente`,
      },
    };
  };
  buyProducts = async (user) => {
    //* LLAMAMOS AL CARRITO
    let cart = await fetch(`http://localhost:8080/api/carts/${user.cart}`)
      .then((res) => res.json())
      .then((data) => data[0]);
    //* Verificamos si tiene productos
    if (cart.products.length == 0) {
      return {
        status: 405,
        response:
          "Esta acción no esta permitida debido a que su carrito se encuentra vacio",
      };
    }
    let failedProducts = [];
    let buyContinueProducts = [];
    //*EN CASO DE TENER corroboramos stock
    for (let products of cart.products) {
      if (products._id.stock < products.quantity) {
        failedProducts.push(products);
        continue;
      } else {
        buyContinueProducts.push(products);
      }
    }
    //*Verificamos el monto
    let amount = 0;
    for (let buyProducts of buyContinueProducts) {
      amount += buyProducts.quantity * buyProducts._id.price;
      let nuevoStock = JSON.stringify({
        stock: buyProducts._id.stock - buyProducts.quantity,
      });

      await fetch(`http://localhost:8080/api/products/${buyProducts._id._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: process.env.ADMIN_ADD_PRODUCT_TOKEN,
        },
        body: nuevoStock,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status !== 200) {
            return {
              status: res.status,
              response:
                "Ha ocurrido un error en el servidor: el stock no se pudo cambiar, porfavor intenta nuevamente",
            };
          }
        });
      await fetch(
        `http://localhost:8080/api/carts/${user.cart}/products/${buyProducts._id._id}`,
        {
          method: "DELETE",
        }
      ).then(res=>res.json()).then(res=>console.log(res));
    }
    let generarTicket = JSON.stringify({ amount: amount, email: user.email });
    await fetch("http://localhost:8080/api/ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: user.token,
      },
      body: generarTicket,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.response.purchaser);
        let fecha = res.response.purchase_datatime.split("T");

        transport.sendMail({
          from: "nalvcodertesting@gmail.com",
          to: res.response.purchaser,
          subject: "Compra en SportStore",
          html: `
                  <div>
                      <h1>Se ha completado tu compra en SportStore </h1>
                      <h3>El monto total de la misma fue de : $${res.response.amount} </h3>
                      <h3>La compra fue realizada el dia ${fecha[0]} a las ${fecha[1]}</h3>
                      <h3>El codigo de su compra es ${res.response.code}</h3>
                      <h4>Gracias por adquirir nuestros productos. Agradecemos su preferencia.</h4>
                  </div>
              `,
          attachments: [],
        });
      });
    return {
      status: 200,
      response: {
        status:200,
        message:"Tu compra se ha realizado correctamente"
      },
    };
  };
}
