import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { LOAD_ANIME_LIST } from '../GraphQL/Queries';
import Skeleton from '../Components/Skeleton';

function Home() {
  const { error, loading, data } = useQuery(LOAD_ANIME_LIST);
  const [animeList, setAnimeList] = useState()
  useEffect(() => {
    setAnimeList(data)
  }, [data])
  return (
    <div>
      <Skeleton w="50%" h="100px" />
    </div>
  );
}

export default Home;
