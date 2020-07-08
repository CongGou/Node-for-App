const article = require("../Schema/article");


//删除文章
module.exports = (req,res)=>{
  let id = req.session.userinfo._id;
  if ( !id ){
    return res.send({errno:0,msg:"数据格式错误"});
  }
  article.deleteOne({author:id})
    .then(data=>{
      res.send({errno:1,msg:"删除成功！"});
    })
    .catch(e=>{
      res.send({errno:0,msg:"服务器异常~请稍后再试~"})
    });
}
