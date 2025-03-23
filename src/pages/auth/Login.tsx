import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AtSymbolIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the return URL from location state or default to home page
  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate form fields
    if (!email.trim()) {
      setFormError('Введите email');
      return;
    }

    if (!password.trim()) {
      setFormError('Введите пароль');
      return;
    }

    // Attempt login
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-6">
            <h2 className="text-2xl font-bold">Вход в аккаунт</h2>
            <p className="text-blue-100">Войдите для доступа к вашим покупкам</p>
          </div>

          <div className="p-6">
            {/* Error message */}
            {(error || formError) && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md border border-red-200">
                {formError || error}
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <AtSymbolIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Ваш email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <LockClosedIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    placeholder="Ваш пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Выполняется вход...' : 'Войти'}
              </button>
            </form>

            {/* Register link */}
            <div className="mt-6 text-center text-gray-600">
              Нет аккаунта?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Зарегистрируйтесь
              </Link>
            </div>

            {/* Demo Account Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Тестовый аккаунт:</h3>
              <p className="text-sm text-gray-600 mb-1">Email: user@example.com</p>
              <p className="text-sm text-gray-600">Пароль: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
