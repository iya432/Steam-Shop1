// Types
export interface Account {
  id: number;
  title: string;
  price: number;
  image: string;
  level: number;
  games: number;
  csgo: boolean;
  dota2: boolean;
  prime: boolean;
  hours: number;
  discount?: number;
  description?: string;
  screenshots?: string[];
}

// Mock data for accounts
const MOCK_ACCOUNTS: Account[] = [
  {
    id: 1,
    title: 'Аккаунт CS2 + Prime Status',
    price: 899,
    image: 'https://www.gamespot.com/a/uploads/screen_kubrick/1574/15746725/4176106-cs2_thumbnail.jpg',
    level: 15,
    games: 12,
    csgo: true,
    dota2: false,
    prime: true,
    hours: 350,
    discount: 15,
    description:
      'Аккаунт со статусом Prime Status в CS2. На аккаунте 12 игр, включая CS2, GTA V и Rust. Уровень профиля 15. Более 350 часов игрового времени. Аккаунт полностью готов к игре сразу после покупки.',
    screenshots: [
      'https://cdn.akamai.steamstatic.com/steam/apps/730/ss_d196d945c6170e9cadaf67a6dea675bd5fa7a046.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/730/ss_2b9e362287b509bb3864fa7bad654fe1fda0f7ed.jpg',
    ]
  },
  {
    id: 2,
    title: 'Аккаунт Dota 2 + 2000 MMR',
    price: 599,
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/570/capsule_616x353.jpg',
    level: 8,
    games: 4,
    csgo: false,
    dota2: true,
    prime: false,
    hours: 780,
    description:
      'Аккаунт Dota 2 с рейтингом 2000 MMR. На аккаунте 4 игры. Уровень профиля 8. Более 780 часов игрового времени в Dota 2. Аккаунт имеет несколько редких косметических предметов.',
    screenshots: [
      'https://cdn.akamai.steamstatic.com/steam/apps/570/ss_ad8eee787704745ccdecdfde3a5cd2733704898d.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/570/ss_ce9182285019708f3c54163d12f14b41877dfb3d.jpg',
    ]
  },
  {
    id: 3,
    title: 'Аккаунт Steam с 50+ играми',
    price: 1299,
    image: 'https://cdn.akamai.steamstatic.com/store/home/store_home_share.jpg',
    level: 22,
    games: 54,
    csgo: true,
    dota2: true,
    prime: false,
    hours: 1200,
    discount: 10,
    description:
      'Аккаунт Steam с коллекцией из более чем 50 игр, включая CS2, Dota 2, GTA V, Rust, PUBG и многие другие. Уровень профиля 22. Более 1200 часов игрового времени на различных играх. Отличный выбор для геймера, который хочет сразу получить большую библиотеку игр.',
    screenshots: [
      'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_bab596ea9a6924055cd6b03a5e8e1aa765d28964.jpg',
      'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/ss_4bc3d454e5c819722f2553fd7edca66d77518e1e.jpg',
    ]
  },
  {
    id: 4,
    title: 'Аккаунт CS2 + Скины',
    price: 1499,
    image: 'https://cdn.sanity.io/images/ib5rkgaf/production/a24a19f21b3c32b7a4bc2aec1837bf75a6a9c3ee-1200x500.jpg',
    level: 18,
    games: 6,
    csgo: true,
    dota2: false,
    prime: true,
    hours: 540,
    description:
      'Аккаунт CS2 с коллекцией ценных скинов общей стоимостью более 2000 рублей. На аккаунте 6 игр. Уровень профиля 18. Более 540 часов игрового времени. Имеет статус Prime Status. В инвентаре есть нож и несколько редких скинов для оружия.',
    screenshots: [
      'https://cdn.akamai.steamstatic.com/steam/apps/730/ss_34090867f1a48919b0c596f60b9d0b4d3d637d0d.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/730/ss_118cb022b9a43f70d2e5a2df7427f29088b6b191.jpg',
    ]
  },
  {
    id: 5,
    title: 'Аккаунт Steam с GTA V',
    price: 799,
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
    level: 10,
    games: 8,
    csgo: false,
    dota2: false,
    prime: false,
    hours: 320,
    description:
      'Аккаунт с Grand Theft Auto V и ещё 7 играми. Уровень профиля 10. Более 320 часов игрового времени. На аккаунте GTA Online имеется продвинутый персонаж с хорошей недвижимостью и транспортом.',
    screenshots: [
      'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_bab596ea9a6924055cd6b03a5e8e1aa765d28964.jpg',
      'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_5b88f071939e32d867df96da6f028dd3ae957593.jpg',
    ]
  },
  {
    id: 6,
    title: 'Аккаунт Высокого Уровня (50+)',
    price: 2499,
    image: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/876740/c360694c245322de6947e79271e31e7cda87b927.png',
    level: 52,
    games: 95,
    csgo: true,
    dota2: true,
    prime: true,
    hours: 3600,
    discount: 20,
    description:
      'Премиум аккаунт Steam с уровнем профиля 52. Содержит 95 игр, включая множество AAA-проектов. Статус Prime в CS2. Более 3600 часов игрового времени. Коллекция редких значков и предметов профиля. Один из самых богатых аккаунтов в нашем магазине.',
    screenshots: [
      'https://cdn.akamai.steamstatic.com/steam/apps/779340/ss_6634871fa15c0f09a8f056e3fc6bf56c60193c24.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/1174180/ss_66b553f4c209476d3e4ce25fa4714002cc914c4f.jpg',
    ]
  },
];

// Get all accounts
export const getAllAccounts = (): Account[] => {
  return MOCK_ACCOUNTS;
};

// Get account by ID
export const getAccountById = (id: number): Account | undefined => {
  return MOCK_ACCOUNTS.find(account => account.id === id);
};

// Purchase history type
export interface PurchaseHistoryItem {
  id: string;
  date: string;
  items: {
    id: number;
    title: string;
    price: number;
    type: 'account' | 'balance' | 'game';
    quantity: number;
  }[];
  totalAmount: number;
  status: 'completed' | 'processing' | 'failed';
}

// Mock purchase history data
export const MOCK_PURCHASE_HISTORY: PurchaseHistoryItem[] = [
  {
    id: 'order-1',
    date: '2023-12-15T10:30:00Z',
    items: [
      {
        id: 1,
        title: 'Аккаунт CS2 + Prime Status',
        price: 899,
        type: 'account',
        quantity: 1,
      },
    ],
    totalAmount: 764, // With 15% discount
    status: 'completed',
  },
  {
    id: 'order-2',
    date: '2023-11-28T14:45:00Z',
    items: [
      {
        id: 3,
        title: 'Аккаунт Steam с 50+ играми',
        price: 1299,
        type: 'account',
        quantity: 1,
      },
      {
        id: 0,
        title: 'Пополнение баланса Steam',
        price: 1000,
        type: 'balance',
        quantity: 1,
      },
    ],
    totalAmount: 2169, // With 10% discount on account
    status: 'completed',
  },
  {
    id: 'order-3',
    date: '2024-01-05T09:15:00Z',
    items: [
      {
        id: 5,
        title: 'Аккаунт Steam с GTA V',
        price: 799,
        type: 'account',
        quantity: 1,
      },
    ],
    totalAmount: 799,
    status: 'processing',
  },
];

// Get purchase history for user
export const getUserPurchaseHistory = (): PurchaseHistoryItem[] => {
  return MOCK_PURCHASE_HISTORY;
};
