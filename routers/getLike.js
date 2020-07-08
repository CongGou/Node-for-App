const express = require("express");

const article = require("../Schema/article");
const User = require("../Schema/user");
const getLike = require("../Schema/getlike");
let router = express.Router();
//点赞成功
router.post("/", (req, res) => {
  if (!req.session.userinfo) {
    return res.send({ errno: 0, msg: "登陆过期，请重新登录。" });
  }
  let _id = req.body._id;
  let userInfoID = req.session.userinfo._id;
  getLike.findOne({ _id, userInfoID }).then(data => {
    if (data) {
      res.send({ errno: 1, msg: "已点赞" });
    } else {
      getLike
        .create({
          getLikeID: _id,
          author: userInfoID
        })
        .then(data => {
          if (data) {
            res.send({ errno: 1, msg: "点赞成功 +1" });
            article.find({ _id: _id }).then(data => {
              if (data) {
                data.forEach(item => {
                  let authorID = item.author;
                  let num = item.getLike + 1;
                  article.updateOne({ _id }, { getLike: num }).then(data => {
                    if (data) {
                      User.find({ _id: authorID }).then(data => {
                        data.forEach(item => {
                          let userID = item._id;
                          let userNum = item.giveALike + 1;
                          User.updateOne(
                            { _id: userID },
                            { giveALike: userNum }
                          ).then(data => {
                            console.log(data);
                          });
                        });
                      });
                    }
                  });
                });
              }
            });
          }
        });
    }
  });
});
//验证用户点赞状态
router.post("/geteLikeState", (req, res) => {
  let _id = req.body._id;
  let author = req.session.userinfo._id;
  getLike
    .findOne({
      getLikeID: _id,
      author
    })
    .then(data => {
      if (data) {
        res.send({ errno: 1, msg: true, data });
      } else {
        res.send({ errno: 0, msg: false, data });
      }
    });
});
//取消点赞
router.post("/cancelGetLike", (req, res) => {
  if (!req.session.userinfo) {
    return res.send({ errno: 0, msg: "登陆过期，请重新登录。" });
  }

  let _id = req.body._id;
  getLike
    .deleteOne({
      getLikeID: _id
    })
    .then(data => {
      if (data) {
        res.send({ errno: 1, msg: "已取消点赞" });
        article.find({ _id: _id }).then(data => {
          if (data) {
            data.forEach(item => {
              let authorID = item.author;
              let num = item.getLike - 1;
              article.updateOne({ _id }, { getLike: num }).then(data => {
                if (data) {
                  User.find({ _id: authorID }).then(data => {
                    data.forEach(item => {
                      let userID = item._id;
                      let userNum = item.giveALike - 1;
                      User.updateOne(
                        { _id: userID },
                        { giveALike: userNum }
                      ).then(data => {
                        console.log(data);
                      });
                    });
                  });
                }
              });
            });
          }
        });
      } else {
        res.send({ errno: 0, msg: "取消点赞失败" });
      }
    });
});

module.exports = router;
