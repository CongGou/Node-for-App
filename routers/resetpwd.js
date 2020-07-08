const user = require("../Schema/user");
const crypto = require("crypto");

module.exports = async (req, res) => {
  if (!(req.body.oldPass && req.body.newPass && req.body.checkPass)) {
    return res.send({ errno: 0, msg: "数据格式不正确!!请确保填写无误" });
  }

  //判断旧密码对不对
  const data = await user.findById(req.session.userinfo._id);
  try {
    if (data) {
      let oldPwd = crypto
        .createHash("sha256")
        .update(req.body.oldPass)
        .digest("hex");

      // 原密码和数据库密码比对
      if (oldPwd === data.pass) {
        data.pass = req.body.newPass;
        data.checkPass = req.body.checkPass;
        data.save().then(() => {
          res.send({ errno: 1, msg: "密码修改成功" });
        });
      } else {
        res.send({ errno: 0, msg: "原始密码不正确" });
      }
    } else {
      //不存在，理论不会出现这种情况
      res.send({ errno: 0, msg: "用户信息加载出错…" });
    }
  } catch (e) {
    res.send({ errno: 0, msg: "服务器异常~请稍后重试~" });
  }
};
