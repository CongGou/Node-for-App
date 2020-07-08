const express = require("express");
const Article = require("../Schema/article");
const comments = require("../Schema/comments");

let router = express.Router();
//所有文章访问
router.post("/", async (req, res) => {
  let _id = req.body.articleId;
  if (_id) {
    const data = await Article.findById(_id).populate("author");
    try {
      if (data) return res.send({ errno: 1, data });
    } catch (e) {
      console.log(e);
    }
  }
});
router.post("/comments", async (req, res) => {
  let _id = req.body.articleId;
  if (_id) {
    const data = await comments.find({ article: _id }).populate("author");
    try {
      if (data) {
        res.send({ errno: 1, data });
      } else {
        res.send({ errno: 0, data });
      }
    } catch (e) {
      console.log(e);
    }
  }
});
module.exports = router;
