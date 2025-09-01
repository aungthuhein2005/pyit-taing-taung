import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppTheme = 'system' | 'light' | 'dark';
type Language = 'en' | 'mm';

type PreferencesContextValue = {
  isHydrated: boolean;
  onboarded: boolean;
  language: Language;
  theme: AppTheme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: AppTheme) => void;
  completeOnboarding: () => void;
};

const defaultValue: PreferencesContextValue = {
  isHydrated: false,
  onboarded: false,
  language: 'en',
  theme: 'system',
  setLanguage: () => {},
  setTheme: () => {},
  completeOnboarding: () => {},
};

export const PreferencesContext = React.createContext<PreferencesContextValue>(defaultValue);

const STORAGE_KEYS = {
  language: 'pref_language',
  theme: 'pref_theme',
  onboarded: 'onboarded',
};

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [language, setLanguageState] = React.useState<Language>('en');
  const [theme, setThemeState] = React.useState<AppTheme>('system');
  const [onboarded, setOnboarded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const [savedLang, savedTheme, savedOnboarded] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.language),
          AsyncStorage.getItem(STORAGE_KEYS.theme),
          AsyncStorage.getItem(STORAGE_KEYS.onboarded),
        ]);
        if (savedLang === 'en' || savedLang === 'mm') setLanguageState(savedLang);
        if (savedTheme === 'system' || savedTheme === 'light' || savedTheme === 'dark') setThemeState(savedTheme);
        setOnboarded(savedOnboarded === 'true');
      } catch {}
      setIsHydrated(true);
    })();
  }, []);

  const setLanguage = React.useCallback(async (lang: Language) => {
    setLanguageState(lang);
    try { await AsyncStorage.setItem(STORAGE_KEYS.language, lang); } catch {}
  }, []);

  const setTheme = React.useCallback(async (t: AppTheme) => {
    setThemeState(t);
    try { await AsyncStorage.setItem(STORAGE_KEYS.theme, t); } catch {}
  }, []);

  const completeOnboarding = React.useCallback(async () => {
    setOnboarded(true);
    try { await AsyncStorage.setItem(STORAGE_KEYS.onboarded, 'true'); } catch {}
  }, []);

  const value = React.useMemo<PreferencesContextValue>(() => ({
    isHydrated,
    onboarded,
    language,
    theme,
    setLanguage,
    setTheme,
    completeOnboarding,
  }), [isHydrated, onboarded, language, theme, setLanguage, setTheme, completeOnboarding]);

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
};

export const usePreferences = () => React.useContext(PreferencesContext);


