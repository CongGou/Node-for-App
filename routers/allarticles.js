const Article = require("../Schema/article");
const comments = require("../Schema/comments");
const _ = require("lodash");
const { forEach } = require("lodash");
//所有文章数据
module.exports = async (req, res) => {
  const data = await Article.find().populate("author");
  try {
    if (data) {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        let data2 = _.pick(data[i], [
          "_id",
          "date",
          "title",
          "reading",
          "label",
          "getLike",
          "author",
          "coverImg",
        ]);
        arr.push(data2);
      }
      // console.log(arr);
      res.send({ data: arr });
    }
  } catch (e) {
    res.send({ errno: 0, msg: "服务异常" });
  }
};
