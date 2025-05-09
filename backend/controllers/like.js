import jwt from "jsonwebtoken";
import db from "../db.js";
export const getLikes = (req, res) => {
  const q = `SELECT "userId" FROM likes WHERE "postId"=$1`;
  db.query(q, [+req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.rows.map((d) => d.userId));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("token", token);
  if (!token) return res.status(401).json("Not Logged In");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token Invalid");
    console.log("userIds", userInfo.id);

    const q = `INSERT INTO likes ("userId", "postId") VALUES ($1, $2)`;
    const values = [userInfo.id, req.body.postId];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Like has been given");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("token", token);
  if (!token) return res.status(401).json("Not Logged In");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token Invalid");
    console.log("userIds", userInfo.id);

    const q = `DELETE FROM likes WHERE "userId"=$1 AND "postId"=$2`;
    const values = [userInfo.id, req.body.postId];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Like has been deleted");
    });
  });
};
