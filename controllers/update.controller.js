import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export async function updateUserController(req, res) {
  try {
    const userId = req.body._id; // or req.params.id depending on your route
    const { firstName, lastName, email, password } = req.body;

    // Validate ID
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        err: true,
        success: false,
      });
    }

    // Find existing user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        err: true,
        success: false,
      });
    }

    // Update only provided fields
    if (firstName) user.name = name;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    // If password provided → hash before saving
    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save updated user
    await user.save();

    // Send success response
    return res.status(200).json({
      message: "User updated successfully",
      err: false,
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      err: true,
      success: false,
    });
  }
}
