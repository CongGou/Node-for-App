const express = require("express");
const article = require("../Schema/article");
const fs = require("fs");

let router = express.Router();

//发表文章
router.post("/", async (req, res) => {
  if (!req.session.userinfo)
    return res.send({ errno: 0, msg: "登录过期，请重新登录。" });
  let { title, content, label, reading, getLike, coverImg } = req.body;
  if (!(title && content)) return res.send({ errno: 0, msg: "格式错误11" });

  const path = "public/upload/coverImg/" + Date.now() + ".png";
  const base64 = coverImg.replace(/^data:image\/\w+;base64,/, "");

  const dataBuffer = new Buffer.from(base64, "base64");

  let photoPath = path.slice(7);
  let photoUrl = `http://localhost:6999/${photoPath}`;

  fs.writeFile(path, dataBuffer, async function (err) {
    //用fs写入文件
    if (err) {
      console.log(err);
    } else {
      const data = await article.create({
        title,
        label,
        reading: 0,
        getLike: 0,
        content,
        author: req.session.userinfo._id,
        coverImg: photoUrl,
      });

      try {
        if (data) {
          res.send({ errno: 1, msg: "文章发表成功" });
        } else {
          res.send({ errno: 0, msg: "服务器异常~请稍后重试~" });
        }
      } catch (e) {
        res.send({ errno: 0, msg: "服务器异常~请稍后重试~" });
      }
    }
  });
});

module.exports = router;
