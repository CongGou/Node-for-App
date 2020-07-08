module.exports = (req, res) => {
  if (!req.session.userinfo) {
    return res.send({
      errno: 0,
      msg: "登陆过期，请重新登录。",
    });
  }
  let _id = req.session.userinfo._id;
  let data = req.body.photo;
  console.log(data);
  let path = "public/upload/photo/" + Date.now() + ".png";
  const base64 = data.replace(/^data:image\/\w+;base64,/, "");

  //去掉图片base64码前面部分data:image/png;base64
  // new Buffer 操作权限太大，v6.0后使用Buffer.from()创建构造函数
  const dataBuffer = new Buffer.from()(base64, "base64"); //把base64码转成buffer对象，

  //获取图片存储路径
  let photoPath = path.slice(7);
  let photoUrl = `http://localhost:6999/${photoPath}`;
  console.log(path);
  return { _id, path, dataBuffer, photoUrl };
};
