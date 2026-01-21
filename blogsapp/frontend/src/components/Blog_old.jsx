// import { useState } from "react";
import "./Blog.css";
import { Link } from "react-router-dom";

const Blog = (props) => {
  // const [showDetails, setShowDetails] = useState(false);
  const { blog } = props;
  return (
    <div className="blog">
      <Link to={`/blogs/${blog.id}`}> {blog.title}</Link>
      {/* <div className="blogDetails">
          Author: {blog.author}
          <div>URL: {blog.url}</div>
          <div>
            Likes: {blog.likes}
            <button className="likebutton" onClick={() => upvoteBlog(blog.id)}>
              Like
            </button>
          </div>
          <div>Added by user {blog.user?.name || blog.user?.username}</div>
          {blog.user?.username === user.username && (
            <div>
              <button
                className="deletebutton"
                onClick={() => deleteBlog(blog.title, blog.id)}
              >
                Remove
              </button>
            </div>
          )}
        </div> */}
    </div>
  );
};

export default Blog;
