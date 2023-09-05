import { Schema, model } from "mongoose";

const ticketsCollection = 'Tickets';

const ticketSchema = Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchase_user: {
    type: String,
    required: true,
  }
})

export const ticketModel = model(ticketsCollection, ticketSchema);