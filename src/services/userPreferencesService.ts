export type NotificationFilterType = 'all' | 'unread' | 'success' | 'warning' | 'info' | 'error';

export interface UserPreferences {
  notificationFilter: NotificationFilterType;
  showNotificationsPanel: boolean;
  seenOnboarding: boolean;
  dismissedAlerts: string[];
  darkMode: boolean | null; // null means use system preference
  lastVisited: {
    page: string;
    timestamp: number;
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  notificationFilter: 'all',
  showNotificationsPanel: true,
  seenOnboarding: false,
  dismissedAlerts: [],
  darkMode: null,
  lastVisited: {
    page: 'home',
    timestamp: Date.now()
  }
};

/**
 * Get user preferences from local storage
 */
export const getUserPreferences = (userId: string): UserPreferences => {
  try {
    const preferences = localStorage.getItem(`user_preferences_${userId}`);
    if (preferences) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(preferences) };
    }
  } catch (error) {
    console.error('Failed to parse user preferences:', error);
  }
  return DEFAULT_PREFERENCES;
};

/**
 * Update user preferences in local storage
 */
export const updateUserPreferences = (userId: string, preferences: Partial<UserPreferences>): UserPreferences => {
  try {
    const currentPreferences = getUserPreferences(userId);
    const updatedPreferences = { ...currentPreferences, ...preferences };
    localStorage.setItem(`user_preferences_${userId}`, JSON.stringify(updatedPreferences));
    return updatedPreferences;
  } catch (error) {
    console.error('Failed to update user preferences:', error);
    return getUserPreferences(userId);
  }
};

/**
 * Save notification filter preference
 */
export const saveNotificationFilterPreference = (userId: string, filter: NotificationFilterType): void => {
  updateUserPreferences(userId, { notificationFilter: filter });
};

/**
 * Get notification filter preference
 */
export const getNotificationFilterPreference = (userId: string): NotificationFilterType => {
  return getUserPreferences(userId).notificationFilter;
};

/**
 * Mark onboarding as seen
 */
export const markOnboardingSeen = (userId: string): void => {
  updateUserPreferences(userId, { seenOnboarding: true });
};

/**
 * Check if onboarding has been seen
 */
export const hasSeenOnboarding = (userId: string): boolean => {
  return getUserPreferences(userId).seenOnboarding;
};

/**
 * Dismiss an alert by ID
 */
export const dismissAlert = (userId: string, alertId: string): void => {
  const preferences = getUserPreferences(userId);
  if (!preferences.dismissedAlerts.includes(alertId)) {
    updateUserPreferences(userId, {
      dismissedAlerts: [...preferences.dismissedAlerts, alertId]
    });
  }
};

/**
 * Check if an alert has been dismissed
 */
export const isAlertDismissed = (userId: string, alertId: string): boolean => {
  const preferences = getUserPreferences(userId);
  return preferences.dismissedAlerts.includes(alertId);
};

/**
 * Save dark mode preference
 */
export const saveDarkModePreference = (userId: string, darkMode: boolean | null): void => {
  updateUserPreferences(userId, { darkMode });
};

/**
 * Get dark mode preference
 */
export const getDarkModePreference = (userId: string): boolean | null => {
  return getUserPreferences(userId).darkMode;
};

/**
 * Update last visited page
 */
export const updateLastVisited = (userId: string, page: string): void => {
  updateUserPreferences(userId, {
    lastVisited: {
      page,
      timestamp: Date.now()
    }
  });
};

/**
 * Get last visited page
 */
export const getLastVisited = (userId: string): { page: string; timestamp: number } => {
  return getUserPreferences(userId).lastVisited;
};
