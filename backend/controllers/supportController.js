// controllers/supportController.js

// NOTE:
// This uses an in-memory store for simplicity.
// In production, create a SupportTicket model in MongoDB.

let tickets = [];


// ======================================================
// @desc Create Support Ticket
// ======================================================
export const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const ticket = {
      id: Date.now().toString(),
      user: req.user._id,
      subject,
      messages: [
        {
          sender: "USER",
          text: message,
          createdAt: new Date(),
        },
      ],
      status: "OPEN",
      createdAt: new Date(),
    };

    tickets.push(ticket);

    res.status(201).json({
      success: true,
      message: "Ticket created",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get My Tickets
// ======================================================
export const getMyTickets = async (req, res) => {
  try {
    const userTickets = tickets.filter(
      (t) => t.user.toString() === req.user._id.toString()
    );

    res.status(200).json({
      success: true,
      count: userTickets.length,
      tickets: userTickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Reply to Ticket
// ======================================================
export const replyTicket = async (req, res) => {
  try {
    const { message } = req.body;

    const ticket = tickets.find((t) => t.id === req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    ticket.messages.push({
      sender: "USER", // or ADMIN based on role
      text: message,
      createdAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Reply added",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Close Ticket
// ======================================================
export const closeTicket = async (req, res) => {
  try {
    const ticket = tickets.find((t) => t.id === req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    ticket.status = "CLOSED";

    res.status(200).json({
      success: true,
      message: "Ticket closed",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get All Tickets (Admin)
// ======================================================
export const getAllTickets = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};