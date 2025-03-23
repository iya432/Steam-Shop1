// Типы категорий товаров
export type ProductCategory =
  | 'account'
  | 'balance'
  | 'game'
  | 'skin'
  | 'key'
  | 'service';

// Типы предложений
export type OfferType =
  | 'sale'
  | 'rent'
  | 'exchange'
  | 'discount';

// Статус товара
export type ProductStatus =
  | 'active'
  | 'pending'
  | 'sold'
  | 'rejected';

// Интерфейс товара пользователя
export interface UserProduct {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: ProductCategory;
  offerType: OfferType;
  images: string[];
  featuredImage: string;
  status: ProductStatus;
  created: string;
  updated: string;

  // Поля для аккаунтов
  level?: number;
  games?: number;
  hours?: number;
  prime?: boolean;
  csgo?: boolean;
  dota2?: boolean;

  // Поля для скинов
  game?: string;
  rarity?: string;
  wear?: string;

  // Поля для ключей
  platform?: string;
  region?: string;

  // Поля для аренды
  rentDuration?: number; // в днях
  rentPrice?: number; // цена за день

  // Дополнительные поля для модерации
  moderationComment?: string;
  moderatedBy?: string;
  moderatedAt?: string;
}

// Типы уведомлений
export type NotificationType = 'success' | 'warning' | 'info' | 'error';

// Интерфейс для уведомлений пользователя
export interface UserNotification {
  id: string;
  userId: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string; // Опциональная ссылка для перехода
  created: string;
  productId?: string; // Опциональная ссылка на товар
}

// Категории для выбора при создании товара
export const PRODUCT_CATEGORIES = [
  {
    id: 'account',
    name: 'Аккаунты Steam',
    description: 'Аккаунты с играми и достижениями',
    icon: '👤'
  },
  {
    id: 'balance',
    name: 'Пополнение баланса',
    description: 'Услуги по пополнению баланса Steam',
    icon: '💰'
  },
  {
    id: 'game',
    name: 'Игры',
    description: 'Цифровые копии игр',
    icon: '🎮'
  },
  {
    id: 'skin',
    name: 'Скины',
    description: 'Скины и предметы из игр',
    icon: '🎨'
  },
  {
    id: 'key',
    name: 'Ключи активации',
    description: 'Ключи для активации игр и дополнений',
    icon: '🔑'
  },
  {
    id: 'service',
    name: 'Услуги',
    description: 'Различные игровые услуги',
    icon: '🛠️'
  },
];

// Типы предложений для выбора
export const OFFER_TYPES = [
  {
    id: 'sale',
    name: 'Продажа',
    description: 'Продажа товара по указанной цене',
    icon: '💵'
  },
  {
    id: 'rent',
    name: 'Аренда',
    description: 'Временное использование за плату',
    icon: '⏱️'
  },
  {
    id: 'exchange',
    name: 'Обмен',
    description: 'Готов обменять на другие товары',
    icon: '🔄'
  },
  {
    id: 'discount',
    name: 'Со скидкой',
    description: 'Продажа со скидкой',
    icon: '🏷️'
  },
];

// Мок пользовательских товаров
const MOCK_USER_PRODUCTS: UserProduct[] = [
  {
    id: '1',
    userId: '1',
    title: 'Аккаунт CS2 с инвентарем',
    description: 'Аккаунт CS2 с Prime статусом и коллекцией скинов. Более 1000 часов игрового времени.',
    price: 5000,
    category: 'account',
    offerType: 'sale',
    images: [
      'https://cdn.akamai.steamstatic.com/steam/apps/730/ss_d196d945c6170e9cadaf67a6dea675bd5fa7a046.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/730/ss_2b9e362287b509bb3864fa7bad654fe1fda0f7ed.jpg',
    ],
    featuredImage: 'https://cdn.akamai.steamstatic.com/steam/apps/730/ss_d196d945c6170e9cadaf67a6dea675bd5fa7a046.jpg',
    status: 'active',
    created: '2023-09-15T10:30:00Z',
    updated: '2023-09-15T10:30:00Z',
    level: 42,
    games: 25,
    hours: 1200,
    prime: true,
    csgo: true,
  },
  {
    id: '2',
    userId: '1',
    title: 'Нож Керамбит | Убийство',
    description: 'Редкий нож из CS2. Минимальный износ, смотрится отлично.',
    price: 15000,
    category: 'skin',
    offerType: 'sale',
    images: [
      'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20k_jkI7fUhFRB4MRij7v--YXygECLpxIuNDztJYKdcVVvMF7U_VG5wOnt0ZfqucifmyYw7nUn-z-DyIoz9NOQ',
    ],
    featuredImage: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20k_jkI7fUhFRB4MRij7v--YXygECLpxIuNDztJYKdcVVvMF7U_VG5wOnt0ZfqucifmyYw7nUn-z-DyIoz9NOQ',
    status: 'active',
    created: '2023-10-20T14:22:00Z',
    updated: '2023-10-20T14:22:00Z',
    game: 'CS2',
    rarity: 'Тайное',
    wear: 'Немного поношенное',
  },
  {
    id: '3',
    userId: '1',
    title: 'Ключ Cyberpunk 2077',
    description: 'Лицензионный ключ для активации игры Cyberpunk 2077 в Steam.',
    price: 2499,
    discountPrice: 1999,
    category: 'key',
    offerType: 'discount',
    images: [
      'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
    ],
    featuredImage: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
    status: 'active',
    created: '2023-11-05T09:45:00Z',
    updated: '2023-11-05T09:45:00Z',
    platform: 'Steam',
    region: 'Глобальный',
  },
  {
    id: '4',
    userId: '1',
    title: 'Аккаунт с Red Dead Redemption 2',
    description: 'Аккаунт с игрой Red Dead Redemption 2 и дополнениями. Можно арендовать для прохождения.',
    price: 4500,
    category: 'account',
    offerType: 'rent',
    images: [
      'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg',
    ],
    featuredImage: 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg',
    status: 'active',
    created: '2023-11-10T16:30:00Z',
    updated: '2023-11-10T16:30:00Z',
    level: 12,
    games: 5,
    hours: 250,
    rentDuration: 30,
    rentPrice: 150, // 150 рублей в день
  }
];

