import jwt from "jsonwebtoken";
import db from "../db.js";
export const getRelationship = (req, res) => {
  const q = `SELECT "followerUserId" FROM follow WHERE "followedUserId"=$1`;
  db.query(q, [+req.query.userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.rows.map((d) => d.followerUserId));
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("token", token);
  if (!token) return res.status(401).json("Not Logged In");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token Invalid");
    console.log("userIds", userInfo.id);

    const q = `INSERT INTO follow ("followerUserId", "followedUserId") VALUES ($1, $2)`;
    const values = [userInfo.id, req.body.followedUserId];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Relationship has been created");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("token", token);
  if (!token) return res.status(401).json("Not Logged In");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token Invalid");
    console.log("userIds", userInfo.id);

    const q = `DELETE FROM follow WHERE "followerUserId"=$1 AND "followedUserId"=$2`;
    const values = [userInfo.id, req.body.followedUserId];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Relationship has been deleted");
    });
  });
};
