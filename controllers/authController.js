import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, supabase } from "../config/supabase.js";

const secretKey = process.env.JWT_SECRET || "default_jwt_secret_key_2026";

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "staff", avatar_url } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate
    const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: "User with this email already exists." });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: db.users.length + 1,
      name: name.trim(),
      email: normalizedEmail,
      password_hash,
      role: role.toLowerCase(),
      avatar_url: avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
      created_at: new Date().toISOString()
    };

    db.users.push(newUser);

    // If Supabase is connected, attempt sync
    if (supabase) {
      supabase.from("users").insert([{
        name: newUser.name,
        email: newUser.email,
        password_hash: newUser.password_hash,
        role: newUser.role,
        avatar_url: newUser.avatar_url
      }]).catch((err) => console.warn("Supabase user insert note:", err.message));
    }

    db.addAuditLog(newUser.id, newUser.name, "USER_REGISTERED", `New user registered with role: ${newUser.role}`);

    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      secretKey,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar_url: newUser.avatar_url
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error during registration", error: error.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      secretKey,
      { expiresIn: "24h" }
    );

    db.addAuditLog(user.id, user.name, "USER_LOGIN", `User logged in from web client`);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error during login", error: error.message });
  }
};

// GET /api/auth/me
export const getCurrentUser = (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url
    }
  });
};

// GET /api/auth/users (Admin / Manager only)
export const getAllUsers = (req, res) => {
  const safeUsers = db.users.map(({ id, name, email, role, avatar_url, created_at }) => ({
    id,
    name,
    email,
    role,
    avatar_url,
    created_at
  }));
  return res.status(200).json({ success: true, count: safeUsers.length, users: safeUsers });
};