// Функция для сброса всех товаров к активному статусу
export const resetAllProductsStatus = (): void => {
  MOCK_USER_PRODUCTS.forEach((product, index) => {
    MOCK_USER_PRODUCTS[index] = {
      ...product,
      status: 'active',
      updated: new Date().toISOString()
    };
  });
};

// Очистка устаревших товаров на модерации
// Эта функция теперь очищает только тестовые/демо товары или товары старше 24 часов
export const clearPendingProducts = (): void => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  const oneDayAgoIso = oneDayAgo.toISOString();

  // Создаем массив фиксированных демо-ID, которые можно безопасно удалить
  const demoProductIds = ['5', '6', '7', '8']; // ID тестовых товаров

  for (let i = MOCK_USER_PRODUCTS.length - 1; i >= 0; i--) {
    const product = MOCK_USER_PRODUCTS[i];
    if (product.status === 'pending') {
      // Очищаем только если это демо-товар или он старше 24 часов
      if (demoProductIds.includes(product.id) || product.created < oneDayAgoIso) {
        MOCK_USER_PRODUCTS.splice(i, 1);
      }
    }
  }
};

// Тестовые уведомления пользователя
const MOCK_USER_NOTIFICATIONS: UserNotification[] = [
  {
    id: '1',
    userId: '1',
    message: 'Ваш товар "Аккаунт CS2 с инвентарем" был одобрен и опубликован',
    type: 'success',
    isRead: false,
    created: '2023-11-10T10:30:00Z',
    productId: '1',
    link: '/accounts/1'
  },
  {
    id: '2',
    userId: '1',
    message: 'Ваш платеж на сумму 1500 ₽ был успешно обработан',
    type: 'info',
    isRead: true,
    created: '2023-11-08T15:45:00Z',
  },
];

// Получить все товары пользователя
export const getUserProducts = (userId?: string): UserProduct[] => {
  if (userId) {
    return MOCK_USER_PRODUCTS.filter(product => product.userId === userId);
  }
  return MOCK_USER_PRODUCTS;
};

// Получить товар по ID
export const getUserProductById = (productId: string): UserProduct | undefined => {
  return MOCK_USER_PRODUCTS.find(product => product.id === productId);
};

// Создать новый товар (в реальном проекте здесь был бы запрос к API)
export const createUserProduct = (product: Omit<UserProduct, 'id' | 'created' | 'updated' | 'status'>): UserProduct => {
  const newProduct: UserProduct = {
    ...product,
    id: `prod-${Date.now()}-${Math.floor(Math.random() * 10000)}`, // Уникальный ID с временной меткой
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    status: 'pending', // Новые товары ждут модерации
  };

  // В реальном проекте здесь был бы API-запрос на сохранение
  // Добавляем в мок-данные для демонстрации
  MOCK_USER_PRODUCTS.push(newProduct);

  console.log('New product created with ID:', newProduct.id, 'Status:', newProduct.status);
  console.log('Total products now:', MOCK_USER_PRODUCTS.length);
  console.log('Pending products:', MOCK_USER_PRODUCTS.filter(p => p.status === 'pending').length);

  return newProduct;
};

