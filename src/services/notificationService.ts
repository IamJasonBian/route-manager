// Push Notification Service for Price Alerts

export interface PriceAlert {
  id: string;
  assetId: string;
  assetName: string;
  type: 'above' | 'below';
  targetPrice: number;
  enabled: boolean;
  createdAt: number;
  triggered?: boolean;
}

const ALERTS_STORAGE = 'price_alerts';
const NOTIFICATION_PERMISSION = 'notification_permission';

// Check if notifications are supported
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

// Get current permission status
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    localStorage.setItem(NOTIFICATION_PERMISSION, permission);
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
}

// Send a notification
export function sendNotification(title: string, options?: NotificationOptions): void {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    console.warn('Cannot send notification: permission not granted');
    return;
  }

  try {
    const notification = new Notification(title, {
      icon: '/bitcoin-icon.png',
      badge: '/bitcoin-icon.png',
      ...options,
    });

    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

// Alert management
export function getAlerts(): PriceAlert[] {
  const stored = localStorage.getItem(ALERTS_STORAGE);
  return stored ? JSON.parse(stored) : [];
}

export function saveAlerts(alerts: PriceAlert[]): void {
  localStorage.setItem(ALERTS_STORAGE, JSON.stringify(alerts));
}

export function addAlert(alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>): PriceAlert {
  const alerts = getAlerts();
  const newAlert: PriceAlert = {
    ...alert,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    triggered: false,
  };
  alerts.push(newAlert);
  saveAlerts(alerts);
  return newAlert;
}

export function removeAlert(id: string): void {
  const alerts = getAlerts().filter(a => a.id !== id);
  saveAlerts(alerts);
}

export function toggleAlert(id: string): void {
  const alerts = getAlerts().map(a =>
    a.id === id ? { ...a, enabled: !a.enabled } : a
  );
  saveAlerts(alerts);
}

export function resetTriggeredAlert(id: string): void {
  const alerts = getAlerts().map(a =>
    a.id === id ? { ...a, triggered: false } : a
  );
  saveAlerts(alerts);
}

// Check alerts against current prices
export function checkAlerts(prices: Record<string, number>): PriceAlert[] {
  const alerts = getAlerts();
  const triggeredAlerts: PriceAlert[] = [];

  const updatedAlerts = alerts.map(alert => {
    if (!alert.enabled || alert.triggered) return alert;

    const currentPrice = prices[alert.assetId];
    if (currentPrice === undefined) return alert;

    let shouldTrigger = false;
    if (alert.type === 'above' && currentPrice >= alert.targetPrice) {
      shouldTrigger = true;
    } else if (alert.type === 'below' && currentPrice <= alert.targetPrice) {
      shouldTrigger = true;
    }

    if (shouldTrigger) {
      triggeredAlerts.push(alert);
      sendNotification(
        `${alert.assetName} Price Alert`,
        {
          body: `${alert.assetName} is now ${alert.type === 'above' ? 'above' : 'below'} $${alert.targetPrice.toLocaleString()}. Current price: $${currentPrice.toLocaleString()}`,
          tag: alert.id,
          requireInteraction: true,
        }
      );
      return { ...alert, triggered: true };
    }

    return alert;
  });

  saveAlerts(updatedAlerts);
  return triggeredAlerts;
}

// Format price for display
export function formatAlertPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}
