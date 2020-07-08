const fs = require("fs");
const User = require("../Schema/user");

module.exports = (req, res) => {
  if (!req.session.userinfo) {
    return res.send({
      errno: 0,
      msg: "登陆过期，请重新登录。",
    });
  }
  let _id = req.session.userinfo._id;
  let data = req.body.photo;
  const path = "public/upload/photo/" + Date.now() + ".png";
  const base64 = data.replace(/^data:image\/\w+;base64,/, "");

  //去掉图片base64码前面部分data:image/png;base64
  // new Buffer 操作权限太大，v6.0后使用Buffer.from()创建构造函数
  const dataBuffer = new Buffer.from(base64, "base64"); //把base64码转成buffer对象，

  //获取图片存储路径
  let photoPath = path.slice(7);
  let photoUrl = `http://localhost:6999/${photoPath}`;

  fs.writeFile(path, dataBuffer, function (err) {
    //用fs写入文件
    if (err) {
      console.log(err);
    } else {
      //上传用户头像
      User.updateOne({ _id }, { photo: photoUrl })
        .then(() => {
          User.findById({ _id }).then((data) => {
            if (data) {
              res.send({
                errno: 1,
                msg: "上传成功！",
                data,
              });
            } else {
              res.send({
                errno: 0,
                msg: "上传失败！",
              });
            }
          });
        })
        .catch((e) => {
          let msg = e.ValidationError
            ? "更新失败，数据格式不正确！"
            : "更新失败…服务器异常，请重试…";
          res.send({ errno: 0, msg });
        });
    }
  });
};
