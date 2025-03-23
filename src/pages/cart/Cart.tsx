import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrashIcon,
  ShoppingBagIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, discountedTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();

  // Calculate savings
  const savings = totalPrice - discountedTotal;

  // Handle quantity change
  const handleQuantityChange = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setIsCheckingOut(true);

    // Simulate checkout process
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
    }, 2000);
  };

  // If checkout was successful, show success message
  if (checkoutSuccess) {
    return (
      <div className="bg-gray-100 py-8 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Заказ успешно оформлен!</h2>
            <p className="text-gray-600 mb-6">
              Данные для входа в аккаунты были отправлены на ваш email. Пополнение баланса будет произведено в течение нескольких минут.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/profile"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
              >
                Перейти в профиль
              </Link>
              <Link
                to="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md transition-colors"
              >
                Вернуться на главную
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Корзина</h1>
          <p className="text-gray-600">
            {totalItems > 0
              ? `${totalItems} ${totalItems === 1 ? 'товар' : (totalItems > 1 && totalItems < 5) ? 'товара' : 'товаров'} в вашей корзине`
              : 'Ваша корзина пуста'}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-md">
            <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Ваша корзина пуста</h3>
            <p className="text-gray-600 mb-6">
              Добавьте аккаунты или пополнение баланса, чтобы продолжить.
            </p>
            <Link
              to="/accounts"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Перейти к аккаунтам
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                        {/* Item Image */}
                        <div className="sm:w-1/4 mb-4 sm:mb-0">
                          <div className="bg-gray-100 rounded-md overflow-hidden h-32">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="sm:w-2/4 sm:px-6">
                          <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                          <p className="text-gray-500 text-sm mb-2">
                            {item.type === 'account'
                              ? 'Аккаунт Steam'
                              : item.type === 'balance'
                              ? 'Пополнение баланса'
                              : 'Игра'}
                          </p>

                          {/* Item Price */}
                          <div className="flex items-end mb-4">
                            <span className="font-bold mr-2">
                              {item.discount
                                ? Math.round(item.price * (1 - item.discount / 100))
                                : item.price} ₽
                            </span>
                            {item.discount && (
                              <>
                                <span className="text-sm text-gray-500 line-through mr-2">
                                  {item.price} ₽
                                </span>
                                <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded">
                                  -{item.discount}%
                                </span>
                              </>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="mx-3 w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price and Remove */}
                        <div className="sm:w-1/4 flex flex-row sm:flex-col justify-between sm:justify-start items-end mt-4 sm:mt-0">
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {item.discount
                                ? Math.round(item.price * (1 - item.discount / 100) * item.quantity)
                                : item.price * item.quantity} ₽
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-500">
                                {item.discount
                                  ? Math.round(item.price * (1 - item.discount / 100))
                                  : item.price} ₽ за шт.
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 mt-4 transition-colors"
                            aria-label="Удалить"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continue Shopping */}
                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <Link
                      to="/accounts"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                      <span>Продолжить покупки</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Итого</h2>

                  {/* Summary Details */}
                  <div className="space-y-2 border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Сумма</span>
                      <span>{totalPrice} ₽</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Скидка</span>
                        <span>-{savings} ₽</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center text-xl font-bold mb-6">
                    <span>К оплате</span>
                    <span>{discountedTotal} ₽</span>
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Способ оплаты</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        className={`p-2 border rounded-md flex justify-center items-center transition-colors ${
                          paymentMethod === 'card'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <img
                          src="https://same-assets.com/vi-assets/static/payment/card.svg"
                          alt="Card"
                          className="h-8"
                        />
                      </button>
                      <button
                        className={`p-2 border rounded-md flex justify-center items-center transition-colors ${
                          paymentMethod === 'qiwi'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setPaymentMethod('qiwi')}
                      >
                        <img
                          src="https://same-assets.com/vi-assets/static/payment/qiwi.svg"
                          alt="QIWI"
                          className="h-8"
                        />
                      </button>
                      <button
                        className={`p-2 border rounded-md flex justify-center items-center transition-colors ${
                          paymentMethod === 'crypto'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setPaymentMethod('crypto')}
                      >
                        <img
                          src="https://same-assets.com/vi-assets/static/payment/bitcoin.svg"
                          alt="Crypto"
                          className="h-8"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-medium transition-colors ${
                      isCheckingOut ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isCheckingOut ? 'Обработка заказа...' : 'Оформить заказ'}
                  </button>

                  {/* Guarantees */}
                  <div className="mt-6 text-sm text-gray-600 space-y-3">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-2" />
                      <span>Безопасная оплата</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="w-5 h-5 text-green-500 mr-2" />
                      <span>Мгновенная доставка</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
