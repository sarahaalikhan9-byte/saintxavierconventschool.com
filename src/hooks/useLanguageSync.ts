import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * This hook synchronizes language changes across all pages.
 * When the language is changed, it listens to the custom event 
 * and force-syncs i18next's state to trigger a re-render.
 */
export function useLanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ lang: string }>;
      // Get language from event detail or fallback to localStorage
      const newLang = customEvent.detail?.lang || localStorage.getItem('sxc_portal_lang');

      if (newLang && newLang !== i18n.language) {
        i18n.changeLanguage(newLang);
      }
    };

    // Listen to the language change event (Matches the event dispatched in i18n.ts)
    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
}
