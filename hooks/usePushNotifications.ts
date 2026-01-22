import { useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getRandomMessage, getStreakMessage, REMINDER_MESSAGES, CELEBRATION_MESSAGES } from '@/constants/messages';
import Constants from 'expo-constants';
import { storageService } from '@/services/asyncStorage';
import log from '@/services/logger';

const NOTIFICATION_SETTINGS_KEY = '@notification_settings';

interface NotificationSettings {
  enabled: boolean;
  dailyReminderTime: string; // Format "HH:MM"
  streakReminder: boolean;
}

// Configuration du comportement des notifications quand l'app est au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    dailyReminderTime: '20:00', // 20h par défaut
    streakReminder: true,
  });

  // Charger les paramètres sauvegardés
  useEffect(() => {
    loadSettings();
  }, []);

  // Initialiser les notifications
  useEffect(() => {
    if (settings.enabled) {
      registerForPushNotificationsAsync()
        .then(token => {
          if (token) setExpoPushToken(token);
        })
        .catch(error => {
          log.warn('Notifications push non disponibles:', error.message);
          // Continuer sans notifications push
        });

      // Listener pour les notifications reçues
      const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

      // Listener pour les interactions avec les notifications
      const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        log.info('Notification clicked:', response);
        // Vous pouvez naviguer vers une page spécifique ici
      });

      return () => {
        notificationListener.remove();
        responseListener.remove();
      };
    }
  }, [settings.enabled]);

  // Planifier les notifications quotidiennes
  useEffect(() => {
    if (settings.enabled) {
      scheduleDailyReminder(settings.dailyReminderTime);
    } else {
      cancelAllNotifications();
    }
  }, [settings.enabled, settings.dailyReminderTime]);

  const loadSettings = async () => {
    try {
      const saved = await storageService.getItem<NotificationSettings>(NOTIFICATION_SETTINGS_KEY);
      if (saved) {
        setSettings(saved);
      }
    } catch (error) {
      log.error('Erreur chargement paramètres notifications:', error);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await storageService.setItem(NOTIFICATION_SETTINGS_KEY, newSettings);
      setSettings(newSettings);
    } catch (error) {
      log.error('Erreur sauvegarde paramètres notifications:', error);
    }
  };

  const scheduleDailyReminder = async (time: string) => {
    try {
      // Annuler UNIQUEMENT les notifications quotidiennes précédentes pour ne pas supprimer les streaks
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      for (const notificationRequest of scheduledNotifications) {
        if (notificationRequest.content.data?.type === 'daily_reminder') {
          await Notifications.cancelScheduledNotificationAsync(notificationRequest.identifier);
        }
      }

      const [hours, minutes] = time.split(':').map(Number);

      // Programmer la notification quotidienne
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💪 C'est l'heure des répétitions !",
          body: getRandomMessage(REMINDER_MESSAGES),
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { type: 'daily_reminder' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hours,
          minute: minutes,
        },
      });

      log.info(`Notification quotidienne programmée à ${time}`);
    } catch (error) {
      log.error('Erreur planification notification:', error);
    }
  };

  const sendStreakReminder = async (currentStreak: number) => {
    if (!settings.streakReminder) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: getStreakMessage(currentStreak),
          body: "Ne perdez pas votre série ! Validez votre objectif aujourd'hui.",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { type: 'streak_reminder', streak: currentStreak },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 3600, // Dans 1 heure
          repeats: false,
        },
      });
    } catch (error) {
      log.error('Erreur notification streak:', error);
    }
  };

  const sendCelebration = async (achievement: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: getRandomMessage(CELEBRATION_MESSAGES),
          body: achievement,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { type: 'celebration' },
        },
        trigger: null, // Immédiat
      });
    } catch (error) {
      log.error('Erreur notification célébration:', error);
    }
  };

  const sendAchievementNotification = async (achievementTitle: string, achievementDescription: string, achievementId: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🏆 Objectif débloqué !',
          body: `${achievementTitle} - ${achievementDescription}`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { type: 'achievement', achievementId },
        },
        trigger: null,
      });
    } catch (error) {
      log.error('Erreur notification achievement:', error);
    }
  };

  const sendMotivation = async (message: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💪 Message de motivation",
          body: message,
          sound: true,
          data: { type: 'motivation' },
        },
        trigger: null,
      });
    } catch (error) {
      log.error('Erreur notification motivation:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      log.info('Toutes les notifications annulées');
    } catch (error) {
      log.error('Erreur annulation notifications:', error);
    }
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    saveSettings(updated);
  };

  return {
    expoPushToken,
    notification,
    settings,
    updateSettings,
    sendStreakReminder,
    sendCelebration,
    sendMotivation,
    sendAchievementNotification,
    scheduleDailyReminder,
    cancelAllNotifications,
  };
}

// Fonction pour enregistrer le device pour les push notifications
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      log.info('Permission de notification refusée');
      return;
    }

    try {
      // Tenter d'obtenir le token push
      // Note: Nécessite FCM configuré pour Android
      // Il est recommandé de passer le projectId si vous utilisez EAS
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      log.info('Push token:', token);
    } catch (error) {
      log.warn('Push token non disponible (FCM non configuré):', error);
      // Les notifications locales fonctionneront toujours
    }
  } else {
    log.info('Les notifications push nécessitent un vrai device');
  }

  return token;
}
