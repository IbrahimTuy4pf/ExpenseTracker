import { pool } from "../libs/database.js";
import { comparePassword, createJWT, hashPassword } from "../libs/index.js";

export const signupUser = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    if (!(firstName || email || password)) {
      return res.status(404).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const userExist = await pool.query({
      text: "SELECT EXISTS (SELECT * FROM tbluser WHERE email = $1)",
      values: [email],
    });

    if (userExist.rows[0].userExist) {
      return res.status(409).json({
        status: "failed",
        message: "Email Address already exists. Try Login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await pool.query({
      text: `INSERT INTO tbluser (firstname, email, password) VALUES ($1, $2, $3) RETURNING *`,
      values: [firstName, email, hashedPassword],
    });

    user.rows[0].password = undefined;

    // Create token and set cookie for new user
    const token = createJWT(user.rows[0].id);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Store user in session
    req.session.userId = user.rows[0].id;
    req.session.user = user.rows[0];

    res.status(201).json({
      status: "success",
      message: "User account created successfully",
      user: user.rows[0],
      token, // Return token for backward compatibility
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email || password)) {
      return res.status(404).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const result = await pool.query({
      text: `SELECT * FROM tbluser WHERE email = $1`,
      values: [email],
    });

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid email or password.",
      });
    }

    const isMatch = await comparePassword(password, user?.password);

    if (!isMatch) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    const token = createJWT(user.id);

    user.password = undefined;

    // Set token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Store user in session
    req.session.userId = user.id;
    req.session.user = user;

    res.status(200).json({
      status: "success",
      message: "Login successfully",
      user,
      token, // Still return token for backward compatibility
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ status: "failed", message: "Could not log out" });
      }
    });

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=authentication_failed`);
    }

    // Create JWT token
    const token = createJWT(user.id);

    // Set token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Store user in session
    req.session.userId = user.id;
    req.session.user = user;

    // Redirect to frontend with token in URL (for initial setup, frontend can store it)
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/callback?token=${token}`);
  } catch (error) {
    console.log(error);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=${error.message}`);
  }
};


