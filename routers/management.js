const article = require("../Schema/article");

// 管理文章
module.exports = async (req, res) => {
  if (!req.session.userinfo) {
    return res.send({ errno: 0, msg: "登陆过期，请重新登录。" });
  }
  let _id = req.session.userinfo._id;
  if (req.session.userinfo) {
    const users = await article.find({ author: _id });
    try {
      res.send(users);
    } catch (e) {
      console.log(e);
    }
  } else {
    res.send({
      errno: 0,
      msg: "登陆过期，请重新登录"
    });
  }
};
