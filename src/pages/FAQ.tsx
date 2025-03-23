import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

// Тип данных для вопроса FAQ
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  // Состояние для отслеживания открытых FAQ
  const [openItems, setOpenItems] = useState<number[]>([]);
  // Состояние для текущей категории
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Список категорий
  const categories = [
    { id: 'all', name: 'Все вопросы' },
    { id: 'accounts', name: 'Аккаунты' },
    { id: 'balance', name: 'Пополнение баланса' },
    { id: 'payment', name: 'Оплата' },
    { id: 'security', name: 'Безопасность' },
  ];

  // Список вопросов и ответов
  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: 'Как купить аккаунт Steam?',
      answer: 'Чтобы купить аккаунт Steam, просто выберите нужный аккаунт из каталога, нажмите кнопку "Купить", выберите способ оплаты и завершите оплату. После оплаты вы получите данные от аккаунта на указанный email.',
      category: 'accounts',
    },
    {
      id: 2,
      question: 'Что делать, если аккаунт не работает?',
      answer: 'Если аккаунт не работает, обратитесь в службу поддержки через форму на сайте или напишите нам на email support@steamshop.ru. Мы предоставим замену или вернем деньги в течение 24 часов.',
      category: 'accounts',
    },
    {
      id: 3,
      question: 'Как долго осуществляется пополнение баланса?',
      answer: 'Пополнение баланса происходит автоматически сразу после оплаты. В редких случаях процесс может занять до 15 минут. Если средства не поступили в течение 30 минут, обратитесь в поддержку.',
      category: 'balance',
    },
    {
      id: 4,
      question: 'Какие способы оплаты вы принимаете?',
      answer: 'Мы принимаем различные способы оплаты: банковские карты (Visa, MasterCard), электронные кошельки (QIWI, WebMoney, ЮMoney), а также криптовалюты (Bitcoin, Ethereum).',
      category: 'payment',
    },
    {
      id: 5,
      question: 'Можно ли вернуть деньги за купленный аккаунт?',
      answer: 'Да, мы предоставляем гарантию на все аккаунты в течение 24 часов с момента покупки. Если возникли проблемы с аккаунтом (например, его забрал владелец или не подходит описание), мы вернем вам деньги или предложим замену.',
      category: 'accounts',
    },
    {
      id: 6,
      question: 'Как узнать свой логин Steam для пополнения баланса?',
      answer: 'Ваш логин Steam – это имя, которое вы используете для входа в клиент Steam (не ник профиля и не email). Если вы забыли логин, его можно восстановить через службу поддержки Steam или найти в настройках клиента Steam.',
      category: 'balance',
    },
    {
      id: 7,
      question: 'Безопасно ли покупать аккаунты на вашем сайте?',
      answer: 'Да, мы гарантируем безопасность всех транзакций. Мы работаем напрямую с продавцами, проверяем каждый аккаунт перед добавлением в каталог и обеспечиваем полную анонимность покупателей. Ваши личные данные и способы оплаты надежно защищены.',
      category: 'security',
    },
    {
      id: 8,
      question: 'Что будет, если владелец восстановит аккаунт?',
      answer: 'В случае восстановления аккаунта прежним владельцем в течение гарантийного срока (24 часа), мы предоставим вам замену или вернем деньги. Для минимизации таких случаев мы тщательно проверяем историю каждого аккаунта перед продажей.',
      category: 'accounts',
    },
    {
      id: 9,
      question: 'Как изменить пароль в купленном аккаунте?',
      answer: 'После получения данных аккаунта (логин и пароль) рекомендуем сразу изменить пароль. Для этого войдите в аккаунт, перейдите в настройки аккаунта Steam и выберите "Изменить пароль". Также рекомендуем изменить email и привязать свой номер телефона.',
      category: 'accounts',
    },
    {
      id: 10,
      question: 'Можно ли перевести деньги с одного аккаунта Steam на другой?',
      answer: 'Steam не предоставляет возможности напрямую переводить деньги между аккаунтами. Однако вы можете купить игру в качестве подарка на одном аккаунте и отправить ее на другой. Обратите внимание, что для этого аккаунты должны быть в друзьях не менее 3 дней.',
      category: 'balance',
    },
    {
      id: 11,
      question: 'Какие данные нужны для оплаты?',
      answer: 'Для оплаты вам потребуются стандартные данные банковской карты или электронного кошелька, а также email для получения информации о заказе. Мы не храним данные ваших карт, все платежи обрабатываются через защищенные платежные системы.',
      category: 'payment',
    },
    {
      id: 12,
      question: 'Почему у вас цены ниже, чем в официальном магазине Steam?',
      answer: 'Мы предлагаем более низкие цены за счет оптовых закупок ключей, работы с различными регионами и специальных партнерских программ. Все товары приобретаются легально, мы не используем украденные карты или другие нелегальные методы.',
      category: 'payment',
    },
  ];

  // Переключение состояния открытия/закрытия FAQ
  const toggleItem = (id: number) => {
    if (openItems.includes(id)) {
      setOpenItems(openItems.filter((itemId) => itemId !== id));
    } else {
      setOpenItems([...openItems, id]);
    }
  };

  // Фильтрация вопросов по категории
  const filteredItems = activeCategory === 'all'
    ? faqItems
    : faqItems.filter(item => item.category === activeCategory);

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Часто задаваемые вопросы</h1>
          <p className="text-gray-600">
            Ответы на самые популярные вопросы о нашем сервисе
          </p>
        </div>

        {/* Категории */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Список */}
        <div className="mb-8 space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                onClick={() => toggleItem(item.id)}
              >
                <span className="font-medium text-lg">{item.question}</span>
                {openItems.includes(item.id) ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openItems.includes(item.id) && (
                <div className="px-4 pb-4 text-gray-600">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Контакт для дополнительных вопросов */}
        <div className="bg-blue-50 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold mb-2">Не нашли ответ на свой вопрос?</h2>
          <p className="text-gray-600 mb-4">
            Свяжитесь с нашей службой поддержки, и мы ответим на все ваши вопросы.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="mailto:support@steamshop.ru"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Написать на Email
            </a>
            <a
              href="/support"
              className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Форма обратной связи
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
