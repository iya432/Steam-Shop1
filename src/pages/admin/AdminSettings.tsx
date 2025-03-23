import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ShopSettings {
  shopName: string;
  shopLogo: string;
  categories: {
    id: string;
    name: string;
    isActive: boolean;
  }[];
}

const DEFAULT_SETTINGS: ShopSettings = {
  shopName: 'Steam Shop',
  shopLogo: 'https://same-assets.com/vi-assets/static/steam_logo.png',
  categories: [
    { id: 'accounts', name: 'Аккаунты', isActive: true },
    { id: 'balance', name: 'Пополнение баланса', isActive: true },
    { id: 'games', name: 'Игры и ключи', isActive: true },
    { id: 'skins', name: 'Скины', isActive: true },
  ],
};

const AdminSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ShopSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [success, setSuccess] = useState(false);

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

      // Load settings (in a real app, would fetch from API)
      const storedSettings = localStorage.getItem('shop_settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to parse admin user data', error);
      navigate('/adminpaneel');
    }
  }, [navigate]);

  const handleSaveSettings = () => {
    setSaving(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      localStorage.setItem('shop_settings', JSON.stringify(settings));
      setSaving(false);
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() === '') return;

    const categoryId = newCategory.toLowerCase().replace(/\s+/g, '_');

    // Check if category ID already exists
    if (settings.categories.some(cat => cat.id === categoryId)) {
      alert('Категория с таким ID уже существует');
      return;
    }

    setSettings({
      ...settings,
      categories: [
        ...settings.categories,
        { id: categoryId, name: newCategory, isActive: true }
      ]
    });

    setNewCategory('');
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSettings({
      ...settings,
      categories: settings.categories.filter(cat => cat.id !== categoryId)
    });
  };

  const handleToggleCategory = (categoryId: string) => {
    setSettings({
      ...settings,
      categories: settings.categories.map(cat =>
        cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
      )
    });
  };

  const handleUpdateLogo = () => {
    if (newLogoUrl.trim() === '') return;

    setSettings({
      ...settings,
      shopLogo: newLogoUrl
    });

    setNewLogoUrl('');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    navigate('/adminpaneel');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

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
            <h2 className="text-xl font-bold text-gray-900">Настройки магазина</h2>
            <p className="text-sm text-gray-500">Управление основными настройками магазина</p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/adminpaneel/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Дашборд
            </Link>
            <Link
              to="/adminpaneel/users"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Пользователи
            </Link>
            <Link
              to="/adminpaneel/products"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Товары
            </Link>
          </div>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-green-700">Настройки успешно сохранены</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* General Settings */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Общие настройки</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название магазина
                  </label>
                  <input
                    type="text"
                    value={settings.shopName}
                    onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Логотип</h3>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={settings.shopLogo}
                    alt="Shop Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-grow space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL логотипа
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newLogoUrl}
                        onChange={(e) => setNewLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleUpdateLogo}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Обновить
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Рекомендуемый размер: 200x200 пикселей, формат PNG или SVG
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Категории товаров</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Добавить новую категорию
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Название категории"
                      className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <PlusCircleIcon className="h-5 w-5 mr-1" />
                      <span>Добавить</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Существующие категории</h4>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Название
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Статус
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {settings.categories.map((category) => (
                          <tr key={category.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {category.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {category.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleToggleCategory(category.id)}
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    category.isActive ? 'bg-green-500' : 'bg-gray-200'
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                      category.isActive ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                                <span className="ml-3 text-sm">
                                  {category.isActive ? 'Активна' : 'Неактивна'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleRemoveCategory(category.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Предпросмотр</h3>

            <div className="border rounded-md p-4 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 overflow-hidden">
                  <img
                    src={settings.shopLogo}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="font-bold text-lg">{settings.shopName}</div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Активные категории:</h4>
                <div className="flex flex-wrap gap-2">
                  {settings.categories
                    .filter(cat => cat.isActive)
                    .map(category => (
                      <span
                        key={category.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {category.name}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center ${
                saving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
