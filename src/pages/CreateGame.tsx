import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Box, FormGroup, TextInput, Label, Text
} from '@primer/components';
import Joi from 'joi';
import axios from 'axios';
import ValidatedFormGroup from '../components/ValidatedFormGroup';
import routeTo from '../utils/routeTo';
import { useLanguage, useTranslation } from '../hooks/useTranslation';
import SubmitButton from '../components/SubmitButton';
import useLoggedInUser from '../hooks/useLoggedInUser';
import handleErrors from '../utils/handleErrors';
import checked from '../assets/checked.svg';
import unchecked from '../assets/unchecked.svg';
import { AgeGroup } from '../model/AgeGroup';
import { Tag } from './Tags';

const CreateGame: FC = () => {
  const trans = useTranslation();
  const [selectedLang] = useLanguage();

  const [user] = useLoggedInUser();
  const navigate = useHistory();

  const [loading, setLoading] = useState(false);

  const [nameCs, setNameCs] = useState('');
  const [nameCsError, setNameCsError] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameEnError, setNameEnError] = useState('');

  const [ruleCs, setRuleCs] = useState('');
  const [ruleCsError, setRuleCsError] = useState('');
  const [ruleEn, setRuleEn] = useState('');
  const [ruleEnError, setRuleEnError] = useState('');

  const [min, setMin] = useState<number>();
  const [minError, setMinError] = useState('');
  const [max, setMax] = useState<number>();
  const [maxError, setMaxError] = useState('');

  const [durError, setDurError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [tagsError, setTagsError] = useState('');

  const durationAll = ['<15', '15-30', '30-60', '60+'];
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const ageGroupsAll: AgeGroup[] = ['K', 'S', 'T', 'A'];
  const [selectedAge, setSelectedAge] = useState<AgeGroup[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const clickDur = (duration: string) => {
    setSelectedDuration(duration);
  };
  const clickAge = (age: string) => {
    let newAge = selectedAge;
    if (newAge?.find((element) => element === (age as AgeGroup)) === undefined) {
      newAge?.push(age as AgeGroup);
    } else {
      newAge = newAge.filter((element) => element !== age);
    }
    setSelectedAge([...newAge]);
  };
  const loadTags = () => {
    axios.get(routeTo('/api/tags'))
      .then((response) => {
        const tagStrings = (response.data.tags as Tag[]).sort((a, b) => {
          if (selectedLang === 'cs') {
            return a.nameCs.localeCompare(b.nameCs);
          }
          return a.nameEn.localeCompare(b.nameEn);
        });
        setAllTags(tagStrings);
      })
      .catch((error) => {
        handleErrors(error);
      });
  };
  const clickTag = (tag: Tag) => {
    let newTag = selectedTags;
    if (newTag.find((element) => element === tag) === undefined) {
      newTag.push(tag);
    } else {
      newTag = newTag.filter((element) => element !== tag);
    }
    setSelectedTags([...newTag]);
  };

  const NAME_CS_SCHEMA = Joi.string().min(1).required().error(() => new Error(trans('ErrEmptyName')));
  const NAME_EN_SCHEMA = Joi.string().min(1).required().error(() => new Error(trans('ErrEmptyName')));
  const RULES_CS_SCHEMA = Joi.string().min(1).required().error(() => new Error(trans('ErrEmptyRule')));
  const RULES_EN_SCHEMA = Joi.string().min(1).required().error(() => new Error(trans('ErrEmptyRule')));
  const MIN_SCHEMA = Joi.number().required().error(() => new Error(trans('ErrMin')));
  const MAX_SCHEMA = Joi.number().required().error(() => new Error(trans('ErrMax')));
  const DUR_SCHEMA = Joi.string().min(1).required().error(() => new Error(trans('ErrDuration')));
  const AGE_SCHEMA = Joi.array().min(1).required().error(() => new Error(trans('ErrAge')));
  const TAG_SCHEMA = Joi.array().min(1).required().error(() => new Error(trans('ErrTag')));

  const submit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    const nameCsValidationError = NAME_CS_SCHEMA.validate(nameCs);

    const errors: string[] = [];

    if (nameCsValidationError.error && nameEn.length === 0) {
      setNameCsError(nameCsValidationError.error.message);
      errors.push(nameCsValidationError.error.message);
    } else {
      setNameCsError('');
    }
    const nameEnValidationError = NAME_EN_SCHEMA.validate(nameEn);

    if (nameEnValidationError.error && nameCs.length === 0) {
      setNameEnError(nameEnValidationError.error.message);
      errors.push(nameEnValidationError.error.message);
    } else {
      setNameEnError('');
    }
    const rulesCsValidationError = RULES_CS_SCHEMA.validate(ruleCs);

    if (rulesCsValidationError.error && ruleEn.length === 0) {
      setRuleCsError(rulesCsValidationError.error.message);
      errors.push(rulesCsValidationError.error.message);
    } else {
      setRuleCsError('');
    }
    const rulesEnValidationError = RULES_EN_SCHEMA.validate(ruleEn);

    if (rulesEnValidationError.error && ruleCs.length === 0) {
      setRuleEnError(rulesEnValidationError.error.message);
      errors.push(rulesEnValidationError.error.message);
    } else {
      setRuleEnError('');
    }
    const minValidationError = MIN_SCHEMA.validate(min);

    if (minValidationError.error) {
      setMinError(minValidationError.error.message);
      errors.push(minValidationError.error.message);
    } else {
      setMinError('');
    }
    const maxValidationError = MAX_SCHEMA.validate(max);

    if (maxValidationError.error) {
      setMaxError(maxValidationError.error.message);
      errors.push(maxValidationError.error.message);
    } else {
      setMaxError('');
    }
    const durValidationError = DUR_SCHEMA.validate(selectedDuration);

    if (durValidationError.error) {
      setDurError(durValidationError.error.message);
      errors.push(durValidationError.error.message);
    } else {
      setDurError('');
    }
    const ageValidationError = AGE_SCHEMA.validate(selectedAge);

    if (ageValidationError.error) {
      setAgeError(ageValidationError.error.message);
      errors.push(ageValidationError.error.message);
    } else {
      setAgeError('');
    }
    const tagValidationError = TAG_SCHEMA.validate(selectedTags);

    if (tagValidationError.error) {
      setTagsError(tagValidationError.error.message);
      errors.push(tagValidationError.error.message);
    } else {
      setTagsError('');
    }

    if (errors.length !== 0) {
      setLoading(false);
      return;
    }
    const setupDataPost = () => {
      const players = { min, max };

      const data = {
        nrOfPlayers: players,
        ...nameCs.length > 0 ? { nameCs } : {},
        ...nameEn.length > 0 ? { nameEn } : {},
        ...ruleCs.length > 0 ? { rulesCs: ruleCs } : {},
        ...ruleEn.length > 0 ? { rulesEn: ruleEn } : {},
        ...selectedAge.length > 0 ? { ageGroups: selectedAge } : {},
        ...selectedTags.length > 0 ? { tags: selectedTags.map((el) => el.id) } : {},
        ...{ duration: selectedDuration }
      };
      return data;
    };
    const data = setupDataPost();
    axios.post(routeTo('/api/game'), data, { headers: { Authorization: `Bearer ${user.jwt}` } })
      .then((response) => {
        navigate.push(`/game/${response.data.id}/version/${response.data.version}`);
      })
      .catch((error) => {
        switch (error.response.status) {
          case 409:
            if (error.response.data.message === 'nameEn') {
              alert('exist');
            } else {
              alert('exist');
            }
            break;
          case 404:
            alert(error.response.data.message);
            break;
          default:
            handleErrors(error);
        }
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTags();
  }, []);
  return (
    <Box p={4}>

      <form onSubmit={submit} className="dialog-form">
        <Box sx={{
          width: '100%', display: 'flex', flexDirection: 'row', gap: '10px'
        }}
        >
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <ValidatedFormGroup message={nameCsError}>
              <FormGroup.Label>
                {trans('NameCs')}
              </FormGroup.Label>
              <TextInput
                name="nameCs"
                value={nameCs}
                onChange={(e: any) => setNameCs(e.target.value)}
              />
            </ValidatedFormGroup>
          </Box>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <ValidatedFormGroup message={nameEnError}>
              <FormGroup.Label>
                {trans('NameEn')}
              </FormGroup.Label>
              <TextInput
                name="nameEn"
                value={nameEn}
                onChange={(e: any) => setNameEn(e.target.value)}
              />
            </ValidatedFormGroup>
          </Box>
        </Box>

        <Box sx={{
          width: '100%', display: 'flex', flexDirection: 'row', gap: '10px'
        }}
        >
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <ValidatedFormGroup message={ruleCsError}>
              <FormGroup.Label>
                {trans('RulesCs')}
              </FormGroup.Label>
              <TextInput
                as="TextArea"
                name="ruleCs"
                value={ruleCs}
                onChange={(e: any) => setRuleCs(e.target.value)}
              />
            </ValidatedFormGroup>
          </Box>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <ValidatedFormGroup message={ruleEnError}>
              <FormGroup.Label>
                {trans('RulesEn')}
              </FormGroup.Label>
              <TextInput
                as="TextArea"
                name="ruleEn"
                value={ruleEn}
                onChange={(e: any) => setRuleEn(e.target.value)}
              />
            </ValidatedFormGroup>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px'
        }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <ValidatedFormGroup message={minError}>
              <FormGroup.Label>
                {trans('NumberOfPlayersMin')}
              </FormGroup.Label>
              <TextInput
                name="min"
                value={min}
                onChange={(e: any) => setMin(e.target.value)}
              />
            </ValidatedFormGroup>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <ValidatedFormGroup message={maxError}>
              <FormGroup.Label>
                {trans('NumberOfPlayersMax')}
              </FormGroup.Label>
              <TextInput
                name="max"
                value={max}
                onChange={(e: any) => setMax(e.target.value)}
              />
            </ValidatedFormGroup>
          </Box>
        </Box>

        {/* duration */}
        <ValidatedFormGroup message={durError}>
          <Box>
            <Text>{trans('Duration')}</Text>
          </Box>
          <Box>
            {durationAll.map((dur) => {
              if (dur === selectedDuration) {
                return (
                  <Label variant="xl" className="Label" sx={{ bg: '#2da44e' }} onClick={() => clickDur(dur)}>
                    <img src={checked} height="16" alt={dur} />
                    {dur}
                  </Label>
                );
              }
              return (
                <Label variant="xl" className="Label" sx={{ bg: '#9fa4ab' }} onClick={() => clickDur(dur)}>
                  <img src={unchecked} height="16" alt={dur} />
                  {dur}
                </Label>
              );
            })}

          </Box>
        </ValidatedFormGroup>

        {/* Age */}
        <ValidatedFormGroup message={ageError}>
          <Box>
            <Text>{trans('Age groups')}</Text>
          </Box>
          <Box>
            {ageGroupsAll.map((age) => {
              const translatedAge = trans(age);
              if (selectedAge.includes(age)) {
                return (
                  <Label variant="xl" className="Label" sx={{ bg: '#2da44e' }} onClick={() => clickAge(age)}>
                    <img src={checked} height="16" alt={translatedAge} />
                    {translatedAge}
                  </Label>
                );
              }
              return (
                <Label variant="xl" className="Label" sx={{ bg: '#9fa4ab' }} onClick={() => clickAge(age)}>
                  <img src={unchecked} height="16" alt={translatedAge} />
                  {translatedAge}
                </Label>
              );
            })}
          </Box>
        </ValidatedFormGroup>
        {/* Tags */}
        <ValidatedFormGroup message={tagsError}>
          <Box>
            <Text>{trans('Tags')}</Text>
          </Box>
          <Box>
            {allTags.map((tag) => {
              const tagName = selectedLang === 'cs' ? tag.nameCs : tag.nameEn;
              if (selectedTags.includes(tag)) {
                return (
                  <Label variant="xl" className="Label" sx={{ bg: '#2da44e' }} onClick={() => clickTag(tag)}>
                    <img src={checked} height="16" alt={tagName} />
                    {tagName}
                  </Label>
                );
              }
              return (
                <Label variant="xl" className="Label" sx={{ bg: '#9fa4ab' }} onClick={() => clickTag(tag)}>
                  <img src={unchecked} height="16" alt={tagName} />
                  {tagName}
                </Label>
              );
            })}
          </Box>
        </ValidatedFormGroup>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <SubmitButton loading={loading} />
        </Box>
      </form>

    </Box>
  );
};
export default CreateGame;
