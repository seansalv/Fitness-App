import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const requestPermission = async () => {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleDailyReminder = async (hour = 20) => {
  if (Platform.OS === 'web') return;
  const granted = await requestPermission();
  if (!granted) {
    throw new Error('Permission required to schedule reminders.');
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Training arc ping',
      body: 'Complete at least one quest today to keep the streak alive.',
    },
    trigger: {
      hour,
      minute: 0,
      repeats: true,
    },
  });
};

export const cancelReminders = async () => {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
};

