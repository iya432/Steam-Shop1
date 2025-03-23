import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getAllProductCategories, ProductCategoryConfig } from '../../services/adminService';
import {
  createUserProduct,
  OFFER_TYPES,
  ProductCategory,
  OfferType,
  UserProduct
} from '../../services/userProductsService';

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  offerType: string;
  images: string[];
  featuredImage: string;
  userId: string;
  level: string;
  games: string;
  hours: string;
  prime: boolean;
  csgo: boolean;
  dota2: boolean;
  game: string;
  rarity: string;
  wear: string;
  platform: string;
  region: string;
  rentDuration: string;
  rentPrice: string;
}

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ProductCategoryConfig[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state with proper typing
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    offerType: 'sale',
    images: [],
    featuredImage: '',
    userId: '1', // Default to admin user for created products

    // Optional fields based on category
    level: '',
    games: '',
    hours: '',
    prime: false,
    csgo: false,
    dota2: false,

    game: '',
    rarity: '',
    wear: '',

    platform: '',
    region: '',

    rentDuration: '',
    rentPrice: '',
  });

  useEffect(() => {
    // Check if user is logged in as admin
    const storedAdmin = localStorage.getItem('admin_user');

    if (!storedAdmin) {
      navigate('/adminpaneel');
      return;
    }

    try {
      const parsedAdmin = JSON.parse(storedAdmin);
      if (!parsedAdmin || !parsedAdmin.isAuthenticated) {
        navigate('/adminpaneel');
        return;
      }

      setAdminUser(parsedAdmin);

      // Load available categories
      loadCategories();
    } catch (error) {
      console.error('Failed to parse admin user data', error);
      navigate('/adminpaneel');
    }
  }, [navigate]);

  const loadCategories = () => {
    setLoading(true);
    try {
      const productCategories = getAllProductCategories();
      setCategories(productCategories.filter(cat => cat.isActive));
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Ошибка при загрузке категорий');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    navigate('/adminpaneel');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddImage = () => {
    const imageUrl = prompt('Введите URL изображения:');
    if (imageUrl && imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()],
        // If it's the first image, set it as featured
        featuredImage: formData.featuredImage || imageUrl.trim()
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    const removedImage = newImages.splice(index, 1)[0];

    // If removed image was featured, set the first remaining image as featured
    let newFeaturedImage = formData.featuredImage;
    if (removedImage === formData.featuredImage) {
      newFeaturedImage = newImages.length > 0 ? newImages[0] : '';
    }

    setFormData({
      ...formData,
      images: newImages,
      featuredImage: newFeaturedImage
    });
  };

  const setAsFeaturedImage = (imageUrl: string) => {
    setFormData({
      ...formData,
      featuredImage: imageUrl
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      setError('Заполните все обязательные поля');
      return;
    }

    if (formData.images.length === 0) {
      setError('Добавьте хотя бы одно изображение');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Create a correctly typed object for the product service
      const productData: Omit<UserProduct, 'id' | 'created' | 'updated' | 'status'> = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category as ProductCategory,
        offerType: formData.offerType as OfferType,
        images: formData.images,
        featuredImage: formData.featuredImage,
        userId: formData.userId,
      };

      // Add optional fields only if they have values
      if (formData.level) productData.level = Number(formData.level);
      if (formData.games) productData.games = Number(formData.games);
      if (formData.hours) productData.hours = Number(formData.hours);
      if (formData.prime) productData.prime = formData.prime;
      if (formData.csgo) productData.csgo = formData.csgo;
      if (formData.dota2) productData.dota2 = formData.dota2;

      if (formData.game) productData.game = formData.game;
      if (formData.rarity) productData.rarity = formData.rarity;
      if (formData.wear) productData.wear = formData.wear;

      if (formData.platform) productData.platform = formData.platform;
      if (formData.region) productData.region = formData.region;

      if (formData.rentDuration) productData.rentDuration = Number(formData.rentDuration);
      if (formData.rentPrice) productData.rentPrice = Number(formData.rentPrice);

      const newProduct = createUserProduct(productData);

      setSuccess(`Товар "${newProduct.title}" успешно создан и отправлен на модерацию`);

      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        offerType: 'sale',
        images: [],
        featuredImage: '',
        userId: '1',
        level: '',
        games: '',
        hours: '',
        prime: false,
        csgo: false,
        dota2: false,
        game: '',
        rarity: '',
        wear: '',
        platform: '',
        region: '',
        rentDuration: '',
        rentPrice: '',
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Ошибка при создании товара');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  // Determine which fields to show based on category
  const showAccountFields = formData.category === 'account';
  const showSkinFields = formData.category === 'skin';
  const showKeyFields = formData.category === 'key';
  const showRentFields = formData.offerType === 'rent';

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{adminUser?.username}</span> ({adminUser?.role})
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Выход
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Добавление нового товара</h2>
            <p className="text-sm text-gray-500">Создайте новый товар для продажи на сайте</p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/admin"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Дашборд
            </Link>
            <Link
              to="/admin/products"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Все товары
            </Link>
          </div>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-green-700">{success}</div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <XMarkIcon className="h-5 w-5 text-red-500 mr-2" />
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b">Информация о товаре</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название товара *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена (₽) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип предложения *
                </label>
                <select
                  name="offerType"
                  value={formData.offerType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {OFFER_TYPES.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Images section */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Изображения</h3>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Изображения товара *
                </label>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Добавить изображение
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative border rounded-md overflow-hidden ${
                      image === formData.featuredImage ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://same-assets.com/vi-assets/static/placeholder.png';
                      }}
                    />
                    <div className="absolute top-0 right-0 p-1 flex space-x-1">
                      {image !== formData.featuredImage && (
                        <button
                          type="button"
                          onClick={() => setAsFeaturedImage(image)}
                          className="bg-blue-600 text-white p-1 rounded-md hover:bg-blue-700 text-xs"
                          title="Сделать главным"
                        >
                          ⭐
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="bg-red-600 text-white p-1 rounded-md hover:bg-red-700 text-xs"
                        title="Удалить"
                      >
                        ✕
                      </button>
                    </div>
                    {image === formData.featuredImage && (
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs text-center py-1">
                        Главное изображение
                      </div>
                    )}
                  </div>
                ))}

                {formData.images.length === 0 && (
                  <div className="col-span-4 border border-dashed rounded-md p-6 text-center">
                    <p className="text-gray-500">Нет добавленных изображений</p>
                  </div>
                )}
              </div>
            </div>

            {/* Show specific fields based on category */}
            {showAccountFields && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Детали аккаунта</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Уровень аккаунта
                    </label>
                    <input
                      type="number"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Количество игр
                    </label>
                    <input
                      type="number"
                      name="games"
                      value={formData.games}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Количество часов
                    </label>
                    <input
                      type="number"
                      name="hours"
                      value={formData.hours}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="prime"
                        name="prime"
                        checked={formData.prime}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="prime" className="ml-2 block text-sm text-gray-900">
                        Prime статус
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="csgo"
                        name="csgo"
                        checked={formData.csgo}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="csgo" className="ml-2 block text-sm text-gray-900">
                        CS2
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="dota2"
                        name="dota2"
                        checked={formData.dota2}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="dota2" className="ml-2 block text-sm text-gray-900">
                        Dota 2
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showSkinFields && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Детали скина</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Игра
                    </label>
                    <input
                      type="text"
                      name="game"
                      value={formData.game}
                      onChange={handleInputChange}
                      placeholder="CS2, Dota 2, и т.д."
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Редкость
                    </label>
                    <input
                      type="text"
                      name="rarity"
                      value={formData.rarity}
                      onChange={handleInputChange}
                      placeholder="Обычный, Редкий, Тайное, и т.д."
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Состояние
                    </label>
                    <input
                      type="text"
                      name="wear"
                      value={formData.wear}
                      onChange={handleInputChange}
                      placeholder="Прямо с завода, Немного поношенное, и т.д."
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {showKeyFields && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Детали ключа</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Платформа
                    </label>
                    <input
                      type="text"
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      placeholder="Steam, Epic Games, PlayStation, и т.д."
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Регион активации
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      placeholder="Весь мир, Россия, и т.д."
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {showRentFields && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Детали аренды</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Срок аренды (дни)
                    </label>
                    <input
                      type="number"
                      name="rentDuration"
                      value={formData.rentDuration}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Цена за день (₽)
                    </label>
                    <input
                      type="number"
                      name="rentPrice"
                      value={formData.rentPrice}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
              >
                Отмена
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submitting && <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />}
                {submitting ? 'Создание...' : 'Создать товар'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
