import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("submitting a blog calls callback with correct blog details", async () => {
  const user = userEvent.setup();
  const mockCreateBlog = vi.fn();

  render(<BlogForm createBlog={mockCreateBlog} />);

  const title = screen.getByLabelText("title:");
  await user.type(title, "testing a form...");

  const author = screen.getByLabelText("author:");
  await user.type(author, "me");

  const url = screen.getByLabelText("url:");
  await user.type(url, "localhost");

  const sendButton = screen.getByText("Create");
  await user.click(sendButton);

  expect(mockCreateBlog.mock.calls).toHaveLength(1);
  console.log(mockCreateBlog.mock.calls);
  expect(mockCreateBlog.mock.calls[0][0].title).toBe("testing a form...");
  expect(mockCreateBlog.mock.calls[0][0].author).toBe("me");
  expect(mockCreateBlog.mock.calls[0][0].url).toBe("localhost");
});
