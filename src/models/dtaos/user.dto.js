export default class UserDto {

  constructor(dataUser) {
  this.name = dataUser.name;
  this.email = dataUser.email;
  this.cartId = dataUser.cart;
  this.role = dataUser.role;
  }

}