import { useState, useEffect } from 'react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { getProductsByCategory, UserProduct } from '../services/userProductsService';

// Типы данных
interface Game extends Omit<UserProduct, 'id'> {
  id: string | number;
}

const Games = () => {
  // Фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка реальных данных игр
  useEffect(() => {
    // Получаем активные игры
    const activeGames = getProductsByCategory('game').map(product => ({
      ...product,
      id: product.id
    }));

    setGames(activeGames);
    setIsLoading(false);
  }, []);

  // Получение уникальных платформ из игр
  const platforms = [...new Set(games.map(game => game.platform).filter(Boolean))];

  // Фильтрация игр
  const filteredGames = games.filter((game) => {
    // Фильтр по поиску
    if (
      searchQuery &&
      !game.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Фильтр по цене
    if (game.price < priceRange[0] || game.price > priceRange[1]) {
      return false;
    }

    // Фильтр по платформам
    if (selectedPlatforms.length > 0 && game.platform) {
      if (!selectedPlatforms.includes(game.platform)) {
        return false;
      }
    }

    return true;
  });

  // Сортировка игр
  const sortedGames = [...filteredGames].sort((a, b) => {
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
          <h1 className="text-3xl font-bold mb-2">Игры</h1>
          <p className="text-gray-600">
            Цифровые и физические копии игр для разных платформ
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            {/* Search */}
            <div className="relative w-full md:w-96 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Поиск игр..."
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

        {/* Games List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 py-8 text-center">
              <p className="text-gray-600">Загрузка игр...</p>
            </div>
          ) : (
            sortedGames.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Game Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={game.featuredImage}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                  {game.discountPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                      {Math.round(((game.price - game.discountPrice) / game.price) * 100)}%
                    </div>
                  )}
                </div>

                {/* Game Details */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{game.title}</h3>
                  <div className="flex justify-between mb-4">
                    <div className="text-gray-600 text-sm">
                      {game.platform && <div>Платформа: {game.platform}</div>}
                      {game.region && <div>Регион: {game.region}</div>}
                    </div>
                  </div>

                  {/* Price and Buy Button */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">{game.price} ₽</span>
                      {game.discountPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {game.price} ₽
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/games/${game.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
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
        {!isLoading && sortedGames.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center shadow-md">
            <h3 className="text-xl font-bold mb-2">Игры не найдены</h3>
            <p className="text-gray-600 mb-4">
              По вашему запросу не найдено ни одной игры. Попробуйте изменить параметры фильтрации.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceRange([0, 10000]);
                setSelectedPlatforms([]);
                setSortBy('newest');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
