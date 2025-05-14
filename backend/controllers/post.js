import jwt from "jsonwebtoken";
import db from "../db.js";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  console.log("token", token);
  if (!token) return res.status(401).json("Not Logged In");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token Invalid");
    console.log("userId", userId);
    const q =
      userId !== undefined
        ? `SELECT p.*,u.id AS "userId", u.name, u."profilePic" FROM posts AS p JOIN users AS u ON (u.id = p."userId") WHERE p."userId"=$1`
        : `SELECT p.*,u.id AS "userId", u.name, u."profilePic" FROM posts AS p JOIN users AS u ON (u.id = p."userId")
    LEFT JOIN follow AS r ON (p."userId" = r."followedUserId") WHERE r."followerUserId" = $1 OR p."userId" = $2
`;
    console.log("q", q);

    const values = userId !== undefined ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.rows);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("token", token);
  if (!token) return res.status(401).json("Not Logged In");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token Invalid");
    console.log("userIds", userInfo.id);

    const q = `INSERT INTO posts ("desc", "img", "userId", "createdAt") VALUES ($1, $2, $3, $4)`;
    const values = [
      req.body.desc,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("token", token);
  if (!token) return res.status(401).json("Not Logged In");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token Invalid");
    console.log("userIds", userInfo.id);

    const q = `DELETE FROM posts WHERE "id"=$1 AND "userId"=$2`;
    const values = [req.body.trashId, userInfo.id];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.rowCount > 0) return res.json("Deleted post");
      return res.status(403).json("You can delete only your post");
    });
  });
};
