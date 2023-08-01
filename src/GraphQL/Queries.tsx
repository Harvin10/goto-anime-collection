import { gql } from '@apollo/client';

export const LOAD_ANIME_LIST = gql`
  query ($page: Int) {
    Page (page: $page, perPage: 10) {
      pageInfo {
        lastPage
      }
      media(type: ANIME) {
        id
        title {
          romaji
          native
        }
        episodes
        duration
        genres
        format
        coverImage {
          medium
        }
      }
    }
  }
`