import TodoModel from "../models/todo.js";

export const create = async (req, res) => {
  try {
    console.log("req body: ", req.body);
    const doc = new TodoModel({
      title: req.body.title,
      text: req.body.text,
      date: req.body.date,
      completed: req.body.completed,
      user: req.userId,
    });

    const todo = await doc.save();
    res.json(todo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось создать задачу" });
  }
};

// export const getAll = async (req, res) => {
//   try {
//     const todos = await TodoModel.find({
//       user: req.userId,
//     })
//       .populate("user")
//       .exec();
//     res.json(todos);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Не удалось получить статьи" });
//   }
// };

export const getByDay = async (req, res) => {
  try {
    const todoDate = req.params.date;
    const todos = await TodoModel.find({
      user: req.userId,
      date: todoDate,
    });
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось получить задачи" });
  }
};

export const remove = async (req, res) => {
  try {
    const todoId = req.params.id;
    console.log(todoId);
    const deletedTodo = await TodoModel.findOneAndDelete({
      _id: todoId,
    });
    if (!deletedTodo) {
      res.status(404).json({ message: "Такой задачи нет" });
    }
    const newTodos = await TodoModel.find({ date: deletedTodo.date });
    res.json(newTodos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось удалить задачу" });
  }
};

export const complete = async (req, res) => {
  try {
    const todoId = req.body.id;
    const newValue = req.body.newValue;
    console.log("server");
    console.log(todoId, newValue);

    await TodoModel.findOneAndUpdate(
      {
        _id: todoId,
      },
      {
        completed: newValue,
      }
    );

    res.json({ _id: todoId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось удалить задачу" });
  }
};

export const update = async (req, res) => {
  try {
    const todoId = req.params.id;
    await TodoModel.updateOne(
      {
        _id: todoId,
      },
      {
        title: req.body.title,
        text: req.body.text,
      }
    );
    res.json({ _id: todoId });
  } catch (error) {
    console.log(first);
    res.status(500).json({ message: "Не удалось обновить задачу" });
  }
};
