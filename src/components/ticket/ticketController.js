import { TicketServices } from "./ticketServices.js";

export class TicketController {
  constructor() {
    this.ticketService = new TicketServices();
  }
  createTicket = (req) => {
    let { email, amount } = req;
    if (email && amount) {
      let data = {
        purchaser: email,
        amount,
        code: new Date().valueOf() + Math.random() * 10000,
        purchase_datatime: new Date().toLocaleString(),
      };
      return this.ticketService.createTicket(data);
    } else {
      return {
        status: 400,
        response: "Completa todos los campos",
      };
    }
  };
  searchTicket = (ticket) => {
    return this.ticketService.searchTicket(ticket);
  };
  searchTicketById = (id) => {
    return this.ticketService.searchTicketById(id);
  };
}
