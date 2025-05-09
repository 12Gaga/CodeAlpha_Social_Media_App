import jwt from "jsonwebtoken";
import db from "../db.js";
import bcrypt from "bcryptjs";
export const register = (req, res) => {
  console.log("body", req.body);
  const q = 'SELECT * FROM users WHERE "username " = $1';
  db.query(q, [req.body.userName], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.rows.length) return res.status(409).json("User already exist");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const insertQ =
      'INSERT INTO users ("username ", "email", "password", "name") VALUES ($1, $2, $3, $4)';
    const values = [
      req.body.userName,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];
    db.query(insertQ, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created");
    });
  });
};

export const login = (req, res) => {
  console.log(req.body);
  const q = 'SELECT * FROM users WHERE "username " = $1';
  db.query(q, [req.body.userName], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.rows.length === 0) return res.status(409).json("User not found");
    console.log(data.rows[0]);
    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data.rows[0].password.trim()
    );
    console.log(checkPassword);
    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");
    const token = jwt.sign({ id: data.rows[0].id }, "secretkey");
    const { password, ...others } = data.rows[0];
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out");
};
