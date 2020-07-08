const express = require('express');
const focus = require("../Schema/focus");
const User = require('../Schema/user')

let router = express.Router();

//增或创建
router.post('/',(req,res)=>{
  if(!req.session.userinfo){
    return res.send({errno:0,msg:"登陆过期，请重新登录。"})
  }

  let focusID = req.body._id;
  let userInfoID = req.session.userinfo._id;
  if (focusID===userInfoID) {
    res.send({errno:0,msg:'不能关注自己的账号'})
  }else {
    focus.findOne({focusID,userInfoID}).then(data=>{
      if (data){
            res.send({errno:1,msg:'已关注'})
      }else {
            focus.create({
              focusID,
              author:userInfoID,
              focusObj: focusID
            }).then(data=>{
              res.send({errno:1,msg:'关注成功'})
            });
      }
    })

  }
});
//查文章的关注
router.post('/findFocus',(req,res)=>{
  if(!req.session.userinfo){
    return res.send({errno:0,msg:"登陆过期，请重新登录。"})
  }
  let focusID = req.body._id;
  focus.findOne({
    focusID
  }).then(data=>{
    if (data){
      res.send({errno:1,msg:'已关注'})
    } else {
      res.send({errno:0,msg:'关注'})
    }

  });
});
//所有关注de数量
router.post('/AllFocus',(req,res)=>{
  if(!req.session.userinfo){
    return res.send({errno:0,msg:"登陆过期，请重新登录。"})
  }
  let _id = req.session.userinfo._id;
  focus.find({
    author:_id
  }).populate("author").then(data=>{
    if (data){
      res.send({errno:1,msg:'已关注',data})
    } else {
      res.send({errno:0,msg:'关注'})
    }

  });
});
//所关注de用户
router.post('/FocusUser',(req,res)=>{
  if(!req.session.userinfo){
    return res.send({errno:0,msg:"登陆过期，请重新登录。"})
  }
  let _id = req.session.userinfo._id;
  focus.find({
    author:_id
  }).populate("author").populate('focusObj').then(data=>{
    res.send(data)

  });
});
//查全部关注
router.post('/findAllFocus',(req,res)=>{
  if(!req.session.userinfo){
    return res.send({errno:0,msg:"登陆过期，请重新登录。"})
  }
  let focusID = req.body._id;
  let _id = req.session.userinfo._id;

  focus.findOne({
    focusID,
    author:_id
  }).populate("author")
    .then(data=>{
    if (data){
      res.send({errno:1,msg:'已关注',data})
    } else {
      res.send({errno:0,msg:'关注'})
    }

  });
});

//被关注
router.post('/BeFocusOn',(req,res)=>{
  if(!req.session.userinfo){
    return res.send({errno:0,msg:"登陆过期，请重新登录。"})
  }
  let focusID = req.session.userinfo._id;
  focus.find({
    focusID
  }).populate("author").then(data=>{
    if (data){
      res.send({errno:1,msg:'被关注',data})
    } else {
      res.send({errno:0,msg:'没有关注'})
    }

  });
});
//取消关注
router.post('/cancelFocus',(req,res)=>{
  if(!req.session.userinfo){
    return res.send({errno:0,msg:"登陆过期，请重新登录。"})
  }

  let focusID = req.body._id;
  focus.deleteOne({
      focusID
  }).then(data=>{
      if (data){
        res.send({errno:1,msg:'已取消关注'})
      } else {
        res.send({errno:0,msg:'取消失败'})
      }

  });
});

module.exports = router;
