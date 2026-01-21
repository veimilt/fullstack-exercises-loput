import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const upvoteBlog = async (id) => {
  const response = await axios.put(`${baseUrl}/${id}`);
  return response.data;
};

const removeBlog = async (id) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

const commentBlog = async (id, commentString) => {
  const response = await axios.post(`${baseUrl}/${id}`, {
    comment: commentString
  });
  return response.data;
};

export { setToken, getAll, create, upvoteBlog, removeBlog, commentBlog };
