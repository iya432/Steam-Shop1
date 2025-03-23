import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Проверка если пользователь уже авторизован
  useState(() => {
    const storedAdmin = localStorage.getItem('admin_user');
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        if (parsedAdmin && parsedAdmin.isAuthenticated) {
          navigate('/admin');
        }
      } catch (e) {
        // Если с JSON что-то не так, очищаем хранилище
        localStorage.removeItem('admin_user');
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Проверяем учетные данные
      // В реальном приложении здесь был бы API-запрос
      // Для демонстрации используем хардкодированные учетные данные
      if (email === 'admin@example.com' && password === 'admin123') {
        // Успешная авторизация
        const adminUser = {
          id: 'admin1',
          username: 'SiteAdmin',
          email: email,
          role: 'admin',
          isAuthenticated: true,
          lastLogin: new Date().toISOString()
        };

        // Сохраняем данные администратора в localStorage
        localStorage.setItem('admin_user', JSON.stringify(adminUser));

        // Перенаправляем на панель администратора
        navigate('/admin');
      } else {
        // Неверные учетные данные
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Произошла ошибка при входе. Попробуйте позже.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Вход в панель администратора
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Введите учетные данные администратора
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </div>

          <div className="text-sm text-center mt-4">
            <p className="text-gray-600">
              Для демонстрации используйте:<br />
              Email: admin@example.com<br />
              Пароль: admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
