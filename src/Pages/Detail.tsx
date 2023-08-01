/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { LOAD_ANIME_LIST } from '../GraphQL/Queries';
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

function Detail() {
  const detailCss = {
    wrapper: css`
      
    `,
  }

  const [animeData, setAnimeData] = useState()

  const { loading, data } = useQuery(LOAD_ANIME_LIST);

  useEffect(() => {
    if (data) {
      const { media, pageInfo } = data.Page;
      setAnimeData(media)
    }
  }, [data])

  return (
    <div css={detailCss.wrapper}>
      test
    </div>
  );
}

export default Detail;
