import { useState } from "react";
import { useParams } from "react-router-dom";
import { useBlogContext } from "../BlogContext";
import "./Blog.css";

const BlogView = () => {
  const { id } = useParams();
  const { blogs, likeBlog, addComment } = useBlogContext();
  const [comment, setComment] = useState("");

  if (!blogs || blogs.length === 0) {
    return <div>Loading...</div>;
  }

  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      addComment(id, comment);
      setComment("");
    }
  };

  return (
    <>
      <div className="blog-view">
        <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
        <p>
          {blog.likes} likes{" "}
          <button onClick={() => likeBlog(blog.id)}>Like</button>
        </p>
        <p>Added by {blog.user.username}</p>
      </div>
      <div className="comments-section">
        <h3>Comments</h3>
        <form onSubmit={handleSubmit}>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit">Comment</button>
        </form>
        {blog.comments && blog.comments.length > 0 ? (
          <ul>
            {blog.comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        ) : (
          <p>No comments yet, be the first one to comment</p>
        )}
      </div>
    </>
  );
};

export default BlogView;
