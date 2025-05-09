import jwt from "jsonwebtoken";
import db from "../db.js";
import bcrypt from "bcryptjs";
import moment from "moment";

export const getComments = (req, res) => {
  const q = `SELECT c.*,u.id AS "userId", u.name, u."profilePic" FROM comments AS c JOIN users AS u ON (u.id = c."userId")
      WHERE c."postId"=$1`;
  db.query(q, [+req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.rows);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("token", token);
  if (!token) return res.status(401).json("Not Logged In");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token Invalid");
    console.log("userIds", userInfo.id);

    const q = `INSERT INTO comments ("desc", "userId", "postId") VALUES ($1, $2, $3)`;
    const values = [req.body.desc, userInfo.id, req.body.postId];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created");
    });
  });
};
