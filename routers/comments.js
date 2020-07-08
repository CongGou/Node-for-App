const comments = require('../Schema/comments');
const article = require('../Schema/article');



module.exports = (req,res)=>{
  if ( !req.session.userinfo ){
    return res.send({errno:0,msg:"请先登录。"});
  }
  let userId = req.session.userinfo._id;
  let content = req.body.comments;
  let articleId = req.body.articleId;
  if ( userId  && comments && articleId) {
    comments.create({
      content
      ,article:articleId
      ,author:userId
    }).then(data=>{
      if (data){
        res.send({errno:1,msg:"评论成功",data});

      } else {
        res.send({errno:0,msg:"评论失败"});
      }
    }).catch(e=>{
      return res.send({errno:0,msg:"服务器异常，请稍后重试。"})
    });
  }else{
    return res.send({errno:0,msg:"评论信息有错误。"})
  }
};
