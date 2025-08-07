import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SavingProductService } from 'src/saving-products/saving-product.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entity/users.entity';

interface SessionState {
  level: number;
  page?: number;
  authenticated?: boolean;
  awaitingPinForProductId?: string;
  isNewUser?: boolean;
  nationalId?: string;
}

@Injectable()
export class UssdService {
  private sessionMap = new Map<string, SessionState>();

  constructor(
    private readonly usersService: UsersService,
    private readonly savingProductService: SavingProductService,
    private readonly authService: AuthService,
  ) {}

  async handleRequest(body: {
    phoneNumber: string;
    text: string;
    sessionId: string;
  }): Promise<string> {
    const { phoneNumber, text, sessionId } = body;
    const input = text.split('*');
    const level = input.length;
    const sessionKey = sessionId || phoneNumber;

    let state = this.sessionMap.get(sessionKey);

    // Register session if not present
    if (!state) {
      const user = await this.usersService.findByPhoneNumber(phoneNumber);
      if (!user) {
        state = { level: 1, isNewUser: true };
      } else {
        state = { level: 1, authenticated: false };
      }
      this.sessionMap.set(sessionKey, state);
    }

    const user = await this.usersService.findByPhoneNumber(phoneNumber);

    if (state.isNewUser) {
      return this.handleNewUser(sessionKey, phoneNumber, input, level, state);
    }

    if (!state.authenticated) {
      return this.handlePinAuthentication(
        sessionKey,
        user,
        input,
        level,
        state,
      );
    }

    return this.handleMenuFlow(sessionKey, input, level, user, state);
  }

  private async handleNewUser(
    sessionKey: string,
    phoneNumber: string,
    input: string[],
    level: number,
    state: SessionState,
  ) {
    switch (level) {
      case 1:
        this.sessionMap.set(sessionKey, { ...state, level: 1 });
        return `CON Welcome to Saving For Future\n1. Enroll`;
      case 2:
        if (input[1] === '1') {
          this.sessionMap.set(sessionKey, { ...state, level: 2 });
          return `CON Enter your National ID:`;
        }
        return `END Invalid option`;
      case 3: {
        const nationalId = input[2];
        await this.usersService.ussdRegister({ phoneNumber, nationalId });
        this.sessionMap.delete(sessionKey);
        return `END You have been successfully enrolled!`;
      }
      default:
        return `END Invalid input`;
    }
  }

  private async handlePinAuthentication(
    sessionKey: string,
    user: User | null,
    input: string[],
    level: number,
    state: SessionState,
  ) {
    if (!user || user == null) {
      return `CON Unauthorized Access:`;
    }
    if (level === 1) {
      return `CON Welcome ${user.firstName}, please enter your PIN to continue:`;
    }

    if (level === 2) {
      const pin = input[1];
      try {
        await this.authService.signIn({
          identifier: user.email || user.phoneNumber,
          password: pin,
        });
        this.sessionMap.set(sessionKey, {
          ...state,
          level: 2,
          authenticated: true,
          page: 1,
        });
        return this.showMainMenu(user);
      } catch {
        this.sessionMap.delete(sessionKey);
        return `END Invalid PIN. Please try again later.`;
      }
    }

    return `END Invalid input`;
  }

  private showMainMenu(user: User) {
    return `CON Welcome back ${user.firstName}!\n1. View My Subscriptions\n2. Subscribe to Product\n3. View All Saving Products`;
  }

  private async handleMenuFlow(
    sessionKey: string,
    input: string[],
    level: number,
    user: User | null,
    state: SessionState,
  ) {
    if (!user || user == null) {
      return `CON Unauthorized Access:`;
    }
    if (level === 2 && input[1] === '1') {
      return this.displayUserSubscriptions(user.id);
    }

    if (level === 2 && input[1] === '2') {
      return this.beginSubscription(sessionKey, state.page || 1);
    }

    if (level === 2 && input[1] === '3') {
      return this.listAllSavingProducts(1);
    }

    if (input[1] === '2' && level >= 3) {
      return this.subscriptionPaginationAndSelection(sessionKey, input, user);
    }
    return `END Invalid selection`;
  }

