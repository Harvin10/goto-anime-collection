/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { LOAD_ANIME_LIST } from '../GraphQL/Queries';
import { css } from '@emotion/react';
import AnimeCard from '../Components/AnimeCard';

function Home() {
  const homeCss = {
    wrapper: css`
      min-height: 100vh;
      background-color: whitesmoke;
      padding: 16px;
    `,
    animeListWrapper: css`
      display: flex;
      flex-direction: column;
      gap: 8px;
    `,
  }

  const [animeList, setAnimeList] = useState(new Array(10).fill(''))
  const [paginationInfo, setPaginationInfo] = useState({})
  const [nextPage, setNextPage] = useState(1)

  const { error, loading, data } = useQuery(LOAD_ANIME_LIST, {
    variables: {
      page: nextPage
    }
  });

  useEffect(() => {
    if (data) {
      const { media, pageInfo } = data.Page;
      setAnimeList(media)
      setPaginationInfo(pageInfo.lastPage)
    }
  }, [data])

  const renderAnimeList = () => {
    return animeList.map((anime, idx) => {
      const {
        id,
        coverImage,
        episodes,
        duration,
        format,
        genres,
        title
      } = anime;

      return (
        <AnimeCard
          key={idx}
          data={{
            episodes,
            duration,
            format,
            genres: genres || [],
            image: coverImage?.medium,
            title: title,
          }}
          isLoading={loading}
        />
      )
    })
  }

  return (
    <div css={homeCss.wrapper}>
      <div css={homeCss.animeListWrapper}>
        {renderAnimeList()}
      </div>
    </div>
  );
}

export default Home;
