import { useState, useEffect } from 'react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { getProductsByCategory, UserProduct } from '../services/userProductsService';

// Типы данных
interface Key extends Omit<UserProduct, 'id'> {
  id: string | number;
}

const Keys = () => {
  // Фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [keys, setKeys] = useState<Key[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка реальных данных ключей
  useEffect(() => {
    // Получаем активные ключи
    const activeKeys = getProductsByCategory('key').map(product => ({
      ...product,
      id: product.id
    }));

    setKeys(activeKeys);
    setIsLoading(false);
  }, []);

  // Получение уникальных платформ из ключей
  const platforms = [...new Set(keys.map(key => key.platform).filter(Boolean))];

  // Фильтрация ключей
  const filteredKeys = keys.filter((key) => {
    // Фильтр по поиску
    if (
      searchQuery &&
      !key.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Фильтр по цене
    if (key.price < priceRange[0] || key.price > priceRange[1]) {
      return false;
    }

    // Фильтр по платформам
    if (selectedPlatforms.length > 0 && key.platform) {
      if (!selectedPlatforms.includes(key.platform)) {
        return false;
      }
    }

    return true;
  });

  // Сортировка ключей
  const sortedKeys = [...filteredKeys].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
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

  const handlePlatformChange = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ключи и коды активации</h1>
          <p className="text-gray-600">
            Лицензионные ключи для активации игр и ПО на различных платформах
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            {/* Search */}
            <div className="relative w-full md:w-96 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Поиск ключей..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* Platforms */}
                {platforms.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Платформы</h3>
                    <div className="space-y-2">
                      {platforms.map((platform) => platform && (
                        <label key={platform} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedPlatforms.includes(platform)}
                            onChange={() => handlePlatformChange(platform)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Keys List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 py-8 text-center">
              <p className="text-gray-600">Загрузка ключей...</p>
            </div>
          ) : (
            sortedKeys.map((key) => (
              <div
                key={key.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Key Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={key.featuredImage}
                    alt={key.title}
                    className="w-full h-full object-cover"
                  />
                  {key.discountPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                      {Math.round(((key.price - key.discountPrice) / key.price) * 100)}%
                    </div>
                  )}
                </div>

                {/* Key Details */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{key.title}</h3>
                  <div className="flex justify-between mb-4">
                    <div className="text-gray-600 text-sm">
                      {key.platform && <div>Платформа: {key.platform}</div>}
                      {key.region && <div>Регион: {key.region}</div>}
                    </div>
                  </div>

                  {/* Price and Buy Button */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">{key.price} ₽</span>
                      {key.discountPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {key.price} ₽
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/keys/${key.id}`}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
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
        {!isLoading && sortedKeys.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center shadow-md">
            <h3 className="text-xl font-bold mb-2">Ключи не найдены</h3>
            <p className="text-gray-600 mb-4">
              По вашему запросу не найдено ни одного ключа. Попробуйте изменить параметры фильтрации.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceRange([0, 5000]);
                setSelectedPlatforms([]);
                setSortBy('newest');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Keys;
