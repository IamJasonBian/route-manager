import { useState, useEffect } from 'react';
import { Bell, BellRing, X, Trash2, Plus } from 'lucide-react';
import {
  PriceAlert,
  getAlerts,
  addAlert,
  removeAlert,
  toggleAlert,
  resetTriggeredAlert,
  requestNotificationPermission,
  getNotificationPermission,
  isNotificationSupported,
  formatAlertPrice,
} from '../services/notificationService';

interface AlertManagerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAssetId?: string;
  defaultAssetName?: string;
  currentPrices: Record<string, number>;
}

export default function AlertManager({
  isOpen,
  onClose,
  defaultAssetId,
  defaultAssetName,
  currentPrices,
}: AlertManagerProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [newAlert, setNewAlert] = useState({
    assetId: defaultAssetId || 'bitcoin',
    assetName: defaultAssetName || 'Bitcoin',
    type: 'above' as 'above' | 'below',
    targetPrice: '',
  });

  useEffect(() => {
    setAlerts(getAlerts());
    setPermission(getNotificationPermission());
  }, [isOpen]);

  useEffect(() => {
    if (defaultAssetId && defaultAssetName) {
      setNewAlert(prev => ({
        ...prev,
        assetId: defaultAssetId,
        assetName: defaultAssetName,
        targetPrice: currentPrices[defaultAssetId]?.toString() || '',
      }));
    }
  }, [defaultAssetId, defaultAssetName, currentPrices]);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted ? 'granted' : 'denied');
  };

  const handleAddAlert = () => {
    if (!newAlert.targetPrice) return;

    const alert = addAlert({
      assetId: newAlert.assetId,
      assetName: newAlert.assetName,
      type: newAlert.type,
      targetPrice: parseFloat(newAlert.targetPrice),
      enabled: true,
    });

    setAlerts([...alerts, alert]);
    setNewAlert(prev => ({ ...prev, targetPrice: '' }));
  };

  const handleRemoveAlert = (id: string) => {
    removeAlert(id);
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleToggleAlert = (id: string) => {
    toggleAlert(id);
    setAlerts(alerts.map(a => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  };

  const handleResetAlert = (id: string) => {
    resetTriggeredAlert(id);
    setAlerts(alerts.map(a => (a.id === id ? { ...a, triggered: false } : a)));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">Price Alerts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Permission Banner */}
          {!isNotificationSupported() ? (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                Push notifications are not supported in your browser.
              </p>
            </div>
          ) : permission !== 'granted' ? (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700 mb-2">
                Enable notifications to receive price alerts.
              </p>
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700"
              >
                Enable Notifications
              </button>
            </div>
          ) : null}

          {/* Add New Alert */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Create New Alert</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={newAlert.assetId}
                  onChange={(e) => {
                    const assetName = e.target.options[e.target.selectedIndex].text;
                    setNewAlert(prev => ({
                      ...prev,
                      assetId: e.target.value,
                      assetName,
                      targetPrice: currentPrices[e.target.value]?.toString() || '',
                    }));
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="bitcoin">Bitcoin (BTC)</option>
                  <option value="sp500">S&P 500 (SPY)</option>
                </select>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value as 'above' | 'below' }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                    placeholder="Target price"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <button
                  onClick={handleAddAlert}
                  disabled={!newAlert.targetPrice || permission !== 'granted'}
                  className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {currentPrices[newAlert.assetId] && (
                <p className="text-xs text-gray-500">
                  Current price: {formatAlertPrice(currentPrices[newAlert.assetId])}
                </p>
              )}
            </div>
          </div>

          {/* Existing Alerts */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Your Alerts</h3>
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No alerts yet</p>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.triggered
                        ? 'bg-green-50 border-green-200'
                        : alert.enabled
                        ? 'bg-white border-gray-200'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className={`w-4 h-4 ${alert.triggered ? 'text-green-600' : 'text-gray-400'}`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {alert.assetName} {alert.type} {formatAlertPrice(alert.targetPrice)}
                          </p>
                          {alert.triggered && (
                            <p className="text-xs text-green-600">Triggered!</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {alert.triggered ? (
                          <button
                            onClick={() => handleResetAlert(alert.id)}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            Reset
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleAlert(alert.id)}
                            className={`px-2 py-1 text-xs rounded ${
                              alert.enabled
                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {alert.enabled ? 'On' : 'Off'}
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveAlert(alert.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
