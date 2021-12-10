import React, { useEffect, useState } from 'react';
import {
  Box, Button, FormGroup, SelectMenu, Spinner, TextInput, Token
} from '@primer/components';
import axios from 'axios';
import { SyncIcon } from '@primer/octicons-react';
import routeTo from '../utils/routeTo';
import handleErrors from '../utils/handleErrors';
import GamesTable from '../components/GamesTable';
import SubmitButton from '../components/SubmitButton';
import { Tag } from './Tags';
import { useLanguage, useTranslation } from '../hooks/useTranslation';
import useLoggedInUser from '../hooks/useLoggedInUser';
import RouterLink from '../components/RouterLink';
import { allowedDurations, Duration } from '../model/Duration';
import SelectValues from '../components/SelectValues';
import checked from '../assets/checked.svg';
import unchecked from '../assets/unchecked.svg';
import { AgeGroup } from '../model/AgeGroup';

export type Game = {
  id: number,
  version: number,
  name: string,
  createdBy: string,
  createdAt: string,
  nrOfPlayers: {
    min: number,
    max: number
  },
  duration: Duration,
  ageGroups: AgeGroup[],
  tags: string[]
};
const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  }, [loading]);
  const [selectedLang] = useLanguage();
  const trans = useTranslation();
  const [user] = useLoggedInUser();

  const [name, setName] = useState('');
  const [players, setPlayers] = useState<number>();
  const [author, setAuthor] = useState('');
  const [selectedDurations, setSelectedDurations] = useState<Duration[]>([]);
  const ageGroupsAll = ['K', 'S', 'T', 'A'];
  const [selectedAge, setSelectedAge] = useState<AgeGroup[]>([]);
  const [tagFilter, setTagFilter] = useState('');
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [allRemainingTags, setAllRemainingTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const mapAgeGr = (ageGroup: AgeGroup) => {
    if (ageGroup === 'K') {
      return trans('Kindergarden');
    } if (ageGroup === 'S') {
      return trans('School');
    } if (ageGroup === 'T') {
      return trans('Teenager');
    }
    return trans('Adult');
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
  const clickDurDel = (dur: Duration) => setSelectedDurations(
    selectedDurations.filter((old) => old !== dur)
  );
  const clickAgeDel = (age: AgeGroup) => setSelectedAge(selectedAge.filter((old) => old !== age));

  const tagFilterChange = (e: any) => {
    let newFilteredTags: Tag[];
    if ((e.target.value as string).length > tagFilter.length) {
      setTagFilter(e.target.value);
      newFilteredTags = allRemainingTags.filter(
        (tag) => {
          if (selectedLang === 'cs') {
            return tag.nameCs.toUpperCase().indexOf(e.target.value.toUpperCase()) >= 0;
          }
          return tag.nameEn.toUpperCase().indexOf(e.target.value.toUpperCase()) >= 0;
        }
      );
    } else {
      setTagFilter(e.target.value);
      newFilteredTags = allTags.filter(
        (tag) => {
          if (selectedLang === 'cs') {
            return tag.nameCs.toUpperCase().indexOf(e.target.value.toUpperCase()) >= 0;
          }
          return tag.nameEn.toUpperCase().indexOf(e.target.value.toUpperCase()) >= 0;
        }
      );
    }
    setAllRemainingTags(newFilteredTags);
  };
  const setupFilterPost = () => {
    const ageGroup = { matchAll: true, values: selectedAge };
    const tags = { matchAll: true, values: selectedTags.map((e) => e.id) };
    const filter = {
      lang: selectedLang,
      ...author.length > 0 ? { author } : {},
      ...name.length > 0 ? { name } : {},
      ...selectedAge.length > 0 ? { ageGroup } : {},
      ...selectedDurations.length > 0 ? { duration: selectedDurations } : {},
      ...selectedTags.length > 0 ? { tags } : {},
      ...players ? { nrOfPlayers: players } : {}
    };
    return filter;
  };

  const getFilteredGames = (e: any) => {
    e.preventDefault();
    setLoading(true);
    const filter = setupFilterPost();
    axios.post(routeTo('/api/games'), filter)
      .then((response) => {
        setGames(response.data as Game[]);
      })
      .catch((error) => {
        handleErrors(error);
      }).finally(() => {
        setLoading(false);
      });
  };
  const getAllGames = () => {
    setLoading(true);
    axios.post(routeTo('/api/games'), { lang: selectedLang })
      .then((response) => {
        setGames(response.data as Game[]);
      })
      .catch((error) => {
        handleErrors(error);
      });
    axios.get(routeTo('/api/tags'))
      .then((response) => {
        const tagStrings = (response.data.tags as Tag[]).sort((a, b) => {
          if (selectedLang === 'cs') {
            return a.nameCs.localeCompare(b.nameCs);
          }
          return a.nameEn.localeCompare(b.nameEn);
        });
        setAllTags(tagStrings);
        setAllRemainingTags(tagStrings);
      })
      .catch((error) => {
        handleErrors(error);
      }).finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getAllGames();
  }, []);
  useEffect(() => {
    getAllGames();
  }, [selectedLang]);
  useEffect(() => {
  }, [setSelectedDurations]);
  return (
    <>
      {(user.role === 'Verified' || user.role === 'Admin') ? (
        <Box>
          <RouterLink to="/game/add">{trans('CreateGame')}</RouterLink>
        </Box>
      ) : ('')}
      <Box sx={{
        width: '100%', display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', alignItems: 'flex-start'
      }}
      >
        <form onSubmit={getFilteredGames} className="display-contents">
          {/* Name contain */}
          <FormGroup sx={{ margin: '0' }}>
            <TextInput
              placeholder={trans('Name contains')}
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
          </FormGroup>

          {/* duration */}
          <SelectValues
            header={trans('Duration')}
            allowedValues={allowedDurations}
            values={selectedDurations}
            setValues={setSelectedDurations}
          />

          {/* Age */}
          <SelectValues
            header={trans('Age groups')}
            allowedValues={ageGroupsAll}
            values={selectedAge}
            setValues={setSelectedAge}
            mapValues={trans}
          />

          {/* number of players */}
          <FormGroup sx={{ margin: '0' }}>
            <TextInput
              placeholder={trans('Number of players')}
              value={players}
              onChange={(e: any) => setPlayers(e.target.value)}
            />
          </FormGroup>

          {/* Tags */}
          <FormGroup sx={{ margin: '0' }}>
            <SelectMenu>
              <Button as="summary">{trans('Tags')}</Button>
              <SelectMenu.Modal>
                <SelectMenu.Header>{trans('Tags')}</SelectMenu.Header>
                <SelectMenu.Filter placeholder={trans('Filter tags')} value={tagFilter} onChange={(e: any) => tagFilterChange(e)} aria-label="Tags" />
                <SelectMenu.List>
                  {allRemainingTags.map((tag) => (
                    <SelectMenu.Item onClick={(e) => { e.preventDefault(); clickTag(tag); }}>
                      {selectedTags.includes(tag) ? (
                        <img src={checked} height="16" alt="selected" />
                      ) : (
                        <img src={unchecked} height="16" alt="not selected" />
                      )}
                      {selectedLang === 'cs' ? tag.nameCs : tag.nameEn}
                    </SelectMenu.Item>
                  ))}
                </SelectMenu.List>
              </SelectMenu.Modal>
            </SelectMenu>
          </FormGroup>

          {/* Author contain */}
          <FormGroup sx={{ margin: '0' }}>
            <TextInput
              placeholder={trans("Author's name contains")}
              value={author}
              onChange={(e: any) => setAuthor(e.target.value)}
            />
          </FormGroup>

          <SubmitButton loading={loading}>
            <SyncIcon size={16} />
          </SubmitButton>

        </form>
      </Box>
      <Box sx={{
        width: '100%', display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', alignItems: 'flex-start'
      }}
      >
        {selectedDurations.map((dur) => (
          <Token
            text={dur}
            onRemove={() => {
              clickDurDel(dur);
            }}
          />
        ))}
        {selectedAge.map((age) => (
          <Token
            text={mapAgeGr(age as AgeGroup)}
            onRemove={() => {
              clickAgeDel(age);
            }}
          />
        ))}
        {selectedTags.map((tag) => (
          <Token
            text={selectedLang === 'cs' ? tag.nameCs : tag.nameEn}
            onRemove={() => {
              clickTag(tag);
            }}
          />
        ))}
      </Box>
      <Box sx={{ width: '99%', display: 'flex', flexDirection: 'column' }}>
        {loading
          ? (
            <Spinner size="large" marginX="50%" marginY="22%" color="Black" />
          )
          : <GamesTable gamesData={games} /> }
      </Box>
    </>
  );
};
export default Games;
