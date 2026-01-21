import { useState } from "react";
import "./BlogForm.css";
import { useBlogContext } from "../BlogContext";

const BlogForm = () => {
  const [url, setURL] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const { addBlog } = useBlogContext();

  const handleAddBlog = (event) => {
    event.preventDefault();

    const blogObject = {
      title: title,
      author: author,
      url: url
    };

    addBlog(blogObject);

    setTitle("");
    setAuthor("");
    setURL("");
  };

  return (
    <form onSubmit={handleAddBlog}>
      <h2>Create new</h2>
      <label>
        title:
        <br />
        <input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </label>
      <br />
      <label>
        author:
        <br />
        <input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </label>
      <br />
      <label>
        url:
        <br />
        <input
          type="text"
          value={url}
          onChange={({ target }) => setURL(target.value)}
        />
      </label>
      <br />
      <br />

      <button className="submitblog-button" type="submit">
        Create
      </button>
    </form>
  );
};

export default BlogForm;
