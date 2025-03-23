import { UserProduct, ProductStatus, getUserProducts, getUserProductById, updateUserProduct, createProductModerationNotification } from './userProductsService';
import { User } from '../context/AuthContext';

// Типы данных для админ-панели
export type UserRole = 'user' | 'admin' | 'moderator' | 'support' | 'system';

export interface AdminUser extends User {
  role: UserRole;
  registrationDate: string;
  lastLogin: string;
  isActive: boolean;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  createdAt: string;
  completedAt?: string;
  paymentMethod: string;
  paymentDetails?: string;
  notes?: string;
}

// Статистика для админ-панели
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingProducts: number;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  recentTransactions: PaymentTransaction[];
  pendingModeration: UserProduct[];
}

// Новые интерфейсы для управления продуктами

// Интерфейс для категорий продуктов
export interface ProductCategoryConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Интерфейс для настроек сайта
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteLogo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  socialLinks: {
    vk?: string;
    telegram?: string;
    discord?: string;
    instagram?: string;
  };
  footerText: string;
  termsPageUrl: string;
  privacyPageUrl: string;
  updatedAt: string;
}

// Mock ADMIN_USERS для демонстрации
const ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin1',
    email: 'admin@example.com',
    username: 'SiteAdmin',
    role: 'admin',
    registrationDate: '2023-01-01T10:00:00Z',
    lastLogin: new Date().toISOString(),
    isActive: true,
    avatar: 'https://same-assets.com/vi-assets/static/admin-avatar.jpg',
  },
  {
    id: 'mod1',
    email: 'moderator@example.com',
    username: 'ContentMod',
    role: 'moderator',
    registrationDate: '2023-02-15T14:30:00Z',
    lastLogin: new Date().toISOString(),
    isActive: true,
    avatar: 'https://same-assets.com/vi-assets/static/mod-avatar.jpg',
  },
  {
    id: 'support1',
    email: 'support@example.com',
    username: 'SupportAgent',
    role: 'support',
    registrationDate: '2023-03-10T09:15:00Z',
    lastLogin: new Date().toISOString(),
    isActive: true,
    avatar: 'https://same-assets.com/vi-assets/static/support-avatar.jpg',
  },
];

// Реальные транзакции - будем собирать из данных
let TRANSACTIONS: PaymentTransaction[] = [];

// Настройки сайта - значения по умолчанию
let SITE_SETTINGS: SiteSettings = {
  siteName: 'Steam Shop',
  siteDescription: 'Магазин аккаунтов, игр и ключей Steam',
  siteLogo: 'https://same-assets.com/vi-assets/static/steam_logo.png',
  favicon: 'https://same-assets.com/vi-assets/static/favicon.ico',
  primaryColor: '#171a21',
  secondaryColor: '#66c0f4',
  contactEmail: 'support@steamshop.com',
  socialLinks: {
    vk: 'https://vk.com/steamshop',
    telegram: 'https://t.me/steamshop',
    discord: 'https://discord.gg/steamshop',
  },
  footerText: '© 2023 Steam Shop. Все права защищены.',
  termsPageUrl: '/terms',
  privacyPageUrl: '/privacy',
  updatedAt: new Date().toISOString(),
};

