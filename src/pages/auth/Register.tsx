import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AtSymbolIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate form fields
    if (!username.trim()) {
      setFormError('Введите имя пользователя');
      return;
    }

    if (!email.trim()) {
      setFormError('Введите email');
      return;
    }

    if (!password.trim()) {
      setFormError('Введите пароль');
      return;
    }

    if (password.length < 6) {
      setFormError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Пароли не совпадают');
      return;
    }

    // Attempt registration
    const success = await register(username, email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-6">
            <h2 className="text-2xl font-bold">Регистрация</h2>
            <p className="text-blue-100">Создайте аккаунт для покупок в нашем магазине</p>
          </div>

          <div className="p-6">
            {/* Error message */}
            {(error || formError) && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md border border-red-200">
                {formError || error}
              </div>
            )}

            {/* Registration form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  Имя пользователя
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    placeholder="Ваше имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>

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

              <div className="mb-4">
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
                    placeholder="Минимум 6 символов"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                  Подтверждение пароля
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <LockClosedIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-6 text-center text-gray-600">
              Уже есть аккаунт?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Войдите
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
