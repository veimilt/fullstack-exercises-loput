const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const locator = page.getByText("Login to application");
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("salainen");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("wrong credentials")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("salainen");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByLabel("title:").fill("test blog");
      await page.getByLabel("author:").fill("Kirjuri");
      await page.getByLabel("url:").fill("localhost");
      await page.getByRole("button", { name: "Create" }).click();
      await expect(
        page.locator(".blog").filter({ hasText: "test blog" }),
      ).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByLabel("title:").fill("like this blog");
      await page.getByLabel("author:").fill("Kirjuri");
      await page.getByLabel("url:").fill("localhost");
      await page.getByRole("button", { name: "Create" }).click();
      await expect(
        page.locator(".blog").filter({ hasText: "like this blog" }),
      ).toBeVisible();

      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByText("Likes: 0")).toBeVisible();

      await page.getByRole("button", { name: "Like" }).click();
      await expect(page.getByText("Likes: 1")).toBeVisible();
    });

    test("a blog can be deleted by the user who created it", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByLabel("title:").fill("delete this blog");
      await page.getByLabel("author:").fill("Kirjuri");
      await page.getByLabel("url:").fill("localhost");
      await page.getByRole("button", { name: "Create" }).click();
      await expect(
        page.locator(".blog").filter({ hasText: "delete this blog" }),
      ).toBeVisible();

      await page.getByRole("button", { name: "view" }).click();

      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "Remove" }).click();

      await expect(
        page.locator(".blog").filter({ hasText: "delete this blog" }),
      ).not.toBeVisible();
    });

    test("a blog can not be deleted by the user who did not create it", async ({
      page,
      request,
    }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByLabel("title:").fill("something");
      await page.getByLabel("author:").fill("Kirjuri");
      await page.getByLabel("url:").fill("localhost");
      await page.getByRole("button", { name: "Create" }).click();
      await expect(
        page.locator(".blog").filter({ hasText: "something" }),
      ).toBeVisible();

      await page.getByRole("button", { name: "Logout" }).click();

      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "Matti Meikalainen",
          username: "meika",
          password: "salainen",
        },
      });

      await page.goto("http://localhost:5173");
      await page.getByLabel("username").fill("meika");
      await page.getByLabel("password").fill("salainen");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Matti Meikalainen logged in")).toBeVisible();

      await page.getByRole("button", { name: "view" }).click();
      await expect(
        page.getByRole("button", { name: "Remove" }),
      ).not.toBeVisible();
    });
  });
});
