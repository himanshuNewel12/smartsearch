'use client'

import type { NextPage } from 'next';
import SmartSearch from '../components/SmartSearch';

const Home: NextPage = () => {
  return (
    <div className="container mx-auto p-4">
      <SmartSearch />
    </div>
  );
};

export default Home;
