import * as Localization from 'expo-localization';
import { getLocales } from "expo-localization";
import { I18n } from 'i18n-js';

// Importer les fichiers de traduction
import en from './locales/en.json';
import fr from './locales/fr.json';
import it from './locales/it.json';

export const deviceLanguage = getLocales()?.[0]?.languageCode ?? "en";

export const i18n = new I18n({
  en,
  fr,
  it,
});

i18n.defaultLocale = deviceLanguage;

i18n.locale = deviceLanguage;

export default i18n