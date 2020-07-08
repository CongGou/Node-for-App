const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//引入express-session
const session = require("express-session");
// const mongooseSession = require("connect-mongo")(session)

//引入 user表
const Users = require("./Schema/user");
//引入 加密模块
const crypto = require("crypto");
const app = express();
const fs = require("fs");

//设置session参数
app.use(
  session({
    secret: "guo", //密钥，值随便填写
    rolling: true, //只要用户和后端有交互（访问页面，跳转页面，ajax……），刷新存储时间
    resave: false, //是否每次请求都重新存储session数据
    saveUninitialized: false, //初始值
    cookie: { maxAge: 1000 * 60 * 60 * 60 }, //设置session过期时间
    // ,store : new mongooseSession({
    //   url : "mongodb://localhost:27019/vuex"
    // })//不设置store是服务器内存中存储session信息，我们可以通过设置store将session数据存到数据库
  })
);
app.use(express.static("./public"));
app.use(bodyParser.json({ limit: "2100000kb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.disable("etag");
app.get("/", (req, res) => {
  res.send({ errno: 1, msg: "6999端口已开启" });
});
//注册
app.use("/register", (req, res) => {
  let { name, pass, checkPass } = req.body;
  Users.findOne({ name: req.body.name }).then((user) => {
    if (user) {
      //如果找到该用户  则用户已经注册过了  不可注册  返回0
      res.send({
        errno: 0,
        msg: "用户名已经存在",
      });
    } else {
      //如果没找到该用户  则用户没有注册过  可以注册  返回0
      //如果不存在用户名，先检测两次密码是否一致
      if (req.body.pass !== req.body.checkPass) {
        //两次密码不一致，返回前端信息
        res.send({ errno: 0, msg: "两次密码不一致" });
      } else {
        //两次密码一致 添加到数据库
        Users.create({
          name,
          pass,
          checkPass,
          giveALike: 0,
          reading: 0,
        })
          .then((user) => {
            //注册成功，添加session
            req.session.userinfo = user;
            console.log(req.session);
            res.send({ errno: 1, msg: "注册成功", user });
          })
          .catch(() => {
            res.send({ errno: 0, msg: "服务器异常，请重试~" });
          });
      }
    }
  });
});
//登录
app.use("/login", (req, res) => {
  let { name } = req.body;
  // if (!name) return res.status(400).send("请输入用户名");
  Users.findOne({
    name,
  }).then((user) => {
    if (user) {
      //如果用户存在  则登录成功 返回1
      let pwd = crypto.createHash("sha256").update(req.body.pass).digest("hex");
      if (pwd === user.pass) {
        req.session.userinfo = user;
        res.send({
          errno: 1,
          user,
        });
      } else {
        res.send({ errno: 0, msg: "密码不正确" });
      }
    } else {
      res.send({
        //用户不存在 登录失败 返回0
        errno: 0,
        msg: "用户不存在",
      });
    }
  });
});
//个人信息
app.use("/userinfo", (req, res) => {
  // console.log(req.session.userinfo);
  res.send(req.session.userinfo);
});
//登出 路由
app.use("/logout", (req, res) => {
  //清除session
  req.session.destroy();
  res.send({
    errno: 1,
    msg: "退出成功",
  });
});
//验证是否登录
app.get("/verification", function (req, res) {
  let data = req.session.userinfo;
  if (req.session.userinfo) {
    res.send({
      msg: data,
    });
  } else {
    res.send({ msg: false, code: 1 });
  }
});

//发表文章
app.use("/article", require("./routers/article"));
//修改密码
app.use("/resetpwd", require("./routers/resetpwd"));
//上传图片
app.use("/uploadImg", require("./routers/upload"));
//修改个人资料
app.use("/personalData", require("./routers/personalData"));
//获取个人资料
app.use("/getData", require("./routers/getData"));
//搜索文章
app.use("/search", require("./routers/search"));
//所有文章
app.use("/allarticles", require("./routers/allarticles"));

//所有文章访问
app.use("/allarticleaccess", require("./routers/AllArticleAccess"));
//文章访问量
app.use("/reading", require("./routers/reading"));
//文章点赞量
app.use("/getLike", require("./routers/getLike"));
//管理文章
app.use("/management", require("./routers/management"));
//访问文章
app.use("/access", require("./routers/access"));
//删除文章
app.use("/delete", require("./routers/delete"));
//关注用户
app.use("/focus", require("./routers/focus"));
//评论
app.use("/comments", require("./routers/comments"));
//所有用户
app.use("/alluser", require("./routers/alluser"));

//连接数据库
mongoose.connect(
  "mongodb://localhost:27017/react-blog-app",
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log("数据库链接失败");
      return;
    }
    app.listen(6999, () => {
      console.log("6999端口成功监听");
    });
    console.log("数据库链接成功");
  }
);
