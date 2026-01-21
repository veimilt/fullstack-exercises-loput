import { createContext, useContext, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as blogService from "./services/blogs";
import { useNotificationDispatch } from "./NotificationContext";

const BlogContext = createContext();

export const BlogContextProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const blogFormRef = useRef();
  const notificationDispatch = useNotificationDispatch();

  const showNotification = (message, duration = 3000) => {
    notificationDispatch({ type: "SHOW", payload: message });
    setTimeout(() => {
      notificationDispatch({ type: "HIDE" });
    }, duration);
  };

  // Fetching blogs
  const {
    data: blogs = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll
  });

  // Mutations
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      showNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added!`
      );
    },
    onError: (error) => {
      const msg = error.response?.data?.error || error.message;
      showNotification(msg);
    }
  });

  const likeBlogMutation = useMutation({
    mutationFn: blogService.upvoteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    }
  });

  const commentBlogMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.commentBlog(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error) => {
      const msg = error.response?.data?.error || error.message;
      showNotification(msg);
    }
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.removeBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    }
  });

  // Handler functions
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    newBlogMutation.mutate(blogObject);
  };

  const likeBlog = (id) => {
    likeBlogMutation.mutate(id);
  };

  const deleteBlog = (title, id) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      deleteBlogMutation.mutate(id);
    }
  };

  const addComment = (id, comment) => {
    commentBlogMutation.mutate({ id, comment });
  };

  const value = {
    blogs,
    isLoading,
    isError,
    addBlog,
    likeBlog,
    deleteBlog,
    addComment,
    blogFormRef
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlogContext = () => {
  return useContext(BlogContext);
};
