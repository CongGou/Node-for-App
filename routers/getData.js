const User = require("../Schema/user");

module.exports = async (req, res) => {
  if (!req.session.userinfo)
    return res.send({ errno: 0, msg: "登陆过期，请重新登录。" });

  let _id = req.session.userinfo._id;
  const data = await User.findById({ _id });
  try {
    if (data) {
      res.send({ errno: 1, msg: "更新成功！", data });
    } else {
      res.send({ errno: 0, msg: "更新失败！" });
    }
  } catch (e) {
    res.send({ errno: 0, msg: "服务异常" });
  }
};
