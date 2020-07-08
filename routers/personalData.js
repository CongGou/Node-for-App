const User = require("../Schema/user");

module.exports = (req, res) => {
  if (!req.session.userinfo) {
    return res.send({ errno: 0, msg: "登陆过期，请重新登录。" });
  }

  let _id = req.session.userinfo._id;
  let position = req.body.position;
  let introduce = req.body.introduce;
  let signature = req.body.signature;

  //改
  User.updateOne(
    {
      _id,
    },
    {
      position,
      introduce,
      signature,
    }
  )
    .then(() => {
      User.findById({ _id }).then((data) => {
        if (data) {
          res.send({ errno: 1, msg: "更新成功！", data });
        } else {
          res.send({ errno: 0, msg: "更新失败！" });
        }
      });
    })
    .catch((e) => {
      let msg = e.ValidationError
        ? "更新失败，数据格式不正确！"
        : "更新失败…服务器异常，请重试…";
      res.send({ errno: 0, msg });
    });
};
