import { Box, Dropdown } from '@primer/components';
import React, { useEffect } from 'react';

import Flag from 'react-flagkit';

import { useLanguage } from '../hooks/useTranslation';
import localization from '../localization';

export type Languages = keyof typeof localization;

const LanguageSwitch = () => {
  const [selectedLang, setLanguage] = useLanguage();
  const clickEvent = (language: Languages) => {
    setLanguage(language);
    localStorage.setItem('lang', language);
  };

  useEffect(() => {

  }, [selectedLang]);
  return (
    <Dropdown>
      <summary>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          {selectedLang === 'cs' ? <Flag country="CZ" /> : <Flag country="GB" />}
          <Dropdown.Caret />
        </Box>
      </summary>
      <Dropdown.Menu direction="sw" sx={{ width: 55 }}>
        <Dropdown.Item
          onClick={() => {
            clickEvent('cs');
          }}
          sx={{ cursor: 'pointer' }}
        >
          <Flag
            country="CZ"
            role="button"
          />
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            clickEvent('en');
          }}
          sx={{ cursor: 'pointer' }}
        >
          <Flag
            country="GB"
            role="button"
          />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default LanguageSwitch;
