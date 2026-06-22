import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n'; // Path apne hisab se sahi kar lein

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2 p-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('hi')}
        className={`px-3 py-1 rounded ${i18n.language === 'hi' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        हिंदी
      </button>
      <button
        onClick={() => changeLanguage('ur')}
        className={`px-3 py-1 rounded ${i18n.language === 'ur' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        اردو
      </button>
    </div>
  );
}
