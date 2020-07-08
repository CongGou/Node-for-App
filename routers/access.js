const express = require("express");
const article = require("../Schema/article");
const comments = require("../Schema/comments");
let router = express.Router();
// 访问文章
router.post("/", (req, res) => {
  // if (!req.session.userinfo) {
  //   return res.send({ errno: 0, msg: "请先登录。" });
  // }
  let _id = req.body.articleId;
  if (_id) {
    article
      .findById(_id)
      .populate("author")
      .then((data) => {
        if (data) {
          res.send({ errno: 1, data });
        }
      });
  }
});

router.post("/comments", (req, res) => {
  let _id = req.body.articleId;
  if (_id) {
    comments
      .find({ article: _id })
      .populate("author")
      .then((data) => {
        if (data) {
          res.send({ errno: 1, data });
        } else {
          res.send({ errno: 0, data });
        }
      });
  }
});
module.exports = router;
