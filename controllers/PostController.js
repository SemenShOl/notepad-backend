import PostModel from "../models/post.js";

export const create = async (req, res) => {
  try {
    console.log(req.body);
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post._doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось создать статью" });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find({ user: req.userId })
      .populate("user")
      .exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};

export const getOne = async (req, res) => {
  try {
    const postID = req.params.id;
    const post = await PostModel.findOneAndUpdate(
      {
        _id: postID,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось получить статью" });
  }
};

export const remove = async (req, res) => {
  try {
    console.log(req.params.id);

    const postId = req.params.id;
    const deletedPost = await PostModel.findOneAndDelete({
      _id: postId,
    });
    console.log(deletedPost);
    if (!deletedPost) {
      res.status(404).json({ message: "Такой статьи нет" });
    }
    const newPosts = await PostModel.find({ user: req.userId });
    res.json(newPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось удалить статью" });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
      }
    );
    res.json({ _id: postId });
  } catch (error) {
    console.log(first);
    res.status(500).json({ message: "Не удалось обновить статью" });
  }
};
