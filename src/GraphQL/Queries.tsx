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
`;

export const LOAD_ANIME_DETAIL = gql`
  query ($id: Int) {
    Media(type: ANIME, id: $id) {
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
        color
        medium
        large
      }
      bannerImage
    }
  }
`;

export const LOAD_ANIME_COLLECTION_LIST = gql`
  query ($search: [Int]) {
    Page {
      media(type: ANIME, id_in: $search) {
        id
        coverImage {
          medium
        }
      }
    }
  }
`;