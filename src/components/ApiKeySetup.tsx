import { useState } from 'react';
import { Key, ExternalLink, X, Check } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey, clearStoredApiKey } from '../services/assetService';

interface ApiKeySetupProps {
  onKeySet: (key: string | null) => void;
}

export default function ApiKeySetup({ onKeySet }: ApiKeySetupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(getStoredApiKey() || '');
  const [saved, setSaved] = useState(!!getStoredApiKey());

  const handleSave = () => {
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim());
      setSaved(true);
      onKeySet(apiKey.trim());
    }
  };

  const handleClear = () => {
    clearStoredApiKey();
    setApiKey('');
    setSaved(false);
    onKeySet(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          saved
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Key className="w-4 h-4" />
        {saved ? 'API Key Set' : 'Add API Key'}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">S&P 500 API Key</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            To display S&P 500 data, you need a free API key from Alpha Vantage.
          </p>

          <a
            href="https://www.alphavantage.co/support/#api-key"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4"
          >
            Get your free API key here
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="space-y-3">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setSaved(false);
              }}
              placeholder="Enter your API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                Save Key
              </button>
              {saved && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
