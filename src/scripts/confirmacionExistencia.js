import { ProductsController } from "../components/products/productsController.js";
import { CartController } from "../components/carts/cartController.js";


export let confirmarProducto = async (id) => {
  let productsController = new ProductsController();
  let producto = productsController.isValidProduct(id);
  return producto;
};
export let confirmarCarrito = async (id) => {
  let cartController=new CartController()
  let carrito = await cartController.isValidCart(id);
  return carrito;
};
