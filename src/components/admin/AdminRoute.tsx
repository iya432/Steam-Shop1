import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Проверка авторизации администратора
    const checkAdminAuth = () => {
      const storedAdmin = localStorage.getItem('admin_user');

      if (!storedAdmin) {
        setIsAuthorized(false);
        return;
      }

      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        if (parsedAdmin && parsedAdmin.isAuthenticated) {
          // Пользователь авторизован как администратор
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error parsing admin user data:', error);
        localStorage.removeItem('admin_user'); // Очищаем поврежденные данные
        setIsAuthorized(false);
      }
    };

    checkAdminAuth();
  }, []);

  // Состояние загрузки - показываем индикатор загрузки
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Проверка авторизации...</div>
      </div>
    );
  }

  // Пользователь не авторизован - перенаправляем на страницу входа
  if (!isAuthorized) {
    return <Navigate to="/adminpaneel" replace />;
  }

  // Пользователь авторизован - показываем защищенный контент
  return <>{children}</>;
};

export default AdminRoute;
