import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiUrl;

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
  },
  EMPLOYEES: {
    GET_ALL: `${BASE_URL}/employees`,
    GET_BY_ID: (id: number) => `${BASE_URL}/employees/${id}`,
    CREATE: `${BASE_URL}/employees/create`,
    UPDATE: (id: number) => `${BASE_URL}/employees/${id}`,
    DELETE: (id: number) => `${BASE_URL}/employees/${id}`,
  },
  TASKS: {
    GET_ALL: `${BASE_URL}/tasks`,
    GET_BY_ID: (id: number) => `${BASE_URL}/tasks/${id}`,
    CREATE: `${BASE_URL}/tasks`,
    UPDATE: (id: number) => `${BASE_URL}/tasks/${id}`,
    DELETE: (id: number) => `${BASE_URL}/tasks/${id}`,
    MARK_DONE: (id: number) => `${BASE_URL}/tasks/${id}/done`,
  },
};
