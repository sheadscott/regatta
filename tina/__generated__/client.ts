import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '43c8689586b39f481e47c221f444b47be21d4fe0', queries,  });
export default client;
  