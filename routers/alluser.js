const user = require("../Schema/user");

module.exports = (req,res)=>{
  user.find().then(data => {
    res.send(data)
  })
};
