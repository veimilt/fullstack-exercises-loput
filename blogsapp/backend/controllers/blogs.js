const blogslistRouter = require("express").Router();
const Blog = require("../models/blog");
// const User = require('../models/user')
// const { error } = require('../utils/logger')
const { userExtractor } = require("../utils/middleware");

blogslistRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogslistRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  if (!body.title || !body.url) {
    return response.status(400).json({
      error: "title or url missing in the request body",
    });
  }
  const user = request.user;
  const blog = new Blog({ ...request.body, user });
  const result = await blog.save();
  // Add the blog to the user's blogs array
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

blogslistRouter.post("/:id", async (request, response) => {
  const id = request.params.id;
  const body = request.body;
  if (!body?.comment) {
    return response.status(400).json({
      error: "comment missing in the request body",
    });
  }
  const blog = await Blog.findById(id);
  if (!blog) {
    return response.status(404).end();
  }
  blog.comments.push(body.comment);
  const result = await blog.save();
  response.json(result);
});

blogslistRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (!blog) {
    return response.status(400).end();
  }
  blog.likes = blog.likes + 1;
  const result = await blog.save();
  response.json(result);
});

blogslistRouter.delete("/:id", userExtractor, async (request, response) => {
  const id = request.params.id;
  const user = request.user;

  const blogToBeDeleted = await Blog.findById(id);
  if (!blogToBeDeleted) {
    return response.status(404).end();
  }

  if (blogToBeDeleted.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: "not authorized" });
  }

  await Blog.findByIdAndDelete(id);
  return response.status(204).end();
});

blogslistRouter.delete("/", (request, response) => {
  return response.status(400).json({
    error: "id missing from the request url",
  });
});

module.exports = blogslistRouter;
