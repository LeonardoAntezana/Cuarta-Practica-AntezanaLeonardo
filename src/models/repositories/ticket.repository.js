import daos from '../dao.factory.js';

class TicketRepository {
  constructor() {
    this.dao = daos.ticketDao;
  }

  create = async (newTicket) => await this.dao.create(newTicket);

}

export default new TicketRepository();