import User from "../models/user.js";

const deleteUser = async (req, res) => {
  try {
    // Get the email from the request body or cookie
    const userEmail = req.body.email || req.cookies.email;

    if (!userEmail) {
      return res.status(400).json({ message: "Email is missing" });
    }

    // Find and delete the user based on the email
    const deletedUser = await User.deleteOne({ email: userEmail });

    if (deletedUser.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "An error occurred while deleting user" });
  }
};

export default deleteUser;
