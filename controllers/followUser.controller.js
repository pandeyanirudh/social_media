import userModel from "../models/user.model.js";

export async function followUser(req, res) {
  try {
    const userId = req.body.userId || req.body._id;
    const currentUserId = req.user?._id || req.body.currentUserId;

    if (!userId || !currentUserId) {
      return res.status(400).json({
        message: "Both userId and currentUserId are required",
        err: true,
        success: false
      });
    }

    if (userId === currentUserId.toString()) {
      return res.status(400).json({
        message: "You cannot follow yourself",
        err: true,
        success: false
      });
    }

    const userToFollow = await userModel.findById(userId);
    const currentUser = await userModel.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({
        message: "User not found",
        err: true,
        success: false
      });
    }

    userToFollow.followers.push(currentUserId);
    currentUser.following.push(userId);

    await userToFollow.save();
    await currentUser.save();

    return res.status(200).json({
      message: "User followed successfully",
      err: false,
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      err: true,
      success: false
    });
  }
}
