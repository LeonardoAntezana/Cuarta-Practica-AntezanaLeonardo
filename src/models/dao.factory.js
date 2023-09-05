import persistanceModel from "../config/config.command.js";

let daos = {};

switch (persistanceModel) {
  case 'mongo':
  default:
    const { default: CartDao } = await import('../models/daos/dbDao/dao.cart.js');
    const { default: UserDao } = await import('../models/daos/dbDao/dao.user.js');
    const { default: ProductDao } = await import('../models/daos/dbDao/dao.product.js');
    const { default: MessageDao } = await import('../models/daos/dbDao/dao.message.js');
    const { default: TicketDao } = await import('../models/daos/dbDao/dao.ticket.js');
    daos = {
      cartDao: new CartDao(),
      userDao: new UserDao(),
      productDao: new ProductDao(),
      messageDao: new MessageDao(),
      ticketDao: new TicketDao()
    };
    break;
  case 'memory':
    break;
}

export default daos;