  private async beginSubscription(sessionKey: string, page = 1) {
    const currentState = this.sessionMap.get(sessionKey) || {
      level: 2,
      authenticated: true,
    };

    this.sessionMap.set(sessionKey, {
      ...currentState,
      level: 2,
      page,
      awaitingPinForProductId: undefined,
    });

    return this.listSavingProductsForSubscription(sessionKey, page);
  }

  private async subscriptionPaginationAndSelection(
    sessionKey: string,
    input: string[],
    user: User,
  ) {
    const state = this.sessionMap.get(sessionKey);
    if (!state) return `END Unexpected error`;

    const selected = input[2];
    const page = state.page || 1;
    const limit = 5;

    const { data: products, total } = await this.savingProductService.findAll(
      undefined,
      undefined,
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);

    if (selected === `${limit + 1}` && page < totalPages) {
      state.page = page + 1;
      this.sessionMap.set(sessionKey, state);
      return this.listSavingProductsForSubscription(sessionKey, state.page);
    }

    if (selected === `${limit + 2}` && page > 1) {
      state.page = page - 1;
      this.sessionMap.set(sessionKey, state);
      return this.listSavingProductsForSubscription(sessionKey, state.page);
    }

    if (selected === `${limit + 3}`) {
      this.sessionMap.delete(sessionKey);
      return this.showMainMenu(user);
    }

    const selectedIndex = Number(selected);
    if (
      isNaN(selectedIndex) ||
      selectedIndex < 1 ||
      selectedIndex > products.length
    ) {
      return `END Invalid selection`;
    }

    const product = products[selectedIndex - 1];
    state.awaitingPinForProductId = product.id;
    this.sessionMap.set(sessionKey, state);

    await this.usersService.addNewSubscription(user.id, product.id);
    this.sessionMap.delete(sessionKey);

    return `END Subscription to "${product.name}" successful. Thank you!`;
  }

  private async displayUserSubscriptions(userId: string) {
    const subs = await this.usersService.getUserSubscriptions(userId);
    if (!subs.length) return `END You have no subscriptions yet.`;

    const response = subs
      .map((sub, i) => `${i + 1}. ${sub.savingProduct.name}`)
      .join('\n');

    return `END Your Subscriptions:\n${response}`;
  }

  private async listAllSavingProducts(page = 1, limit = 5) {
    const { data: products, total } = await this.savingProductService.findAll(
      undefined,
      undefined,
      page,
      limit,
    );

    if (!products.length) return `END No saving products found.`;

    const totalPages = Math.ceil(total / limit);
    const productLines = products
      .map((p, i) => `${(page - 1) * limit + i + 1}. ${p.name}`)
      .join('\n');

    let response = `CON Saving Products (Page ${page}/${totalPages}):\n${productLines}\n`;
    if (page < totalPages) response += `${limit + 1}. Next\n`;
    if (page > 1) response += `${limit + 2}. Previous\n`;
    response += '0. Back';

    return response;
  }

  private async listSavingProductsForSubscription(
    sessionKey: string,
    page = 1,
    limit = 5,
  ) {
    const { data: products, total } = await this.savingProductService.findAll(
      undefined,
      undefined,
      page,
      limit,
    );

    if (!products.length) {
      this.sessionMap.delete(sessionKey);
      return `END No saving products available for subscription.`;
    }

    const totalPages = Math.ceil(total / limit);
    const productLines = products
      .map((p, i) => `${i + 1}. ${p.name}`)
      .join('\n');

    let response = `CON Subscribe to a Product (Page ${page}/${totalPages}):\n${productLines}\n`;
    if (page < totalPages) response += `${limit + 1}. Next\n`;
    if (page > 1) response += `${limit + 2}. Previous\n`;
    response += `${limit + 3}. Cancel`;

    return response;
  }
}
