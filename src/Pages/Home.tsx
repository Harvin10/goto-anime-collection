/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { LOAD_ANIME_LIST } from '../GraphQL/Queries';
import { css } from '@emotion/react';
import AnimeCard from '../Components/AnimeCard';
import Pagination from '../Components/Pagination';

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
    pagination: css`
      display: flex;
      justify-content: end;
      margin-top: 16px;
    `,
  }

  const [animeList, setAnimeList] = useState(new Array(5).fill(''))
  const [paginationInfo, setPaginationInfo] = useState(0)
  const [currPage, setCurrPage] = useState(1)

  const { loading, data, refetch } = useQuery(LOAD_ANIME_LIST, {
    variables: {
      page: currPage
    }
  });

  useEffect(() => {
    if (data) {
      const { media, pageInfo } = data.Page;
      setAnimeList(media)
      setPaginationInfo(pageInfo.lastPage)
    }
  }, [data])

  useEffect(() => {
    refetch({ page: currPage })
  }, [currPage])

  const renderAnimeList = () => {
    return animeList.map((anime, idx) => {
      const {
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
      {!loading ?
        <div css={homeCss.pagination}>
          <Pagination
            currentPage={currPage}
            lastPage={paginationInfo}
            onChangePage={setCurrPage}
          />
        </div>
        : null}
    </div>
  );
}

export default Home;
