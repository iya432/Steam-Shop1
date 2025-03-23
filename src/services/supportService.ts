import { UserRole } from './adminService';

// Типы для системы поддержки
export type ChatStatus = 'open' | 'pending' | 'closed' | 'resolved';
export type MessageType = 'text' | 'image' | 'system';

export interface SupportMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  content: string;
  type: MessageType;
  timestamp: string;
  isRead: boolean;
}

export interface SupportChat {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  status: ChatStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  assignedTo?: string;
  assignedToName?: string;
  messages: SupportMessage[];
  unreadCount: number;
  productId?: string;
  orderId?: string;
}

export interface SupportStats {
  totalChats: number;
  openChats: number;
  resolvedToday: number;
  averageResponseTime: number; // в минутах
  chatsByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

// Mock данные чатов поддержки
const MOCK_CHATS: SupportChat[] = [
  {
    id: 'chat-1',
    userId: 'user1',
    userName: 'RegularUser1',
    subject: 'Проблема с активацией аккаунта',
    status: 'open',
    priority: 'medium',
    createdAt: '2023-12-10T14:32:10Z',
    updatedAt: '2023-12-10T14:45:22Z',
    assignedTo: 'support1',
    assignedToName: 'SupportAgent',
    messages: [
      {
        id: 'msg-1-1',
        chatId: 'chat-1',
        senderId: 'user1',
        senderRole: 'user',
        senderName: 'RegularUser1',
        content: 'Здравствуйте, я приобрел аккаунт Steam, но не могу войти. Пишет неверный пароль.',
        type: 'text',
        timestamp: '2023-12-10T14:32:10Z',
        isRead: true,
      },
      {
        id: 'msg-1-2',
        chatId: 'chat-1',
        senderId: 'system',
        senderRole: 'system',
        senderName: 'System',
        content: 'Чат назначен агенту поддержки SupportAgent',
        type: 'system',
        timestamp: '2023-12-10T14:32:15Z',
        isRead: true,
      },
      {
        id: 'msg-1-3',
        chatId: 'chat-1',
        senderId: 'support1',
        senderRole: 'support',
        senderName: 'SupportAgent',
        content: 'Здравствуйте! Пожалуйста, уточните номер заказа и email, указанный при покупке.',
        type: 'text',
        timestamp: '2023-12-10T14:45:22Z',
        isRead: false,
      },
    ],
    unreadCount: 1,
    orderId: 'order-123',
  },
  {
    id: 'chat-2',
    userId: 'user2',
    userName: 'RegularUser2',
    subject: 'Вопрос о пополнении баланса',
    status: 'pending',
    priority: 'low',
    createdAt: '2023-12-09T11:15:33Z',
    updatedAt: '2023-12-09T11:15:33Z',
    messages: [
      {
        id: 'msg-2-1',
        chatId: 'chat-2',
        senderId: 'user2',
        senderRole: 'user',
        senderName: 'RegularUser2',
        content: 'Добрый день! Подскажите, как долго обычно происходит пополнение баланса Steam после оплаты?',
        type: 'text',
        timestamp: '2023-12-09T11:15:33Z',
        isRead: true,
      },
    ],
    unreadCount: 0,
  },
  {
    id: 'chat-3',
    userId: 'user3',
    userName: 'InactiveUser',
    subject: 'Срочно! Мой аккаунт украли',
    status: 'closed',
    priority: 'urgent',
    createdAt: '2023-12-01T09:22:45Z',
    updatedAt: '2023-12-01T10:34:11Z',
    closedAt: '2023-12-01T10:34:11Z',
    assignedTo: 'support1',
    assignedToName: 'SupportAgent',
    messages: [
      {
        id: 'msg-3-1',
        chatId: 'chat-3',
        senderId: 'user3',
        senderRole: 'user',
        senderName: 'InactiveUser',
        content: 'СРОЧНО!!! Мой аккаунт украли! Я купил его вчера, и сегодня не могу войти!',
        type: 'text',
        timestamp: '2023-12-01T09:22:45Z',
        isRead: true,
      },
      {
        id: 'msg-3-2',
        chatId: 'chat-3',
        senderId: 'system',
        senderRole: 'system',
        senderName: 'System',
        content: 'Чат назначен агенту поддержки SupportAgent',
        type: 'system',
        timestamp: '2023-12-01T09:23:01Z',
        isRead: true,
      },
      {
        id: 'msg-3-3',
        chatId: 'chat-3',
        senderId: 'support1',
        senderRole: 'support',
        senderName: 'SupportAgent',
        content: 'Здравствуйте! Пожалуйста, не паникуйте. Укажите номер заказа и email, который вы использовали при покупке. Мы проверим что случилось.',
        type: 'text',
        timestamp: '2023-12-01T09:25:30Z',
        isRead: true,
      },
      {
        id: 'msg-3-4',
        chatId: 'chat-3',
        senderId: 'user3',
        senderRole: 'user',
        senderName: 'InactiveUser',
        content: 'Заказ #A12345, email myemail@example.com',
        type: 'text',
        timestamp: '2023-12-01T09:30:12Z',
        isRead: true,
      },
      {
        id: 'msg-3-5',
        chatId: 'chat-3',
        senderId: 'support1',
        senderRole: 'support',
        senderName: 'SupportAgent',
        content: 'Спасибо за информацию. Я проверил ваш заказ. Похоже, что предыдущий владелец изменил пароль. Мы заменим ваш аккаунт на новый в течение 24 часов или вернем деньги, по вашему выбору.',
        type: 'text',
        timestamp: '2023-12-01T10:22:45Z',
        isRead: true,
      },
      {
        id: 'msg-3-6',
        chatId: 'chat-3',
        senderId: 'user3',
        senderRole: 'user',
        senderName: 'InactiveUser',
        content: 'Лучше верните деньги',
        type: 'text',
        timestamp: '2023-12-01T10:30:33Z',
        isRead: true,
      },
      {
        id: 'msg-3-7',
        chatId: 'chat-3',
        senderId: 'support1',
        senderRole: 'support',
        senderName: 'SupportAgent',
        content: 'Хорошо, мы инициировали возврат средств. Деньги вернутся на ваш счет в течение 3-5 рабочих дней. Спасибо за обращение!',
        type: 'text',
        timestamp: '2023-12-01T10:34:11Z',
        isRead: true,
      },
      {
        id: 'msg-3-8',
        chatId: 'chat-3',
        senderId: 'system',
        senderRole: 'system',
        senderName: 'System',
        content: 'Чат закрыт',
        type: 'system',
        timestamp: '2023-12-01T10:34:11Z',
        isRead: true,
      },
    ],
    unreadCount: 0,
  },
];

// Получение всех чатов поддержки
export const getAllSupportChats = (): SupportChat[] => {
  return MOCK_CHATS;
};

// Получение чата по ID
export const getChatById = (chatId: string): SupportChat | null => {
  return MOCK_CHATS.find(chat => chat.id === chatId) || null;
};

// Получение чатов пользователя
export const getUserChats = (userId: string): SupportChat[] => {
  return MOCK_CHATS.filter(chat => chat.userId === userId);
};

// Создание нового чата
export const createSupportChat = (
  userId: string,
  userName: string,
  subject: string,
  initialMessage: string,
  priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
  productId?: string,
  orderId?: string
): SupportChat => {
  const timestamp = new Date().toISOString();
  const chatId = `chat-${MOCK_CHATS.length + 1}`;

  const newChat: SupportChat = {
    id: chatId,
    userId,
    userName,
    subject,
    status: 'open',
    priority,
    createdAt: timestamp,
    updatedAt: timestamp,
    messages: [
      {
        id: `msg-${chatId}-1`,
        chatId,
        senderId: userId,
        senderRole: 'user',
        senderName: userName,
        content: initialMessage,
        type: 'text',
        timestamp,
        isRead: false,
      },
    ],
    unreadCount: 1,
    productId,
    orderId,
  };

  MOCK_CHATS.push(newChat);
  return newChat;
};

// Добавление сообщения в чат
export const addMessageToChat = (
  chatId: string,
  senderId: string,
  senderRole: UserRole,
  senderName: string,
  content: string,
  type: MessageType = 'text'
): SupportMessage | null => {
  const chatIndex = MOCK_CHATS.findIndex(chat => chat.id === chatId);
  if (chatIndex === -1) return null;

  const timestamp = new Date().toISOString();
  const messageId = `msg-${chatId}-${MOCK_CHATS[chatIndex].messages.length + 1}`;

  const newMessage: SupportMessage = {
    id: messageId,
    chatId,
    senderId,
    senderRole,
    senderName,
    content,
    type,
    timestamp,
    isRead: false,
  };

  // Добавление сообщения
  MOCK_CHATS[chatIndex].messages.push(newMessage);

  // Обновление статуса чата
  MOCK_CHATS[chatIndex].updatedAt = timestamp;
  if (MOCK_CHATS[chatIndex].status === 'closed') {
    MOCK_CHATS[chatIndex].status = 'open';
  }

  // Обновление счетчика непрочитанных сообщений
  if (senderRole !== 'user') {
    MOCK_CHATS[chatIndex].unreadCount += 1;
  }

  return newMessage;
};

// Назначение чата агенту поддержки
export const assignChatToAgent = (
  chatId: string,
  agentId: string,
  agentName: string
): SupportChat | null => {
  const chatIndex = MOCK_CHATS.findIndex(chat => chat.id === chatId);
  if (chatIndex === -1) return null;

  MOCK_CHATS[chatIndex].assignedTo = agentId;
  MOCK_CHATS[chatIndex].assignedToName = agentName;
  MOCK_CHATS[chatIndex].status = 'open';

  // Добавление системного сообщения
  addMessageToChat(
    chatId,
    'system',
    'system',
    'System',
    `Чат назначен агенту поддержки ${agentName}`,
    'system'
  );

  return MOCK_CHATS[chatIndex];
};

// Закрытие чата
export const closeChat = (
  chatId: string,
  resolution?: string
): SupportChat | null => {
  const chatIndex = MOCK_CHATS.findIndex(chat => chat.id === chatId);
  if (chatIndex === -1) return null;

  const timestamp = new Date().toISOString();

  MOCK_CHATS[chatIndex].status = 'closed';
  MOCK_CHATS[chatIndex].closedAt = timestamp;
  MOCK_CHATS[chatIndex].updatedAt = timestamp;

  // Добавление системного сообщения
  addMessageToChat(
    chatId,
    'system',
    'system',
    'System',
    resolution ? `Чат закрыт: ${resolution}` : 'Чат закрыт',
    'system'
  );

  return MOCK_CHATS[chatIndex];
};

// Отметка сообщений как прочитанных
export const markMessagesAsRead = (
  chatId: string,
  userId: string
): number => {
  const chatIndex = MOCK_CHATS.findIndex(chat => chat.id === chatId);
  if (chatIndex === -1) return 0;

  let readCount = 0;

  MOCK_CHATS[chatIndex].messages.forEach(message => {
    if (!message.isRead && message.senderId !== userId) {
      message.isRead = true;
      readCount++;
    }
  });

  if (readCount > 0) {
    MOCK_CHATS[chatIndex].unreadCount = 0;
  }

  return readCount;
};

// Получение статистики чатов
export const getSupportStats = (): SupportStats => {
  const today = new Date().toISOString().split('T')[0];

  const totalChats = MOCK_CHATS.length;
  const openChats = MOCK_CHATS.filter(
    chat => chat.status === 'open' || chat.status === 'pending'
  ).length;

  const resolvedToday = MOCK_CHATS.filter(
    chat => chat.status === 'closed' && chat.closedAt?.startsWith(today)
  ).length;

  // Расчет среднего времени ответа (упрощенно для демо)
  const responseTimes: number[] = [];
  MOCK_CHATS.forEach(chat => {
    const userMessages = chat.messages.filter(msg => msg.senderRole === 'user');
    const supportMessages = chat.messages.filter(msg => msg.senderRole === 'support');

    if (userMessages.length > 0 && supportMessages.length > 0) {
      const firstUserMsg = userMessages[0];
      const firstSupportMsg = supportMessages[0];

      const userTime = new Date(firstUserMsg.timestamp).getTime();
      const supportTime = new Date(firstSupportMsg.timestamp).getTime();

      if (supportTime > userTime) {
        const diffMinutes = (supportTime - userTime) / (1000 * 60);
        responseTimes.push(diffMinutes);
      }
    }
  });

  const averageResponseTime = responseTimes.length
    ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length)
    : 0;

  // Подсчет чатов по приоритету
  const chatsByPriority = {
    low: MOCK_CHATS.filter(chat => chat.priority === 'low').length,
    medium: MOCK_CHATS.filter(chat => chat.priority === 'medium').length,
    high: MOCK_CHATS.filter(chat => chat.priority === 'high').length,
    urgent: MOCK_CHATS.filter(chat => chat.priority === 'urgent').length,
  };

  return {
    totalChats,
    openChats,
    resolvedToday,
    averageResponseTime,
    chatsByPriority,
  };
};
