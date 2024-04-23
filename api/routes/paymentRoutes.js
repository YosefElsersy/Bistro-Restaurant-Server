const express = require("express");
const Payment = require("../models/Payment");
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;

// Token verification middleware
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// POST payment information to database
router.post("/", verifyToken, async (req, res) => {
  const payment = req.body;
  try {
    const paymentRequest = await Payment.create(payment);

    // Delete cart after payment
    const cardIds = payment.cartItems.map((id) => new ObjectId(id));
    const deletedCartRequest = await Cart.deleteMany({ _id: { $in: cardIds } });

    res.status(200).json({ paymentRequest, deletedCartRequest });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET orders by email
router.get("/user-orders", verifyToken, async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  try {
    const decodedEmail = req.decoded.email;
    if (email !== decodedEmail) {
      res.status(403).json({ message: "Forbidden Access" });
    }
    const result = await Payment.find(query).sort({ createdAt: -1 }).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET all orders
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Payment.find().sort({ createdAt: -1 }).exec();
    res.status(200).json(orders);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET all orders count
router.get("/orders-count", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const ordersCount = await Payment.countDocuments();
    res.status(200).json({ ordersCount });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET sum of all prices of orders
router.get("/orders-sum", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Payment.find();
    let ordersSum = 0;
    orders.forEach(order => {
      ordersSum += order.price;
    });
    res.status(200).json({ ordersSum });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update order status
router.put("/:orderId", verifyToken, verifyAdmin, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Payment.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete order
router.delete("/:orderId", verifyToken, verifyAdmin, async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await Payment.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
