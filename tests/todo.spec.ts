
import { expect, test } from "@playwright/test";
import User from "../models/User";
import RegisterPage from "../pages/RegisterPage";
import TodoPage from "../pages/TodoPage";
import NewTodoPage from "../pages/NewTodoPage";

test("Should be able to add todo ", async ({ page, request, context }) => {
  const user = new User();
  const registerPage = new RegisterPage(page, request, context);
  await registerPage.registerUsingTheApi(user);

  const newTodoPage = new NewTodoPage(page);
  await newTodoPage.load();
  await newTodoPage.addNewTask("Playwright");

  const todoPage = new TodoPage(page);

  const todoText = await todoPage.getTodoByIndex(0);
  expect(todoText).toEqual("Playwright");
});

test("Should be able to delete todo ", async ({ page, request, context }) => {
  const user = new User();
  const registerPage = new RegisterPage(page, request, context);
  await registerPage.registerUsingTheApi(user);
  const newTodoPage = new NewTodoPage(page, request);
  await newTodoPage.addNewTaskUsingApi(user);
  const todoPage = new TodoPage(page);
  await todoPage.load();

  await page.click('[data-testid="delete"]');

  const noTodosMessage = todoPage.getNoTodosMessage();

  await expect(noTodosMessage).toBeVisible();
});
test.afterAll(async ({ browser }) => {
  await browser.close();
});
