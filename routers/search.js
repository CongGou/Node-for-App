const article = require("../Schema/article");

module.exports = async (req, res) => {
  //关键词组成条件
  let keyword = req.body.keyword;
  let conditions = {};
  if (keyword) {
    let reg = new RegExp(keyword);
    conditions = {
      $or: [{ title: reg }, { label: reg }, { content: reg }]
    };
  }

  //开始查找
  const data = await article.find(conditions).populate("author");
  try {
    if (data.length) {
      res.send({ errno: 1, data });
    } else {
      res.send({ errno: 0, msg: "没有找到相关数据", data: [] });
    }
  } catch (err) {
    res.send({ errno: 0, msg: "服务器异常~请稍后再试~" });
  }
};
