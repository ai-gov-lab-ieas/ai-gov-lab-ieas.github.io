import React from 'react';
import { Hero } from '../components/Hero';
import { Activities } from '../components/Activities';
import { Mission } from '../components/Mission';
import { Team } from '../components/Team';
import { Lang } from '../data/content';

interface HomePageProps {
  lang: Lang;
}

export const HomePage: React.FC<HomePageProps> = ({ lang }) => {
  return (
    <main>
      <Hero lang={lang} />
      <Activities lang={lang} />
      <Mission lang={lang} />
      <Team lang={lang} />
    </main>
  );
};
