import { expect, test } from "@playwright/test";
import User from "../models/User";
import RegisterPage from "../pages/RegisterPage";
import TodoPage from "../pages/TodoPage";

test("Should be able to register to the todo website", async ({ page }) => {
  const user = new User();
  const registerPage = new RegisterPage(page);
  await registerPage.load();

  await registerPage.register(user);

  const todoPage = new TodoPage(page);
  const welcomeMessage = todoPage.getWelcomeMessage();
  await expect(welcomeMessage).toBeVisible();
});
test.afterAll(async ({ browser }) => {
  await browser.close();
});
