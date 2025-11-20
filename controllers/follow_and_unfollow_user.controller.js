import userModel from "../models/user.model.js";

export async function follow_and_unfollow_user_controller(req, res) {
  try {
    const userId = req.body.userId; // only 1 value in body
    const currentUserId = req.user?._id; // comes from auth middleware

    // Validate
    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
        err: true,
        success: false
      });
    }

    if (!currentUserId) {
      return res.status(400).json({
        message: "currentUserId missing (check auth middleware)",
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

    const userToManage = await userModel.findById(userId);
    const currentUser = await userModel.findById(currentUserId);

    if (!userToManage || !currentUser) {
      return res.status(404).json({
        message: "User not found",
        err: true,
        success: false
      });
    }

    const isFollowing = userToManage.followers.includes(currentUserId);

    // If already following, then unfollow
    if (isFollowing) {
      userToManage.followers.pull(currentUserId);
      currentUser.following.pull(userId);

      await userToManage.save();
      await currentUser.save();

      return res.status(200).json({
        message: "User unfollowed successfully",
        err: false,
        success: true
      });
    }

    // else follow
    userToManage.followers.push(currentUserId);
    currentUser.following.push(userId);

    await userToManage.save();
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
