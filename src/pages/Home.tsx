import { Link } from 'react-router-dom';
import { ShieldCheckIcon, CurrencyDollarIcon, ClockIcon, TrophyIcon } from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 py-20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.playstation.com/etc.clientlibs/global_pdc/clientlibs/clientlib-base/resources/bg-motif.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Купить аккаунты Steam по лучшим ценам
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              Пополнение баланса Steam со скидкой, аккаунты с играми и многое другое на нашей
              площадке. Гарантия качества и быстрая доставка.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/accounts"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors text-center"
              >
                Купить аккаунт
              </Link>
              <Link
                to="/balance"
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-medium transition-colors text-center"
              >
                Пополнить баланс
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Наши продукты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Steam Accounts */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="h-48 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-center">
                <img
                  src="https://same-assets.com/vi-assets/static/games/steam_logo.png"
                  alt="Steam Accounts"
                  className="h-24 object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Аккаунты Steam</h3>
                <p className="text-gray-600 mb-4">
                  Большой выбор аккаунтов Steam с различными играми и уровнями профиля. Есть аккаунты
                  с CS2, Dota 2, GTA V и другими популярными играми.
                </p>
                <Link
                  to="/accounts"
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Просмотреть
                </Link>
              </div>
            </div>

            {/* Balance Refill */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="h-48 bg-gradient-to-r from-green-700 to-green-500 flex items-center justify-center">
                <img
                  src="https://same-assets.com/vi-assets/static/payment/wallet.svg"
                  alt="Steam Balance"
                  className="h-24 object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Пополнение баланса</h3>
                <p className="text-gray-600 mb-4">
                  Пополнение баланса Steam со скидкой до 30%. Быстрое зачисление средств, различные
                  способы оплаты и безопасные транзакции.
                </p>
                <Link
                  to="/balance"
                  className="block text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Пополнить
                </Link>
              </div>
            </div>

            {/* Games & Keys */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="h-48 bg-gradient-to-r from-purple-800 to-purple-600 flex items-center justify-center">
                <img
                  src="https://same-assets.com/vi-assets/static/games/game_key.svg"
                  alt="Game Keys"
                  className="h-24 object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Игры и ключи</h3>
                <p className="text-gray-600 mb-4">
                  Лицензионные ключи для активации игр в Steam и других платформах. Выгодные цены и
                  мгновенная доставка на Email.
                </p>
                <Link
                  to="/games"
                  className="block text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Выбрать игру
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Безопасность</h3>
              <p className="text-gray-600">
                Гарантируем безопасные транзакции и конфиденциальность ваших данных
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Выгодные цены</h3>
              <p className="text-gray-600">
                Предлагаем лучшие цены на рынке и постоянные скидки для наших клиентов
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <ClockIcon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Быстрая доставка</h3>
              <p className="text-gray-600">
                Мгновенная доставка товаров после оплаты 24/7 без выходных и праздников
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <TrophyIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Большой выбор</h3>
              <p className="text-gray-600">
                Тысячи аккаунтов, игр и услуг для удовлетворения любых потребностей
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Отзывы наших клиентов</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Купил аккаунт с CS2, всё отлично работает. Быстрая доставка и хорошая поддержка.
                Рекомендую этот сайт всем друзьям!"
              </p>
              <p className="font-medium">Александр К.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Пополнял баланс Steam со скидкой 25%. Деньги пришли моментально, никаких проблем.
                Буду пользоваться услугами этого сервиса и дальше."
              </p>
              <p className="font-medium">Максим Д.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Отличный сервис! Купила ключ для игры, активация прошла без проблем. Цена ниже, чем в
                официальном магазине. Спасибо за оперативность!"
              </p>
              <p className="font-medium">Елена С.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Готовы начать?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Присоединяйтесь к тысячам довольных клиентов и наслаждайтесь лучшими предложениями на
            аккаунты Steam и пополнение баланса.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/accounts"
              className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Начать покупки
            </Link>
            <Link
              to="/support"
              className="bg-transparent hover:bg-blue-700 border border-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
