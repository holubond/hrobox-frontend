import { Dropdown } from '@primer/components';
import React, { useEffect } from 'react';

import Flag from 'react-flagkit';

import { useLanguage } from '../hooks/useTranslation';

const LanguageSwitch = () => {
  const [selectedLang, setLanguage] = useLanguage();
  useEffect(() => {

  }, [selectedLang]);
  return (
    <>
      <Dropdown.Button>{selectedLang === 'cs' ? <Flag country="CZ" /> : <Flag country="GB" />}</Dropdown.Button>
      <Dropdown.Menu direction="sw" sx={{ width: 55 }}>
        <Dropdown.Item>
          <Flag
            country="CZ"
            role="button"
            onClick={() => {
              setLanguage('cs');
              localStorage.setItem('lang', 'cs');
            }}
          />
        </Dropdown.Item>
        <Dropdown.Item>
          <Flag
            country="GB"
            role="button"
            onClick={() => {
              setLanguage('en');
              localStorage.setItem('lang', 'en');
            }}
          />
        </Dropdown.Item>
      </Dropdown.Menu>
    </>
  );
};
export default LanguageSwitch;
