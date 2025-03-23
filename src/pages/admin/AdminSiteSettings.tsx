import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';
import { getSiteSettings, updateSiteSettings, SiteSettings } from '../../services/adminService';

const AdminSiteSettings = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

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

      // Load site settings
      loadSiteSettings();
    } catch (error) {
      console.error('Failed to parse admin user data', error);
      navigate('/adminpaneel');
    }
  }, [navigate]);

  const loadSiteSettings = () => {
    setLoading(true);
    const siteSettings = getSiteSettings();
    setSettings(siteSettings);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    navigate('/adminpaneel');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;

    const { name, value } = e.target;

    if (name.startsWith('socialLinks.')) {
      const socialName = name.split('.')[1];
      setSettings({
        ...settings,
        socialLinks: {
          ...settings.socialLinks,
          [socialName]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };

  const handleSaveSettings = () => {
    if (!settings) return;

    setSaving(true);

    try {
      const updatedSettings = updateSiteSettings(settings);
      setSettings(updatedSettings);
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
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
            <h2 className="text-xl font-bold text-gray-900">Настройки сайта</h2>
            <p className="text-sm text-gray-500">Управление общими настройками сайта</p>
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
              Товары
            </Link>
            <Link
              to="/admin/users"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Пользователи
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Основные настройки</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название сайта
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание сайта
                  </label>
                  <textarea
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL логотипа
                  </label>
                  <input
                    type="text"
                    name="siteLogo"
                    value={settings.siteLogo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL фавиконки
                  </label>
                  <input
                    type="text"
                    name="favicon"
                    value={settings.favicon}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Цвета и стили</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Основной цвет
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      name="primaryColor"
                      value={settings.primaryColor}
                      onChange={handleInputChange}
                      className="h-10 w-10 rounded-md border border-gray-300 mr-2"
                    />
                    <input
                      type="text"
                      name="primaryColor"
                      value={settings.primaryColor}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Вторичный цвет
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      name="secondaryColor"
                      value={settings.secondaryColor}
                      onChange={handleInputChange}
                      className="h-10 w-10 rounded-md border border-gray-300 mr-2"
                    />
                    <input
                      type="text"
                      name="secondaryColor"
                      value={settings.secondaryColor}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email для связи
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Социальные сети
                  </label>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">ВКонтакте</label>
                      <input
                        type="text"
                        name="socialLinks.vk"
                        value={settings.socialLinks.vk || ''}
                        onChange={handleInputChange}
                        placeholder="https://vk.com/yourgroup"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Telegram</label>
                      <input
                        type="text"
                        name="socialLinks.telegram"
                        value={settings.socialLinks.telegram || ''}
                        onChange={handleInputChange}
                        placeholder="https://t.me/yourchannel"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Discord</label>
                      <input
                        type="text"
                        name="socialLinks.discord"
                        value={settings.socialLinks.discord || ''}
                        onChange={handleInputChange}
                        placeholder="https://discord.gg/yourinvite"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Instagram</label>
                      <input
                        type="text"
                        name="socialLinks.instagram"
                        value={settings.socialLinks.instagram || ''}
                        onChange={handleInputChange}
                        placeholder="https://instagram.com/youraccount"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Футер и страницы</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Текст в футере
                  </label>
                  <input
                    type="text"
                    name="footerText"
                    value={settings.footerText}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL страницы с условиями использования
                  </label>
                  <input
                    type="text"
                    name="termsPageUrl"
                    value={settings.termsPageUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL страницы политики конфиденциальности
                  </label>
                  <input
                    type="text"
                    name="privacyPageUrl"
                    value={settings.privacyPageUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview and Save */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Предпросмотр</h3>

              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-2 flex-shrink-0">
                    <img
                      src={settings.siteLogo}
                      alt="Site Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="font-bold text-lg" style={{ color: settings.primaryColor }}>
                    {settings.siteName}
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-3">
                  {settings.siteDescription}
                </div>

                <div className="text-xs text-gray-400 flex items-center space-x-2">
                  <span>Контакты:</span>
                  <span>{settings.contactEmail}</span>
                </div>

                <div className="text-xs text-gray-400 flex items-center space-x-2 mt-1">
                  <span>Соц. сети:</span>
                  {settings.socialLinks.vk && <span>VK</span>}
                  {settings.socialLinks.telegram && <span>TG</span>}
                  {settings.socialLinks.discord && <span>Discord</span>}
                </div>

                <div className="mt-4 pt-3 border-t text-xs text-center text-gray-500">
                  {settings.footerText}
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

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Информация</h3>
              <div className="text-sm text-gray-500">
                <p className="mb-2">
                  Настройки сайта применяются автоматически после сохранения. Некоторые изменения могут потребовать перезагрузки страницы пользователями.
                </p>
                <p>
                  Последнее обновление:<br />
                  <span className="text-xs">
                    {new Date(settings.updatedAt).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSiteSettings;
