export class DataUserDTO {
  constructor(data) {
    (this.user = data.user), (this.email = data.email), (this.rol = data.rol),(this.cart=data.cart);
  }
}
