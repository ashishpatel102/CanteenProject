const { Cart } = require("../Models/Cart ");
const { Order } = require("../Models/Order");
const { Payment } = require("../Models/Pyment");
const { UserModel } = require("../Models/userModel");



async function fetchAllUsers(req, res) {
  try {
    const users = await UserModel.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error! Unable to fetch users." });
  }
}


const toggleRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `User role changed to ${role}` });
  } catch (error) {
    res.status(500).json({ message: "Error updating user role" });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await Payment.deleteMany({ userId: id });
    } catch (paymentError) {
      console.error("Error deleting payments:", paymentError);
      return res.status(500).json({ message: "Failed to delete user payments", error: paymentError.message });
    }

    try {
      await Order.deleteMany({ userId: id });
    } catch (orderError) {
      console.error("Error deleting orders:", orderError);
      return res.status(500).json({ message: "Failed to delete user orders", error: orderError.message });
    }

    try {
      await Cart.deleteMany({ userId: id });
    } catch (orderError) {
      console.error("Error deleting orders:", orderError);
      return res.status(500).json({ message: "Failed to delete user orders", error: orderError.message });
    }

    try {
      await UserModel.findByIdAndDelete(id);
    } catch (userDeleteError) {
      console.error("Error deleting user:", userDeleteError);
      return res.status(500).json({ message: "Failed to delete user", error: userDeleteError.message });
    }

    res.status(200).json({ message: "User, payments, and orders deleted successfully!" });

  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "An unexpected error occurred", error: error.message });
  }
};

module.exports = { fetchAllUsers, toggleRole, deleteUser };
