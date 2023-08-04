import { gql } from '@apollo/client';

export const LOAD_ANIME_LIST = gql`
  query ($page: Int, $search: [Int]) {
    Page (page: $page, perPage: 10) {
      pageInfo {
        lastPage
      }
      media(type: ANIME, id_in: $search) {
        id
        coverImage {
          medium
        }
        duration
        episodes
        format
        genres
        title {
          romaji
          native
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
      bannerImage
      coverImage {
        color
        medium
        large
      }
      description
      duration
      episodes
      format
      genres
    }
  }
`;

export const LOAD_ANIME_LIST_BANNER = gql`
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