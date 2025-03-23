import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  XMarkIcon,
  PlusIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  PhotoIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import {
  ProductCategory,
  OfferType,
  PRODUCT_CATEGORIES,
  OFFER_TYPES,
  getUserProductById,
  createUserProduct,
  updateUserProduct
} from '../../services/userProductsService';

const ProductForm = () => {
  const { productId } = useParams<{ productId: string }>();
  const isEditing = !!productId;
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState<ProductCategory>('account');
  const [offerType, setOfferType] = useState<OfferType>('sale');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Additional fields based on category and offer type
  const [level, setLevel] = useState('');
  const [gamesCount, setGamesCount] = useState('');
  const [hours, setHours] = useState('');
  const [prime, setPrime] = useState(false);
  const [csgo, setCsgo] = useState(false);
  const [dota2, setDota2] = useState(false);

  // Fields for skins
  const [game, setGame] = useState('');
  const [rarity, setRarity] = useState('');
  const [wear, setWear] = useState('');

  // Fields for keys
  const [platform, setPlatform] = useState('');
  const [region, setRegion] = useState('');

  // Fields for rent
  const [rentDuration, setRentDuration] = useState('');
  const [rentPrice, setRentPrice] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load product data if editing
  useEffect(() => {
    if (isEditing && productId) {
      const product = getUserProductById(productId);
      if (product) {
        // Set basic fields
        setTitle(product.title);
        setDescription(product.description);
        setPrice(product.price.toString());
        if (product.discountPrice) {
          setDiscountPrice(product.discountPrice.toString());
        }
        setCategory(product.category);
        setOfferType(product.offerType);
        setImages(product.images);

        // Set category-specific fields
        if (product.level) setLevel(product.level.toString());
        if (product.games) setGamesCount(product.games.toString());
        if (product.hours) setHours(product.hours.toString());
        if (product.prime) setPrime(product.prime);
        if (product.csgo) setCsgo(product.csgo);
        if (product.dota2) setDota2(product.dota2);

        // Skin fields
        if (product.game) setGame(product.game);
        if (product.rarity) setRarity(product.rarity);
        if (product.wear) setWear(product.wear);

        // Key fields
        if (product.platform) setPlatform(product.platform);
        if (product.region) setRegion(product.region);

        // Rent fields
        if (product.rentDuration) setRentDuration(product.rentDuration.toString());
        if (product.rentPrice) setRentPrice(product.rentPrice.toString());
      } else {
        setError('Товар не найден');
      }
    }
  }, [isEditing, productId]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', { state: { from: '/profile/products/new' } });
      return;
    }

    // Validate form
    if (!title.trim()) {
      setError('Введите название товара');
      return;
    }

    if (!description.trim()) {
      setError('Введите описание товара');
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Введите корректную цену');
      return;
    }

    if (offerType === 'discount' && (!discountPrice || isNaN(Number(discountPrice)) || Number(discountPrice) <= 0)) {
      setError('Введите корректную цену со скидкой');
      return;
    }

    if (images.length === 0) {
      setError('Добавьте хотя бы одно изображение');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare product data
      const productData = {
        userId: user.id,
        title,
        description,
        price: Number(price),
        ...(discountPrice && { discountPrice: Number(discountPrice) }),
        category,
        offerType,
        images,
        featuredImage: images[0], // Use first image as featured

        // Add category-specific fields
        ...(category === 'account' && {
          level: level ? Number(level) : undefined,
          games: gamesCount ? Number(gamesCount) : undefined,
          hours: hours ? Number(hours) : undefined,
          prime,
          csgo,
          dota2,
        }),

        // Add skin-specific fields
        ...(category === 'skin' && {
          game,
          rarity,
          wear,
        }),

        // Add key-specific fields
        ...(category === 'key' && {
          platform,
          region,
        }),

        // Add rent-specific fields
        ...(offerType === 'rent' && {
          rentDuration: rentDuration ? Number(rentDuration) : undefined,
          rentPrice: rentPrice ? Number(rentPrice) : undefined,
        }),
      };

      // Create or update product
      if (isEditing && productId) {
        updateUserProduct(productId, productData);
      } else {
        createUserProduct(productData);
      }

      setSuccess(true);

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/profile/products');
      }, 2000);

    } catch (err) {
      setError('Произошла ошибка при сохранении товара');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add an image from URL
  const handleAddImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl)) {
      setImages([...images, newImageUrl]);
      setNewImageUrl('');
    }
  };

  // Remove an image from the list
  const handleRemoveImage = (url: string) => {
    setImages(images.filter((image) => image !== url));
  };

  // If success, show success message
  if (success) {
    return (
      <div className="bg-gray-100 py-8 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {isEditing ? 'Товар успешно обновлен!' : 'Товар успешно добавлен!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isEditing
                ? 'Ваш товар был успешно обновлен и скоро будет доступен после проверки модератором.'
                : 'Ваш товар был успешно добавлен и скоро будет доступен после проверки модератором.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/profile/products')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            <span>Назад к списку товаров</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-6">
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Редактирование товара' : 'Добавление нового товара'}
            </h1>
            <p className="text-blue-100">
              {isEditing
                ? 'Обновите информацию о вашем товаре'
                : 'Заполните форму, чтобы добавить новый товар для продажи'}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500">
              <div className="flex">
                <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            {/* Main Product Information */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 pb-2 border-b">Основная информация</h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Product Title */}
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                    Название товара *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                    placeholder="Введите название товара"
                    required
                  />
                </div>

                {/* Product Description */}
                <div>
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                    Описание товара *
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500 h-32"
                    placeholder="Подробно опишите ваш товар"
                    required
                  ></textarea>
                </div>

                {/* Product Category */}
                <div>
                  <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                    Категория товара *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <div
                        key={cat.id}
                        className={`p-4 border rounded-md cursor-pointer transition-colors ${
                          category === cat.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setCategory(cat.id as ProductCategory)}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{cat.icon}</span>
                          <div>
                            <div className="font-medium">{cat.name}</div>
                            <div className="text-xs text-gray-500">{cat.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Offer Type */}
                <div>
                  <label htmlFor="offerType" className="block text-gray-700 font-medium mb-2">
                    Тип предложения *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {OFFER_TYPES.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-md cursor-pointer transition-colors ${
                          offerType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setOfferType(type.id as OfferType)}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{type.icon}</span>
                          <div>
                            <div className="font-medium">{type.name}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                      Цена *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                        placeholder="0"
                        min="1"
                        required
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₽
                      </span>
                    </div>
                  </div>

                  {/* Discount Price (if applicable) */}
                  {offerType === 'discount' && (
                    <div>
                      <label htmlFor="discountPrice" className="block text-gray-700 font-medium mb-2">
                        Цена со скидкой *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="discountPrice"
                          value={discountPrice}
                          onChange={(e) => setDiscountPrice(e.target.value)}
                          className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                          placeholder="0"
                          min="1"
                          required={offerType === 'discount'}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₽
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Rent Price (if applicable) */}
                  {offerType === 'rent' && (
                    <>
                      <div>
                        <label htmlFor="rentPrice" className="block text-gray-700 font-medium mb-2">
                          Цена за день аренды *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            id="rentPrice"
                            value={rentPrice}
                            onChange={(e) => setRentPrice(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="0"
                            min="1"
                            required={offerType === 'rent'}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            ₽
                          </span>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="rentDuration" className="block text-gray-700 font-medium mb-2">
                          Максимальная длительность (дней) *
                        </label>
                        <input
                          type="number"
                          id="rentDuration"
                          value={rentDuration}
                          onChange={(e) => setRentDuration(e.target.value)}
                          className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                          placeholder="30"
                          min="1"
                          required={offerType === 'rent'}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Category-specific fields */}
            {category === 'account' && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 pb-2 border-b">Информация об аккаунте</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="level" className="block text-gray-700 font-medium mb-2">
                      Уровень профиля
                    </label>
                    <input
                      type="number"
                      id="level"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="gamesCount" className="block text-gray-700 font-medium mb-2">
                      Количество игр
                    </label>
                    <input
                      type="number"
                      id="gamesCount"
                      value={gamesCount}
                      onChange={(e) => setGamesCount(e.target.value)}
                      className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="hours" className="block text-gray-700 font-medium mb-2">
                      Часов в играх
                    </label>
                    <input
                      type="number"
                      id="hours"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="prime"
                      checked={prime}
                      onChange={(e) => setPrime(e.target.checked)}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="prime" className="ml-2 text-gray-700">
                      Prime Status
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="csgo"
                      checked={csgo}
                      onChange={(e) => setCsgo(e.target.checked)}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="csgo" className="ml-2 text-gray-700">
                      CS2 / CS:GO
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="dota2"
                      checked={dota2}
                      onChange={(e) => setDota2(e.target.checked)}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="dota2" className="ml-2 text-gray-700">
                      Dota 2
                    </label>
                  </div>
                </div>
              </div>
            )}

            {category === 'skin' && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 pb-2 border-b">Информация о скине</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="game" className="block text-gray-700 font-medium mb-2">
                      Игра
                    </label>
                    <input
                      type="text"
                      id="game"
                      value={game}
                      onChange={(e) => setGame(e.target.value)}
                      className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="Например: CS2, Dota 2"
                    />
                  </div>

                  <div>
                    <label htmlFor="rarity" className="block text-gray-700 font-medium mb-2">
                      Редкость
                    </label>
                    <input
                      type="text"
                      id="rarity"
                      value={rarity}
                      onChange={(e) => setRarity(e.target.value)}
                      className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="Например: Тайное, Редкое"
                    />
                  </div>

                  <div>
                    <label htmlFor="wear" className="block text-gray-700 font-medium mb-2">
                      Износ
                    </label>
                    <input
                      type="text"
                      id="wear"
                      value={wear}
                      onChange={(e) => setWear(e.target.value)}
                      className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="Например: Поношенное, Прямо с завода"
                    />
                  </div>
                </div>
              </div>
            )}

            {category === 'key' && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 pb-2 border-b">Информация о ключе</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="platform" className="block text-gray-700 font-medium mb-2">
                      Платформа
                    </label>
                    <input
                      type="text"
                      id="platform"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="Например: Steam, Epic Games"
                    />
                  </div>

                  <div>
                    <label htmlFor="region" className="block text-gray-700 font-medium mb-2">
                      Регион
                    </label>
                    <input
                      type="text"
                      id="region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="Например: Глобальный, СНГ"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Images */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 pb-2 border-b">Изображения товара *</h2>

              {/* Image URL input */}
              <div className="flex mb-4">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 p-3 border rounded-l-md focus:outline-none focus:border-blue-500"
                  placeholder="Вставьте URL изображения"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Image preview */}
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group rounded-md overflow-hidden border border-gray-300"
                    >
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs py-1 text-center">
                          Главное изображение
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                  <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">
                    Нет изображений. Добавьте хотя бы одно изображение.
                  </p>
                </div>
              )}
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 inline-block animate-spin mr-2" />
                    {isEditing ? 'Сохранение...' : 'Создание...'}
                  </>
                ) : (
                  isEditing ? 'Сохранить изменения' : 'Создать товар'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
