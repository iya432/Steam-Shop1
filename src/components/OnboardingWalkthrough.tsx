import { useState, useEffect, useRef } from 'react';
import {
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  BellIcon,
  ShoppingCartIcon,
  UserIcon,
  MoonIcon,
  SunIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { hasSeenOnboarding, markOnboardingSeen } from '../services/userPreferencesService';

interface StepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  targetSelector: string;
}

const OnboardingWalkthrough: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const userId = user?.id || 'guest';
  const targetRef = useRef<Element | null>(null);

  // Define onboarding steps
  const onboardingSteps: StepProps[] = [
    {
      title: 'Добро пожаловать в Steam Shop!',
      description: 'Это краткое руководство поможет вам ознакомиться с основными функциями нашего сайта. Нажмите "Далее", чтобы начать.',
      icon: <UserIcon className="w-6 h-6" />,
      position: 'bottom',
      targetSelector: 'body'
    },
    {
      title: 'Переключение темы',
      description: 'Нажмите здесь, чтобы переключаться между светлой и темной темой для более комфортного использования.',
      icon: isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />,
      position: 'bottom',
      targetSelector: '[title*="тему"]'
    },
    {
      title: 'Профиль пользователя',
      description: 'Здесь вы можете получить доступ к своему профилю, товарам и настройкам.',
      icon: <UserIcon className="w-6 h-6" />,
      position: 'bottom',
      targetSelector: '#user-menu-container'
    },
    {
      title: 'Уведомления',
      description: 'Здесь вы получите важные уведомления о статусе ваших товаров и других событиях.',
      icon: <BellIcon className="w-6 h-6" />,
      position: 'bottom',
      targetSelector: '[aria-label="Уведомления"]'
    },
    {
      title: 'Корзина',
      description: 'Здесь находятся товары, которые вы добавили для покупки.',
      icon: <ShoppingCartIcon className="w-6 h-6" />,
      position: 'left',
      targetSelector: 'a[href="/cart"]'
    },
    {
      title: 'Готово!',
      description: 'Теперь вы знаете основные функции нашего сайта. Удачных покупок и продаж!',
      icon: <Cog6ToothIcon className="w-6 h-6" />,
      position: 'bottom',
      targetSelector: 'body'
    }
  ];

  // Initial check if user has seen onboarding
  useEffect(() => {
    if (user) {
      const seenOnboarding = hasSeenOnboarding(userId);
      if (!seenOnboarding) {
        // Show onboarding after a small delay
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user, userId]);

  // Effect to update target element highlight
  useEffect(() => {
    if (!isOpen) return;

    const currentStep = onboardingSteps[currentStepIndex];
    const target = document.querySelector(currentStep.targetSelector);

    if (target && currentStep.targetSelector !== 'body') {
      // Remove previous highlighting
      if (targetRef.current && targetRef.current !== target) {
        targetRef.current.classList.remove('onboarding-target');
      }

      // Add highlighting to new target
      target.classList.add('onboarding-target');
      targetRef.current = target;

      return () => {
        if (targetRef.current) {
          targetRef.current.classList.remove('onboarding-target');
        }
      };
    }
  }, [isOpen, currentStepIndex, onboardingSteps]);

  // Handle closing the onboarding
  const closeOnboarding = () => {
    setIsOpen(false);
    if (user) {
      markOnboardingSeen(userId);
    }
  };

  // Move to the next step
  const nextStep = () => {
    if (currentStepIndex < onboardingSteps.length - 1) {
      setCurrentStepIndex(prevStep => prevStep + 1);
    } else {
      closeOnboarding();
    }
  };

  // Move to the previous step
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prevStep => prevStep - 1);
    }
  };

  // Skip all steps
  const skipAll = () => {
    closeOnboarding();
  };

  // If onboarding is not open, don't render
  if (!isOpen) return null;

  const currentStep = onboardingSteps[currentStepIndex];

  // Get target element position
  const getTargetPosition = () => {
    const target = document.querySelector(currentStep.targetSelector);
    if (!target || currentStep.targetSelector === 'body') {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const rect = target.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    // Calculate position based on the step's position property
    switch (currentStep.position) {
      case 'top':
        return {
          bottom: `${window.innerHeight - (rect.top + scrollY) + 15}px`,
          left: `${rect.left + scrollX + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'bottom':
        return {
          top: `${rect.bottom + scrollY + 15}px`,
          left: `${rect.left + scrollX + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: `${rect.top + scrollY + rect.height / 2}px`,
          right: `${window.innerWidth - (rect.left + scrollX) + 15}px`,
          transform: 'translateY(-50%)'
        };
      case 'right':
        return {
          top: `${rect.top + scrollY + rect.height / 2}px`,
          left: `${rect.right + scrollX + 15}px`,
          transform: 'translateY(-50%)'
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  const position = getTargetPosition();
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === onboardingSteps.length - 1;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={skipAll} />

      {/* Tooltip */}
      <div
        className={`fixed z-50 w-80 p-4 rounded-lg shadow-lg ${
          isDarkMode
            ? 'bg-gray-800 text-gray-100'
            : 'bg-white text-gray-800'
        } transition-all duration-300 ease-in-out`}
        style={position}
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={closeOnboarding}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Step content */}
        <div className="mb-4 flex items-center">
          <div className={`mr-3 p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {currentStep.icon}
          </div>
          <h3 className="text-lg font-semibold">{currentStep.title}</h3>
        </div>
        <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {currentStep.description}
        </p>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <div>
            {!isFirstStep && (
              <button
                className={`p-2 rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors mr-2`}
                onClick={prevStep}
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            <button
              className={`text-sm ${
                isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
              onClick={skipAll}
            >
              Пропустить
            </button>
          </div>
          <button
            className={`px-4 py-2 rounded-md ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors inline-flex items-center`}
            onClick={nextStep}
          >
            {isLastStep ? 'Завершить' : 'Далее'}
            {!isLastStep && <ArrowRightIcon className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </div>
    </>
  );
};

export default OnboardingWalkthrough;