// Категории продуктов с дополнительными полями
const PRODUCT_CATEGORIES: ProductCategoryConfig[] = [
  {
    id: 'account',
    name: 'Аккаунты Steam',
    description: 'Аккаунты с играми и достижениями',
    icon: '👤',
    isActive: true,
    slug: 'accounts',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'balance',
    name: 'Пополнение баланса',
    description: 'Услуги по пополнению баланса Steam',
    icon: '💰',
    isActive: true,
    slug: 'balance',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'game',
    name: 'Игры',
    description: 'Цифровые копии игр',
    icon: '🎮',
    isActive: true,
    slug: 'games',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'skin',
    name: 'Скины',
    description: 'Скины и предметы из игр',
    icon: '🎨',
    isActive: true,
    slug: 'skins',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'key',
    name: 'Ключи активации',
    description: 'Ключи для активации игр и дополнений',
    icon: '🔑',
    isActive: true,
    slug: 'keys',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'service',
    name: 'Услуги',
    description: 'Различные игровые услуги',
    icon: '🛠️',
    isActive: true,
    slug: 'services',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

// Хранит пароли пользователей (в реальном приложении это было бы в базе данных и шифровалось)
const USER_CREDENTIALS: Record<string, {email: string, password: string}> = {
  'admin1': {email: 'admin@example.com', password: 'admin123'},
};

// Проверка роли администратора
export const isAdmin = (userId: string): boolean => {
  return ADMIN_USERS.some(admin => admin.id === userId && (admin.role === 'admin' || admin.role === 'moderator'));
};

// Получение информации о пользователе админом
export const getUserById = (userId: string): AdminUser | null => {
  const adminUser = ADMIN_USERS.find(u => u.id === userId);
  if (adminUser) return adminUser;

  // В реальном приложении здесь будет запрос к API для получения данных пользователя
  return null;
};

// Получение списка всех пользователей
export const getAllUsers = (): AdminUser[] => {
  // В реальном приложении здесь будет запрос к API
  return ADMIN_USERS;
};

// Получение статистики для админ-панели
export const getAdminStats = (): AdminStats => {
  // Получаем товары, ожидающие модерации
  const pendingProducts = getProductsForModeration();
  const allProducts = getUserProducts();

  // Формируем статистику на основе реальных данных
  return {
    totalUsers: ADMIN_USERS.length,
    activeUsers: ADMIN_USERS.filter(u => u.isActive).length,
    pendingProducts: pendingProducts.length,
    totalProducts: allProducts.length,
    totalSales: TRANSACTIONS.filter(t => t.status === 'completed').length,
    totalRevenue: TRANSACTIONS.filter(t => t.status === 'completed')
                .reduce((acc, t) => acc + t.amount, 0),
    recentTransactions: TRANSACTIONS.slice(0, 5),
    pendingModeration: pendingProducts,
  };
};

// Получение всех транзакций
export const getAllTransactions = (): PaymentTransaction[] => {
  return TRANSACTIONS;
};

// Очистка транзакций для сброса статистики
export const clearAllTransactions = (): void => {
  TRANSACTIONS = [];
};

// Добавление новой транзакции
export const addTransaction = (transaction: Omit<PaymentTransaction, 'id' | 'createdAt'>): PaymentTransaction => {
  const newTransaction: PaymentTransaction = {
    ...transaction,
    id: `txn-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  TRANSACTIONS.unshift(newTransaction); // Добавляем в начало массива
  return newTransaction;
};

// Получение транзакций пользователя
export const getUserTransactions = (userId: string): PaymentTransaction[] => {
  return TRANSACTIONS.filter(txn => txn.userId === userId);
};

// Обновление статуса транзакции
export const updateTransactionStatus = (
  transactionId: string,
  status: 'pending' | 'completed' | 'refunded' | 'failed',
  notes?: string
): PaymentTransaction | null => {
  const txnIndex = TRANSACTIONS.findIndex(txn => txn.id === transactionId);
  if (txnIndex === -1) return null;

  const updatedTxn = {
    ...TRANSACTIONS[txnIndex],
    status,
    ...(status === 'completed' && { completedAt: new Date().toISOString() }),
    ...(notes && { notes }),
  };

  TRANSACTIONS[txnIndex] = updatedTxn;
  return updatedTxn;
};

// Модерация товара
export const moderateProduct = (
  productId: string,
  action: 'approve' | 'reject',
  moderatorId: string,
  comment?: string
): boolean => {
  // Get the product
  const product = getUserProductById(productId);
  if (!product) {
    console.error(`Product with ID ${productId} not found`);
    return false;
  }

  // Update the product status and add moderation information
  const newStatus = action === 'approve' ? 'active' : 'rejected';

  const updateResult = updateUserProduct(productId, {
    status: newStatus,
    moderatedBy: moderatorId,
    moderatedAt: new Date().toISOString(),
    ...(comment && { moderationComment: comment })
  });

  if (!updateResult) {
    console.error(`Failed to update product ${productId} status to ${newStatus}`);
    return false;
  }

  // Создаем уведомление для пользователя о результатах модерации
  const notification = createProductModerationNotification(productId, action, comment);

  if (notification) {
    console.log(`Notification created for user ${notification.userId} about product ${productId}`);
  } else {
    console.error(`Failed to create notification for product ${productId}`);
  }

  // При одобрении товара, создаем транзакцию учета
  if (action === 'approve') {
    addTransaction({
      userId: product.userId,
      productId: product.id,
      amount: 0, // Нет финансовой операции
      status: 'completed',
      paymentMethod: 'system',
      paymentDetails: 'Товар одобрен модератором',
      notes: `Товар "${product.title}" прошел модерацию`,
      completedAt: new Date().toISOString()
    });
  }

  console.log(`Product ${productId} was ${action}ed by moderator ${moderatorId}${comment ? ` with comment: ${comment}` : ''}`);
  return true;
};

// Получение списка товаров, ожидающих модерации
export const getProductsForModeration = (): UserProduct[] => {
  // Получаем все товары
  const allProducts = getUserProducts();

  // Фильтруем товары со статусом 'pending'
  const pendingProducts = allProducts.filter(product => product.status === 'pending');

  return pendingProducts;
};

// Создание нового администратора
export const createAdminUser = (user: Omit<AdminUser, 'id' | 'registrationDate'>): AdminUser => {
  const newAdmin: AdminUser = {
    ...user,
    id: `admin${ADMIN_USERS.length + 1}`,
    registrationDate: new Date().toISOString(),
  };

  ADMIN_USERS.push(newAdmin);
  return newAdmin;
};

// Обновление данных администратора
export const updateAdminUser = (userId: string, updates: Partial<AdminUser>): AdminUser | null => {
  const adminIndex = ADMIN_USERS.findIndex(admin => admin.id === userId);
  if (adminIndex === -1) return null;

  const updatedAdmin = {
    ...ADMIN_USERS[adminIndex],
    ...updates,
  };

  ADMIN_USERS[adminIndex] = updatedAdmin;
  return updatedAdmin;
};

// Проверка наличия у пользователя прав администратора
export const checkAdminAccess = (userId: string): { hasAccess: boolean; role?: UserRole } => {
  const admin = ADMIN_USERS.find(a => a.id === userId);

  if (!admin || !admin.isActive) {
    return { hasAccess: false };
  }

  return { hasAccess: true, role: admin.role };
};

// Получение товаров пользователя по ID пользователя
export const getUserProductsById = (userId: string) => {
  return getUserProducts(userId);
};

// Новые функции для управления категориями продуктов

// Получение всех категорий продуктов
export const getAllProductCategories = (): ProductCategoryConfig[] => {
  return PRODUCT_CATEGORIES;
};

// Получение категории по ID
export const getProductCategoryById = (categoryId: string): ProductCategoryConfig | undefined => {
  return PRODUCT_CATEGORIES.find(category => category.id === categoryId);
};

// Создание новой категории продуктов
export const createProductCategory = (category: Omit<ProductCategoryConfig, 'createdAt' | 'updatedAt'>): ProductCategoryConfig => {
  const newCategory: ProductCategoryConfig = {
    ...category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  PRODUCT_CATEGORIES.push(newCategory);
  return newCategory;
};

// Обновление категории продуктов
export const updateProductCategory = (categoryId: string, updates: Partial<ProductCategoryConfig>): ProductCategoryConfig | undefined => {
  const categoryIndex = PRODUCT_CATEGORIES.findIndex(cat => cat.id === categoryId);
  if (categoryIndex === -1) return undefined;

  const updatedCategory = {
    ...PRODUCT_CATEGORIES[categoryIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  PRODUCT_CATEGORIES[categoryIndex] = updatedCategory;
  return updatedCategory;
};

// Удаление категории продуктов
export const deleteProductCategory = (categoryId: string): boolean => {
  const categoryIndex = PRODUCT_CATEGORIES.findIndex(cat => cat.id === categoryId);
  if (categoryIndex === -1) return false;

  PRODUCT_CATEGORIES.splice(categoryIndex, 1);
  return true;
};

// Функции для управления настройками сайта

// Получение настроек сайта
export const getSiteSettings = (): SiteSettings => {
  return SITE_SETTINGS;
};

// Обновление настроек сайта
export const updateSiteSettings = (updates: Partial<SiteSettings>): SiteSettings => {
  SITE_SETTINGS = {
    ...SITE_SETTINGS,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return SITE_SETTINGS;
};

// Функции для управления учетными данными пользователей

// Получение учетных данных пользователя (только для админов)
export const getUserCredentials = (userId: string): {email: string, password: string} | undefined => {
  return USER_CREDENTIALS[userId];
};

// Обновление учетных данных пользователя (только для админов)
export const updateUserCredentials = (userId: string, credentials: {email?: string, password?: string}): boolean => {
  if (!USER_CREDENTIALS[userId]) {
    // Создаем новые учетные данные, если они не существуют
    USER_CREDENTIALS[userId] = {
      email: credentials.email || '',
      password: credentials.password || ''
    };
    return true;
  }

  if (credentials.email) {
    USER_CREDENTIALS[userId].email = credentials.email;
  }

  if (credentials.password) {
    USER_CREDENTIALS[userId].password = credentials.password;
  }

  return true;
};
