import { useState, useEffect } from 'react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { getProductsByCategory, UserProduct } from '../services/userProductsService';

// Типы данных
interface Account extends Omit<UserProduct, 'id'> {
  id: string | number;
}

const Accounts = () => {
  // Фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка реальных данных аккаунтов
  useEffect(() => {
    // Получаем активные аккаунты
    const activeAccounts = getProductsByCategory('account').map(product => ({
      ...product,
      id: product.id
    }));

    setAccounts(activeAccounts);
    setIsLoading(false);
  }, []);

  // Фильтрация аккаунтов
  const filteredAccounts = accounts.filter((account) => {
    // Фильтр по поиску
    if (
      searchQuery &&
      !account.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Фильтр по цене
    if (account.price < priceRange[0] || account.price > priceRange[1]) {
      return false;
    }

    // Фильтр по категориям
    if (selectedCategories.length > 0) {
      if (
        (selectedCategories.includes('csgo') && !account.csgo) ||
        (selectedCategories.includes('dota2') && !account.dota2) ||
        (selectedCategories.includes('prime') && !account.prime)
      ) {
        return false;
      }
    }

    return true;
  });

  // Сортировка аккаунтов
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'level-desc':
        return (b.level || 0) - (a.level || 0);
      case 'games-desc':
        return (b.games || 0) - (a.games || 0);
      default:
        // По умолчанию сортировка по дате создания (новые)
        return new Date(b.created).getTime() - new Date(a.created).getTime();
    }
  });

  // Обработчики фильтров
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = parseInt(e.target.value, 10);
    setPriceRange(newPriceRange as [number, number]);
  };

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Аккаунты Steam</h1>
          <p className="text-gray-600">
            Большой выбор аккаунтов Steam с различными играми и уровнями профиля
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            {/* Search */}
            <div className="relative w-full md:w-96 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Поиск аккаунтов..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Sort and Filter Buttons */}
            <div className="flex space-x-4 w-full md:w-auto">
              <select
                className="bg-white px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">По новизне</option>
                <option value="price-asc">По цене (возр.)</option>
                <option value="price-desc">По цене (убыв.)</option>
                <option value="level-desc">По уровню</option>
                <option value="games-desc">По количеству игр</option>
              </select>
              <button
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="w-5 h-5" />
                <span>Фильтры</span>
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-2">Цена (₽)</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="50000"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-1/2 p-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    <span>—</span>
                    <input
                      type="number"
                      min="0"
                      max="50000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-1/2 p-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-2">Игры</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes('csgo')}
                        onChange={() => handleCategoryChange('csgo')}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2">CS2 / CS:GO</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes('dota2')}
                        onChange={() => handleCategoryChange('dota2')}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2">Dota 2</span>
                    </label>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-medium mb-2">Особенности</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes('prime')}
                        onChange={() => handleCategoryChange('prime')}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2">Prime Status</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 py-8 text-center">
              <p className="text-gray-600">Загрузка аккаунтов...</p>
            </div>
          ) : (
            sortedAccounts.map((account) => (
              <div
                key={account.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Account Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={account.featuredImage}
                    alt={account.title}
                    className="w-full h-full object-cover"
                  />
                  {account.discountPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                      {Math.round(((account.price - account.discountPrice) / account.price) * 100)}%
                    </div>
                  )}
                </div>

                {/* Account Details */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{account.title}</h3>
                  <div className="flex justify-between mb-4">
                    <div className="text-gray-600 text-sm">
                      <div>Уровень профиля: {account.level || 'Не указан'}</div>
                      <div>Количество игр: {account.games || 'Не указано'}</div>
                      <div>Часов в играх: {account.hours || 'Не указано'}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      {account.csgo && <span className="text-xs bg-gray-200 px-2 py-1 rounded mb-1">CS2</span>}
                      {account.dota2 && <span className="text-xs bg-gray-200 px-2 py-1 rounded mb-1">Dota 2</span>}
                      {account.prime && (
                        <span className="text-xs bg-yellow-200 px-2 py-1 rounded mb-1">Prime</span>
                      )}
                    </div>
                  </div>

                  {/* Price and Buy Button */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">{account.price} ₽</span>
                      {account.discountPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {account.price} ₽
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/accounts/${account.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Купить
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && sortedAccounts.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center shadow-md">
            <h3 className="text-xl font-bold mb-2">Аккаунты не найдены</h3>
            <p className="text-gray-600 mb-4">
              По вашему запросу не найдено ни одного аккаунта. Попробуйте изменить параметры фильтрации.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceRange([0, 5000]);
                setSelectedCategories([]);
                setSortBy('newest');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
