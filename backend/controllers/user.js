import jwt from "jsonwebtoken";
import db from "../db.js";
import bcrypt from "bcryptjs";
import moment from "moment";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=$1";
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...others } = data.rows[0];
    return res.status(200).json(others);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("token", token);
  if (!token) return res.status(401).json("Not Logged In");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token Invalid");
    console.log("userIds", userInfo.id);

    const q = `UPDATE users SET "name"=$1 ,"coverPic"=$2, "profilePic"=$3 WHERE id=$4`;
    const values = [
      req.body.name,
      req.body.coverPic,
      req.body.profilePic,
      userInfo.id,
    ];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.rowCount > 0) {
        return res.json("Updated");
      }
      return res.status(403).json("You can update only your profile");
    });
  });
};
