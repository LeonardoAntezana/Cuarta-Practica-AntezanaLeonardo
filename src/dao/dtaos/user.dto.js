export default class UserDto {

  constructor(dataUser) {
  this.first_name = dataUser.first_name;
  this.last_name = dataUser.last_name;
  this.email = dataUser.email;
  this.cartId = dataUser.cart;
  this.role = dataUser.role;
  }

}