// Обновить товар
export const updateUserProduct = (productId: string, updates: Partial<UserProduct>): UserProduct | undefined => {
  const productIndex = MOCK_USER_PRODUCTS.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return undefined;
  }

  const updatedProduct = {
    ...MOCK_USER_PRODUCTS[productIndex],
    ...updates,
    updated: new Date().toISOString(),
  };

  // В реальном проекте здесь был бы API-запрос на обновление
  MOCK_USER_PRODUCTS[productIndex] = updatedProduct;

  return updatedProduct;
};

// Удалить товар
export const deleteUserProduct = (productId: string): boolean => {
  const productIndex = MOCK_USER_PRODUCTS.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return false;
  }

  // В реальном проекте здесь был бы API-запрос на удаление
  MOCK_USER_PRODUCTS.splice(productIndex, 1);

  return true;
};

// Получить статистику товаров пользователя
export const getUserProductsStats = (userId: string) => {
  const userProducts = getUserProducts(userId);

  return {
    total: userProducts.length,
    active: userProducts.filter(p => p.status === 'active').length,
    pending: userProducts.filter(p => p.status === 'pending').length,
    sold: userProducts.filter(p => p.status === 'sold').length,
    rejected: userProducts.filter(p => p.status === 'rejected').length,
  };
};

// Получить товары по категории
export const getProductsByCategory = (category: ProductCategory): UserProduct[] => {
  // Фильтруем только активные товары выбранной категории
  return MOCK_USER_PRODUCTS.filter(
    product => product.category === category && product.status === 'active'
  );
};

// Получить уведомления пользователя
export const getUserNotifications = (userId: string): UserNotification[] => {
  return MOCK_USER_NOTIFICATIONS.filter(notification => notification.userId === userId);
};

// Получить непрочитанные уведомления пользователя
export const getUnreadNotificationsCount = (userId: string): number => {
  return MOCK_USER_NOTIFICATIONS.filter(
    notification => notification.userId === userId && !notification.isRead
  ).length;
};

// Отметить уведомление как прочитанное
export const markNotificationAsRead = (notificationId: string): boolean => {
  const notificationIndex = MOCK_USER_NOTIFICATIONS.findIndex(
    notification => notification.id === notificationId
  );

  if (notificationIndex === -1) {
    return false;
  }

  MOCK_USER_NOTIFICATIONS[notificationIndex] = {
    ...MOCK_USER_NOTIFICATIONS[notificationIndex],
    isRead: true
  };

  return true;
};

// Отметить все уведомления пользователя как прочитанные
export const markAllNotificationsAsRead = (userId: string): boolean => {
  let updated = false;

  MOCK_USER_NOTIFICATIONS.forEach((notification, index) => {
    if (notification.userId === userId && !notification.isRead) {
      MOCK_USER_NOTIFICATIONS[index] = {
        ...notification,
        isRead: true
      };
      updated = true;
    }
  });

  return updated;
};

// Добавить новое уведомление
export const addNotification = (notification: Omit<UserNotification, 'id' | 'created' | 'isRead'>): UserNotification => {
  const newNotification: UserNotification = {
    ...notification,
    id: `${Date.now()}`,
    created: new Date().toISOString(),
    isRead: false
  };

  MOCK_USER_NOTIFICATIONS.push(newNotification);
  return newNotification;
};

// Создать уведомление о модерации товара
export const createProductModerationNotification = (
  productId: string,
  action: 'approve' | 'reject',
  comment?: string
): UserNotification | null => {
  const product = getUserProductById(productId);

  if (!product) {
    return null;
  }

  // Формируем сообщение в зависимости от действия модератора
  let message = '';
  let type: NotificationType = 'info';
  let link: string | undefined;

  if (action === 'approve') {
    message = `Ваш товар "${product.title}" был одобрен и опубликован.`;
    type = 'success';

    // Добавляем ссылку на опубликованный товар в зависимости от категории
    switch (product.category) {
      case 'account':
        link = `/accounts/${product.id}`;
        break;
      case 'key':
        link = `/keys/${product.id}`;
        break;
      case 'game':
        link = `/games/${product.id}`;
        break;
      default:
        link = `/products/${product.id}`;
    }
  } else {
    message = `Ваш товар "${product.title}" был отклонен.`;
    type = 'warning';

    // Если есть комментарий от модератора, добавляем его
    if (comment) {
      message += ` Причина: ${comment}`;
    }

    // Ссылка на редактирование товара
    link = `/profile/products/edit/${product.id}`;
  }

  // Создаем и добавляем уведомление
  return addNotification({
    userId: product.userId,
    message,
    type,
    link,
    productId
  });
};
