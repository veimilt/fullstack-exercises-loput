const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
// const helper = require('./test_helper')
const Blog = require("../models/blog");
const User = require("../models/user");
const { url } = require("node:inspector");

const api = supertest(app);

const initialBlogs = [
  {
    title: "blog for testing 1",
    author: "v",
    url: "localhost",
    likes: 6,
  },
  {
    title: "blog for testing 2",
    author: "v",
    url: "localhost",
    likes: 9,
  },
];

const initialUsers = [
  {
    username: "test_user_1",
    name: "test1",
    password: "test123",
  },
  {
    username: "test_user_2",
    name: "test2",
    password: "test123",
  },
];

const createUserAndLogin = async () => {
  const newUser = {
    username: "abc123",
    password: "abc123",
    name: "abc123",
  };

  const createdUser = await api.post("/api/users").send(newUser);

  const loginResponse = await api.post("/api/login").send(newUser);

  return loginResponse.body.token;
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);

  await User.deleteMany({});
  await User.insertMany(initialUsers);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("blogs have field id and do not have a field _id", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body;

  blogs.forEach((blog) => {
    assert.ok(blog.id, "Blog is missing id field");
  });

  blogs.forEach((blog) => {
    assert.strictEqual(blog._id, undefined, "Blog contains _id field");
  });
});

test("user creation and login works", async () => {
  const newUser = {
    username: "abc123",
    password: "abc123",
    name: "abc123",
  };

  const createdUser = await api.post("/api/users").send(newUser).expect(201);
  const users = await User.find({});
  const usersToJSON = users.map((u) => u.toJSON());

  const usernames = usersToJSON.map((u) => u.username);
  assert(usernames.includes("abc123"));

  assert.strictEqual(usersToJSON.length, initialUsers.length + 1);
  //user ok

  const loginResponse = await api.post("/api/login").send(newUser).expect(200);

  assert.deepStrictEqual(loginResponse.body, {
    token: loginResponse.body.token, // token is dynamic, so use the returned one
    username: newUser.username,
    name: newUser.name,
  });
  //login ok
});

test("post to /api/blogs saves the blog sent to the database", async () => {
  const newBlog = {
    title: "New test blog made by me",
    author: "v",
    url: "http://example.com",
    likes: 7,
  };

  //create a user and login first to receive a token (it's required for adding a blog etc)

  const token = await createUserAndLogin();

  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogs = await Blog.find({});
  const blogsToJSON = blogs.map((blog) => blog.toJSON());

  assert.strictEqual(blogsToJSON.length, initialBlogs.length + 1);

  const contents = blogsToJSON.map((blog) => blog.title);
  assert(contents.includes("New test blog made by me"));
});

test("blog sent via post to api/blogs gets 0 likes if likes not defined", async () => {
  const newBlogNoLikes = {
    title: "New test without likes field",
    author: "v",
    url: "http://example.com",
  };

  //create a user and login first to receive a token (it's required for adding a blog etc)

  const token = await createUserAndLogin();

  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlogNoLikes)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(postResponse.body.likes, 0);
});

test("blog sent without title or url gets 400 bad request and nothing gets added to the database", async () => {
  const blogNoURL = {
    title: "New test without likes field",
    author: "v",
  };

  const blogNoTitle = {
    url: "localhost",
    author: "v",
  };

  //create a user and login first to receive a token (it's required for adding a blog etc)

  const token = await createUserAndLogin();

  const postResponseNoURL = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(blogNoURL)
    .expect(400);

  const postResponseNoTitle = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(blogNoTitle)
    .expect(400);

  const blogsAtEnd = await Blog.find({});
  const blogsToJSON = blogsAtEnd.map((blog) => blog.toJSON());

  assert.strictEqual(blogsToJSON.length, initialBlogs.length);
});

test("a blog can be deleted", async () => {
  const blogToBeDeleted = {
    title: "This blog will be deleted",
    author: "v",
    url: "http://example.com",
    likes: 88,
  };

  //let's create and delete a blog with user created by a createUserAndLogin -function, as we have the token that the function receives
  const token = await createUserAndLogin();

  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(blogToBeDeleted)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const id = postResponse.body.id;

  let blogs = await Blog.find({});
  let blogsToJSON = blogs.map((blog) => blog.toJSON());

  assert.strictEqual(blogsToJSON.length, initialBlogs.length + 1);

  let contents = blogsToJSON.map((blog) => blog.title);
  assert(contents.includes("This blog will be deleted"));

  const deleteResponse = await api
    .delete(`/api/blogs/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  blogs = await Blog.find({});
  blogsToJSON = blogs.map((blog) => blog.toJSON());

  assert.strictEqual(blogsToJSON.length, initialBlogs.length);
});

test("put request to /api/blogs/:id increases the likes of the blog by one", async () => {
  const blogs = await Blog.find({});
  const blogToUpdate = blogs[0];
  const initialLikes = blogToUpdate.likes;

  const putResponse = await api
    .put(`/api/blogs/${blogToUpdate._id}`)
    .expect(200);

  assert.strictEqual(putResponse.body.likes, initialLikes + 1);

  const updatedBlog = await Blog.findById(blogToUpdate._id);
  assert.strictEqual(updatedBlog.likes, initialLikes + 1);
});

describe("validation of password and username when creating a user via POST to /api/users", () => {
  test("user not created if username or password not included in the request body", async () => {
    const noUserName = {
      password: "nieninf837",
    };
    let postResponse = await api
      .post("/api/users")
      .send(noUserName)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(postResponse.body.error, "username or password missing");
    let usersAtEnd = await User.find({});
    let usersToJSON = usersAtEnd.map((user) => user.toJSON());
    assert.strictEqual(usersToJSON.length, initialUsers.length);

    const noPassword = {
      userName: "nieninf837",
    };
    postResponse = await api
      .post("/api/users")
      .send(noPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(postResponse.body.error, "username or password missing");
    usersAtEnd = await User.find({});
    usersToJSON = usersAtEnd.map((user) => user.toJSON());
    assert.strictEqual(usersToJSON.length, initialUsers.length);
  });

  test("username min length", async () => {
    const testUser = {
      username: "12",
      name: "jotain",
      password: "jovneovnenvnsornveo",
    };

    const postResponse = await api
      .post("/api/users")
      .send(testUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      postResponse.body.error,
      "username must be at least 3 characters long",
    );

    let usersAtEnd = await User.find({});
    let usersToJSON = usersAtEnd.map((user) => user.toJSON());

    assert.strictEqual(usersToJSON.length, initialUsers.length);
  });

  test("username must be unique", async () => {
    const testUser = {
      username: "test_user_1",
      name: "test1",
      password: "test123",
    };

    const postResponse = await api
      .post("/api/users")
      .send(testUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      postResponse.body.error,
      "expected username to be unique",
    );

    let usersAtEnd = await User.find({});
    let usersToJSON = usersAtEnd.map((user) => user.toJSON());

    assert.strictEqual(usersToJSON.length, initialUsers.length);
  });

  test("password min length", async () => {
    const testUser = {
      username: "moikka",
      name: "jotain",
      password: "mo",
    };

    const postResponse = await api
      .post("/api/users")
      .send(testUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      postResponse.body.error,
      "password must be at least 3 characters long",
    );

    let usersAtEnd = await User.find({});
    let usersToJSON = usersAtEnd.map((user) => user.toJSON());

    assert.strictEqual(usersToJSON.length, initialUsers.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
