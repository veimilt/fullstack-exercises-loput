import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders title", () => {
  const testBlog = {
    title: "Awesome blog title for testing purposes",
    author: "tester",
    url: "localhost",
    likes: 0,
    user: {
      username: "tester_username",
    },
  };

  const user = {
    username: "tester_username",
  };

  const mockHandlerUpvote = vi.fn();
  const mockHandlerDelete = vi.fn();

  render(
    <Blog
      blog={testBlog}
      upvoteBlog={mockHandlerUpvote}
      deleteBlog={mockHandlerDelete}
      user={user}
    />,
  );

  const element = screen.getByText("Awesome blog title for testing purposes");
  expect(element).toBeDefined();
});

test("blogdetails are displayed once view button has been pressed", async () => {
  const testBlog = {
    title: "Awesome blog title for testing purposes",
    author: "tester",
    url: "localhost",
    likes: 0,
    user: {
      username: "tester_username",
    },
  };

  const testUser = {
    username: "tester_username",
  };

  const mockHandlerUpvote = vi.fn();
  const mockHandlerDelete = vi.fn();

  render(
    <Blog
      blog={testBlog}
      upvoteBlog={mockHandlerUpvote}
      deleteBlog={mockHandlerDelete}
      user={testUser}
    />,
  );

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const url = await screen.findByText("URL: localhost");
  expect(url).toBeVisible();

  const author = await screen.findByText("Added by user tester_username");
  expect(author).toBeVisible();

  const likes = await screen.findByText("Likes: 0");
  expect(likes).toBeVisible();
});

test("pressing like button twice calls the callback function twice", async () => {
  const testBlog = {
    title: "Awesome blog title for testing purposes",
    author: "tester",
    url: "localhost",
    likes: 0,
    user: {
      username: "tester_username",
    },
  };

  const testUser = {
    username: "tester_username",
  };

  const mockHandlerUpvote = vi.fn();
  const mockHandlerDelete = vi.fn();

  render(
    <Blog
      blog={testBlog}
      upvoteBlog={mockHandlerUpvote}
      deleteBlog={mockHandlerDelete}
      user={testUser}
    />,
  );

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const likeButton = screen.getByText("Like");
  await user.click(likeButton);
  await user.click(likeButton);

  console.log(mockHandlerUpvote.mock.calls);
  expect(mockHandlerUpvote.mock.calls).toHaveLength(2);
});
