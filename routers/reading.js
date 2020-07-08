const article = require("../Schema/article");
const User = require("../Schema/user");


module.exports = (req,res)=>{
  let _id = req.body.articleId;

  article.find({_id}).then(data=>{
    if (data){
      data.forEach(item=>{
        let authorID = item.author;
        let num = item.reading + 1;
        article.updateOne({_id},{reading:num}).then(data=>{
          if (data){
            User.find({_id:authorID}).then(data=>{
              data.forEach(item=>{
                let userID = item._id;
                let userNum = item.reading + 1;
                User.updateOne({_id:userID},{reading:userNum}).then(data=>{
                  // console.log(data);
                })
              });
            })
          }
        });

      })
    }
  })
  // let i = 0;
  // console.log(i+1);
};
