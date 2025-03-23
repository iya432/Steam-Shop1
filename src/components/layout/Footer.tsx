import { Link } from 'react-router-dom';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { FaTelegram, FaDiscord, FaVk } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">О нас</h3>
            <p className="text-gray-300 text-sm">
              Мы предоставляем качественные аккаунты Steam и услуги пополнения баланса по выгодным
              ценам. Гарантируем безопасность сделок и быстрое получение товара.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-bold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/accounts" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Аккаунты Steam
                </Link>
              </li>
              <li>
                <Link to="/balance" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Пополнение баланса
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Игры и ключи
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Поддержка</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Поддержка клиентов
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Условия использования
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                <a
                  href="mailto:support@steamshop.ru"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  support@steamshop.ru
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <PhoneIcon className="w-5 h-5 text-blue-500" />
                <span className="text-gray-300">24/7 Поддержка</span>
              </li>
              <li>
                <div className="flex space-x-4 mt-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    aria-label="Telegram"
                  >
                    <FaTelegram className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-indigo-500 transition-colors"
                    aria-label="Discord"
                  >
                    <FaDiscord className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label="VK"
                  >
                    <FaVk className="w-6 h-6" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center space-x-4">
            <img
              src="https://same-assets.com/vi-assets/static/payment/visa.svg"
              alt="Visa"
              className="h-8 bg-white rounded px-2"
            />
            <img
              src="https://same-assets.com/vi-assets/static/payment/mastercard.svg"
              alt="MasterCard"
              className="h-8 bg-white rounded px-2"
            />
            <img
              src="https://same-assets.com/vi-assets/static/payment/qiwi.svg"
              alt="QIWI"
              className="h-8 bg-white rounded px-2"
            />
            <img
              src="https://same-assets.com/vi-assets/static/payment/webmoney.svg"
              alt="WebMoney"
              className="h-8 bg-white rounded px-2"
            />
            <img
              src="https://same-assets.com/vi-assets/static/payment/bitcoin.svg"
              alt="Bitcoin"
              className="h-8 bg-white rounded px-2"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>© {currentYear} Steam Shop. Все права защищены.</p>
          <p className="mt-2">
            Steam и логотип Steam являются товарными знаками Valve Corporation. Мы не связаны с
            Valve Corp.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
