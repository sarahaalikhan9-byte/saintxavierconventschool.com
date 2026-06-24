import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DICTIONARY } from './utils/locale';

// Convert the existing dictionary into i18next resources format
const resources = {
  en: { translation: {} as Record<string, string> },
  hi: { translation: {} as Record<string, string> },
  ur: { translation: {} as Record<string, string> }
};

Object.keys(DICTIONARY).forEach((key) => {
  resources.en.translation[key] = DICTIONARY[key].en;
  resources.hi.translation[key] = DICTIONARY[key].hi;
  resources.ur.translation[key] = DICTIONARY[key].ur;
});

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('sxc_portal_lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// यह भाग महत्वपूर्ण है - भाषा बदलने पर सभी को notify करेगा
export const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('sxc_portal_lang', lang);
  // Force update सभी components को
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
};

export default i18n;