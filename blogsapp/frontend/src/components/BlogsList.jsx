import { useBlogContext } from "../BlogContext";

import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import BlogItem from "./BlogItem";

const BlogsList = () => {
  const { blogs, isLoading, isError, blogFormRef } = useBlogContext();

  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  if (isError) {
    return <div>Error loading blogs</div>;
  }

  return (
    <div className="container">
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <BlogItem
            key={blog.id}
            blog={blog}
            // upvoteBlog={likeBlog}
            // deleteBlog={deleteBlog}
          />
        ))}
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
    </div>
  );
};

export default BlogsList;
