import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.ANILIST_API_URL,
  generates: {
    './gql/': {
      preset: 'client',
      plugins: []
    }
  },
  ignoreNoDocuments: true
};

export default config;