import React from 'react';
import { Box, Heading, Pagehead } from '@primer/components';
import { useTranslation } from '../hooks/useTranslation';
import RouterLink from '../components/RouterLink';

const Home = () => {
  const trans = useTranslation();

  return (
    <>
      <Pagehead><Heading>{trans('Welcome')}</Heading></Pagehead>
      <Box>{trans('WelcomeSubtext')}</Box>
      <RouterLink to="/games">
        {trans('LetsBegin')}
      </RouterLink>
    </>
  );
};
export default Home;
