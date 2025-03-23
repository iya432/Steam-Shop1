import { useState } from 'react';
import { InformationCircleIcon, CheckIcon } from '@heroicons/react/24/outline';

const Balance = () => {
  const [amount, setAmount] = useState<number | ''>('');
  const [login, setLogin] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Предустановленные суммы пополнения
  const presetAmounts = [500, 1000, 2000, 5000, 10000];

  // Цены с учетом скидок
  const getDiscountedPrice = (originalAmount: number): number => {
    let discountPercentage = 0;
    if (originalAmount >= 500 && originalAmount < 1000) {
      discountPercentage = 10;
    } else if (originalAmount >= 1000 && originalAmount < 5000) {
      discountPercentage = 15;
    } else if (originalAmount >= 5000) {
      discountPercentage = 20;
    }

    return Math.round(originalAmount * (1 - discountPercentage / 100));
  };

  // Методы оплаты
  const paymentMethods = [
    { id: 'card', name: 'Банковская карта', icon: 'https://same-assets.com/vi-assets/static/payment/card.svg' },
    { id: 'qiwi', name: 'QIWI', icon: 'https://same-assets.com/vi-assets/static/payment/qiwi.svg' },
    { id: 'webmoney', name: 'WebMoney', icon: 'https://same-assets.com/vi-assets/static/payment/webmoney.svg' },
    { id: 'yoomoney', name: 'ЮMoney', icon: 'https://same-assets.com/vi-assets/static/payment/yoomoney.svg' },
    { id: 'crypto', name: 'Криптовалюта', icon: 'https://same-assets.com/vi-assets/static/payment/bitcoin.svg' },
  ];

  // Валидация
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!amount) {
      newErrors.amount = 'Укажите сумму пополнения';
    } else if (typeof amount === 'number' && amount < 100) {
      newErrors.amount = 'Минимальная сумма пополнения: 100 ₽';
    }

    if (!login.trim()) {
      newErrors.login = 'Укажите логин Steam';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчики событий
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setAmount('');
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        setAmount(numValue);
      }
    }
  };

  const handlePresetAmount = (preset: number) => {
    setAmount(preset);
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      // Здесь был бы API-запрос для обработки платежа
      setStep(3);
    }
  };

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Пополнение баланса Steam</h1>
          <p className="text-gray-600">
            Пополните баланс Steam со скидкой до 20%. Моментальное зачисление средств.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        step >= 1
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 text-gray-300'
                      }`}
                    >
                      {step > 1 ? <CheckIcon className="w-6 h-6" /> : '1'}
                    </div>
                    <span className="mt-2 text-sm">Детали</span>
                  </div>
                  <div className="flex-1 h-1 mx-4 bg-gray-200">
                    <div
                      className={`h-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}
                      style={{ width: step >= 2 ? '100%' : '0%', transition: 'width 0.3s' }}
                    ></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        step >= 2
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 text-gray-300'
                      }`}
                    >
                      {step > 2 ? <CheckIcon className="w-6 h-6" /> : '2'}
                    </div>
                    <span className="mt-2 text-sm">Оплата</span>
                  </div>
                  <div className="flex-1 h-1 mx-4 bg-gray-200">
                    <div
                      className={`h-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}
                      style={{ width: step >= 3 ? '100%' : '0%', transition: 'width 0.3s' }}
                    ></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        step >= 3
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 text-gray-300'
                      }`}
                    >
                      3
                    </div>
                    <span className="mt-2 text-sm">Готово</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Enter details */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Детали пополнения</h2>

                  {/* Login Input */}
                  <div className="mb-6">
                    <label htmlFor="login" className="block text-gray-700 mb-2">
                      Логин Steam
                    </label>
                    <input
                      type="text"
                      id="login"
                      placeholder="Ваш логин в Steam"
                      className={`w-full p-3 border rounded-md ${
                        errors.login ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-blue-500`}
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                    />
                    {errors.login && <p className="text-red-500 text-sm mt-1">{errors.login}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      Укажите логин в Steam (не email и не номер телефона)
                    </p>
                  </div>

                  {/* Amount Presets */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Выберите сумму пополнения</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                      {presetAmounts.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className={`p-2 border rounded-md focus:outline-none transition-colors ${
                            amount === preset
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => handlePresetAmount(preset)}
                        >
                          <div className="font-bold">{preset} ₽</div>
                          <div className="text-xs">
                            {amount === preset ? 'Выбрано' : `${getDiscountedPrice(preset)} ₽`}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <label htmlFor="custom-amount" className="block text-gray-700 mb-2">
                      Или введите свою сумму
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="custom-amount"
                        min="100"
                        placeholder="Введите сумму (мин. 100 ₽)"
                        className={`w-full p-3 border rounded-md ${
                          errors.amount ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-blue-500`}
                        value={amount}
                        onChange={handleAmountChange}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        ₽
                      </span>
                    </div>
                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                  </div>

                  <button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-medium transition-colors"
                    onClick={handleNextStep}
                  >
                    Продолжить
                  </button>
                </div>
              )}

              {/* Step 2: Choose payment method */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Выберите способ оплаты</h2>

                  <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
                            paymentMethod === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                            className="hidden"
                          />
                          <div className="flex items-center w-full">
                            <div
                              className={`w-5 h-5 rounded-full border ${
                                paymentMethod === method.id
                                  ? 'border-blue-500'
                                  : 'border-gray-300'
                              } flex items-center justify-center mr-3`}
                            >
                              {paymentMethod === method.id && (
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              )}
                            </div>
                            <img src={method.icon} alt={method.name} className="h-6 mr-3" />
                            <span className="font-medium">{method.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Сумма пополнения:</span>
                      <span className="font-medium">{amount} ₽</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Скидка:</span>
                      <span className="font-medium text-green-600">
                        {amount && typeof amount === 'number'
                          ? `${amount - getDiscountedPrice(amount)} ₽`
                          : '0 ₽'}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Итого к оплате:</span>
                      <span>
                        {amount && typeof amount === 'number' ? getDiscountedPrice(amount) : 0} ₽
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-medium transition-colors"
                    onClick={handleNextStep}
                  >
                    Оплатить
                  </button>
                </div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckIcon className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Оплата успешно завершена!</h2>
                  <p className="text-gray-600 mb-6">
                    Средства будут зачислены на ваш аккаунт в течение нескольких минут.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Сумма пополнения: <span className="font-bold">{amount} ₽</span>
                    <br />
                    Логин Steam: <span className="font-bold">{login}</span>
                  </p>
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                    onClick={() => {
                      setStep(1);
                      setAmount('');
                      setLogin('');
                    }}
                  >
                    Новое пополнение
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* How it works */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Как это работает</h3>
              <ol className="space-y-4 text-gray-600">
                <li className="flex">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">
                    1
                  </span>
                  <p>Введите ваш логин Steam (не email или телефон)</p>
                </li>
                <li className="flex">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">
                    2
                  </span>
                  <p>Выберите удобную сумму пополнения</p>
                </li>
                <li className="flex">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">
                    3
                  </span>
                  <p>Выберите удобный способ оплаты</p>
                </li>
                <li className="flex">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">
                    4
                  </span>
                  <p>Получите средства на свой аккаунт Steam моментально</p>
                </li>
              </ol>
            </div>

            {/* Discount Info */}
            <div className="bg-blue-50 rounded-lg shadow-md p-6">
              <div className="flex items-start mb-4">
                <InformationCircleIcon className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" />
                <h3 className="text-lg font-bold">Наши скидки</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between">
                  <span>От 500 ₽</span>
                  <span className="font-bold text-blue-600">Скидка 10%</span>
                </li>
                <li className="flex justify-between">
                  <span>От 1000 ₽</span>
                  <span className="font-bold text-blue-600">Скидка 15%</span>
                </li>
                <li className="flex justify-between">
                  <span>От 5000 ₽</span>
                  <span className="font-bold text-blue-600">Скидка 20%</span>
                </li>
              </ul>
              <div className="mt-4 text-sm text-gray-600">
                Чем больше сумма пополнения, тем выгоднее цена!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
