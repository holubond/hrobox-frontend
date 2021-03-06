/* eslint-disable no-trailing-spaces */
import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

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
import { Duration } from '../model/Duration';

type Game = {
  id: number,
  version: number,
  nameCs: string,
  nameEn: string,
  createdBy: string,
  rulesCs: string,
  rulesEn: string,
  createdAt: string,
  nrOfPlayers: {
    min: number,
    max: number
  },
  duration: Duration,
  ageGroups: AgeGroup[],
  tagsCs: string[],
  tagsEn: string[]
}
const EditGame: FC = () => {
  const { id, version } = useParams<{ id: string, version: string}>();
  const trans = useTranslation();
  const [selectedLang] = useLanguage();
  const [game, setGame] = useState<Game>();
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
  const [selectedDuration, setSelectedDuration] = useState<string>();
  const ageGroupsAll: AgeGroup[] = ['K', 'S', 'T', 'A'];
  const [selectedAge, setSelectedAge] = useState<AgeGroup[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const initStates = (initgame: Game) => {
    if (initgame) {
      setNameCs(initgame.nameCs);
      setNameEn(initgame.nameEn);
      setRuleCs(initgame.rulesCs);
      setRuleEn(initgame.rulesEn);
      setMin(initgame.nrOfPlayers.min);
      setMax(initgame.nrOfPlayers.max);
      setSelectedDuration(initgame.duration);
      setSelectedAge(initgame.ageGroups);
      let newTag: Tag[];
      if (selectedLang === 'cs') {
        newTag = allTags.filter((element) => initgame.tagsCs.includes(element.nameCs));
      } else {
        newTag = allTags.filter((element) => initgame.tagsEn.includes(element.nameEn));
      }
      setSelectedTags([...newTag]);
    }
  };
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
        setAllTags([...tagStrings]);
      })
      .catch((error) => {
        handleErrors(error);
      });
  };
  const loadDetail = () => {
    setLoading(true);
    const gameRoute = `/${id}/version/${version}`;
    axios.get(routeTo('/api/game') + gameRoute)
      .then((response) => {
        setGame(response.data as Game);
      })
      .catch((error) => {
        handleErrors(error);
      }).finally(() => {
        setLoading(false);
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

    if (nameCsValidationError.error) {
      setNameCsError(nameCsValidationError.error.message);
      errors.push(nameCsValidationError.error.message);
    } else {
      setNameCsError('');
    }
    const nameEnValidationError = NAME_EN_SCHEMA.validate(nameEn);

    if (nameEnValidationError.error) {
      setNameEnError(nameEnValidationError.error.message);
      errors.push(nameEnValidationError.error.message);
    } else {
      setNameEnError('');
    }
    const rulesCsValidationError = RULES_CS_SCHEMA.validate(ruleCs);

    if (rulesCsValidationError.error) {
      setRuleCsError(rulesCsValidationError.error.message);
      errors.push(rulesCsValidationError.error.message);
    } else {
      setRuleCsError('');
    }
    const rulesEnValidationError = RULES_EN_SCHEMA.validate(ruleEn);

    if (rulesEnValidationError.error) {
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
        nameEn,
        nameCs,
        rulesEn: ruleEn,
        rulesCs: ruleCs,
        nrOfPlayers: players,
        ...{ duration: selectedDuration },
        ...selectedAge.length > 0 ? { ageGroups: selectedAge } : {},
        ...selectedTags.length > 0 ? { tags: selectedTags.map((el) => el.id) } : {}
      };
      return data;
    };
    const data = setupDataPost();
    axios.put(`${routeTo('/api/game')}/${id}`, data, { headers: { Authorization: `Bearer ${user.jwt}` } })
      .then((response) => {
        navigate.push(`/game/${id}/version/${response.data.version}`);
      })
      .catch((error) => {
        switch (error.response.status) {
          case 400:
            alert(error.response.data.message);
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
    initStates(game as Game);
  }, [game]);
  useEffect(() => {
    loadTags();
    loadDetail();
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
        <Box sx={{ display: 'flex' }}>
          <SubmitButton loading={loading} />
        </Box>
      </form>
    </Box>
  );
};
export default EditGame;
