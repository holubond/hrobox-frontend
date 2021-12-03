import React,
{
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState
} from 'react';

import localization from '../localization';

type Languages = keyof typeof localization;
type LocalizationKeys = keyof typeof localization[Languages];
type LanguageState = [Languages, Dispatch<SetStateAction<Languages>>];

const LanguageContext = createContext<LanguageState>(undefined as never);

export const LanguageProvider: FC = ({ children }) => {
  const languageState = useState<Languages>((localStorage.getItem('lang') === null) ? 'cs' : localStorage.getItem('lang') as Languages);
  return (
    <LanguageContext.Provider value={languageState}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const useTranslation = () => {
  const [language] = useContext(LanguageContext);
  return (key: LocalizationKeys) => localization[language][key];
};
