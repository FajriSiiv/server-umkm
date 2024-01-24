const bcrypt = require("bcrypt");
const User = require("../model/user");

exports.Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      req.session.destroy();
      return res.status(401).json({ error: "User tidak ditemukan" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.username = user.username;
      req.session.email = user.email;
      return res.json({ message: "Login berhasil", user });
    } else {
      req.session.destroy();
      return res.status(401).json({ error: "Password salah" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.Logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Logout gagal" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout berhasil" });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "username/email sudah ada!." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: "Berhasil membuat user", user: savedUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
