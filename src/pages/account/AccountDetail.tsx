import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { getAccountById } from '../../services/accountsService';
import { useCart } from '../../context/CartContext';

const AccountDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Fetch account data
  useEffect(() => {
    if (!id) {
      setError('ID аккаунта не указан');
      setLoading(false);
      return;
    }

    try {
      const accountData = getAccountById(parseInt(id, 10));

      if (!accountData) {
        setError('Аккаунт не найден');
        setLoading(false);
        return;
      }

      setAccount(accountData);
      setActiveImage(accountData.image);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке данных аккаунта');
      setLoading(false);
    }
  }, [id]);

  // Calculate discounted price
  const getDiscountedPrice = (price: number, discount?: number): number => {
    if (!discount) return price;
    return Math.round(price * (1 - discount / 100));
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!account) return;

    addToCart({
      id: account.id,
      title: account.title,
      price: account.price,
      image: account.image,
      type: 'account',
      discount: account.discount,
    });

    setAddedToCart(true);

    // Reset the "Added to cart" status after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!account) return;

    addToCart({
      id: account.id,
      title: account.title,
      price: account.price,
      image: account.image,
      type: 'account',
      discount: account.discount,
    });

    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="bg-gray-100 py-8 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-lg bg-gray-300 h-64 w-full mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="bg-gray-100 py-8 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ошибка</h2>
            <p className="text-gray-600 mb-4">{error || 'Аккаунт не найден'}</p>
            <button
              onClick={() => navigate('/accounts')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Вернуться к списку аккаунтов
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/accounts')}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Назад к списку аккаунтов</span>
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Gallery Section */}
            <div className="md:w-1/2 p-6">
              {/* Main Image */}
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-80">
                <img
                  src={activeImage || account.image}
                  alt={account.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {account.screenshots && account.screenshots.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  <div
                    className={`rounded-lg overflow-hidden cursor-pointer border-2 ${
                      activeImage === account.image ? 'border-blue-500' : 'border-transparent'
                    }`}
                    onClick={() => setActiveImage(account.image)}
                  >
                    <img
                      src={account.image}
                      alt={account.title}
                      className="w-full h-20 object-cover"
                    />
                  </div>

                  {account.screenshots.map((screenshot: string, index: number) => (
                    <div
                      key={index}
                      className={`rounded-lg overflow-hidden cursor-pointer border-2 ${
                        activeImage === screenshot ? 'border-blue-500' : 'border-transparent'
                      }`}
                      onClick={() => setActiveImage(screenshot)}
                    >
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-6 bg-gray-50">
              <h1 className="text-2xl font-bold mb-2">{account.title}</h1>

              {/* Pricing */}
              <div className="flex items-end mb-6">
                <span className="text-3xl font-bold text-gray-900 mr-3">
                  {getDiscountedPrice(account.price, account.discount)} ₽
                </span>
                {account.discount && (
                  <span className="text-xl text-gray-500 line-through">
                    {account.price} ₽
                  </span>
                )}
                {account.discount && (
                  <span className="ml-3 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    -{account.discount}%
                  </span>
                )}
              </div>

              {/* Features */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Уровень профиля: {account.level}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Количество игр: {account.games}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Часов в играх: {account.hours}</span>
                </div>
                {account.prime && (
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span>Prime Status</span>
                  </div>
                )}
                {account.csgo && (
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span>CS2 / CS:GO</span>
                  </div>
                )}
                {account.dota2 && (
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span>Dota 2</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {account.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2">Описание</h2>
                  <p className="text-gray-700">{account.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-md transition-colors ${
                    addedToCart
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>Добавлено</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>В корзину</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md transition-colors"
                >
                  Купить сейчас
                </button>
              </div>

              {/* Guarantee Info */}
              <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <h3 className="font-bold text-blue-900 mb-2">Гарантия безопасности</h3>
                <p className="text-blue-800 text-sm">
                  Все аккаунты проходят проверку перед продажей.
                  Гарантия 24 часа с момента покупки.
                  Мгновенная доставка данных на ваш email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
