export const userFormat = (user) => {
  let { _id, first_name, last_name, email, role } = user;
  return { _id, first_name, last_name, email, role };
}
export const checkLastConnection = (userConnection, actualDate, diference) => {
  let diferenceInMiliseconds = Math.abs(userConnection.getTime() - actualDate.getTime());
  let diferenceInDays = Math.floor(diferenceInMiliseconds / 1000 / 60 / 60 / 24);
  return diferenceInDays >= diference;
}

export const ticketInfo = (ticket) => {
  return `Codigo de ticket: ${ticket.code}\n
          Fecha de compra: ${ticket.purchase_datetime}\n
          Total: ${ticket.amount}\n
          Usuario: ${ticket.purchase_user}`
}