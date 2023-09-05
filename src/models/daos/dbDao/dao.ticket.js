import { ticketModel } from "../../schemas/ticket.model.js";

export default class TicketDao {

  create = async (newTicket) => {
    try {
      let resAdd = await ticketModel.create(newTicket)
      return resAdd;
    } catch(error) {
      console.log(error);
    }
  }

}