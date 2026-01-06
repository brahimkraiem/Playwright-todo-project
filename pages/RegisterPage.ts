import { APIRequestContext, BrowserContext, Page } from "@playwright/test";
import User from "../models/User";
import UserApi from "../apis/UserApi";
import config from "../playwright.config";

export default class RegisterPage {
  private page: Page;
  private request?: APIRequestContext;
  private context?: BrowserContext;

  constructor(
    page: Page,
    request?: APIRequestContext,
    context?: BrowserContext
  ) {
    this.page = page;
    this.request = request;
    this.context = context;
  }

  private get firstNameInput() {
    return '[data-testid="first-name"]';
  }
  private get lastLastNameInput() {
    return '[data-testid="last-name"]';
  }
  private get emailInput() {
    return '[data-testid="email"]';
  }
  private get passwordInput() {
    return '[data-testid="password"]';
  }
  private get confirmPasswordInput() {
    return '[data-testid="confirm-password"]';
  }
  private get registerButton() {
    return '[data-testid="submit"]';
  }

  async load() {
    await this.page.goto("/signup");
  }
  async register(user: User) {
    await this.page.fill(this.firstNameInput, user.getFirstName());
    await this.page.fill(this.lastLastNameInput, user.getlastName());
    await this.page.fill(this.emailInput, user.getEmail());
    await this.page.fill(this.passwordInput, user.getPassword());
    await this.page.fill(this.confirmPasswordInput, user.getPassword());
    await this.page.click('[data-testid="submit"]');
  }
  async registerUsingTheApi(user: User) {
    const response = await new UserApi(this.request!).register(user);
    const responseBody = await response.json();
    const { access_token: accessToken, userID, firstName } = responseBody;
    user.setAccessToken(accessToken);

    await this.context!.addCookies([
      {
        name: "access_token",
        value: accessToken,
        url: config.use?.baseURL,
      },
      {
        name: "firstName",
        value: firstName,
        url: config.use?.baseURL,
      },
      {
        name: "userID",
        value: userID,
        url: config.use?.baseURL,
      },
    ]);
  }
}
