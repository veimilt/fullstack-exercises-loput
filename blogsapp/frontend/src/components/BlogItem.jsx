import { Link, useParams } from "react-router-dom";
import "./Blog.css";

const BlogItem = ({ blog }) => {
  const { id } = useParams();

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="blog">
      <h3>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </h3>
    </div>
  );
};

export default BlogItem;
