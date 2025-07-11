
const express = require('express');
const { Order } = require('../Models/Order');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../Models/userModel');


async function getAdminApi(req, res) {
  try {
    const orders = await Order.find();

    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await UserModel.findById(order.userId);
        return {
          ...order._doc,
          user: user ? user.toObject() : null,
        };
      })
    );

    res.status(200).json(updatedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


async function deleteAdminApi(req, res) {
  try {
    const { id } = req.params;

    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
}


async function setAdminApi(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found!" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
}


module.exports = { getAdminApi, setAdminApi, deleteAdminApi }
