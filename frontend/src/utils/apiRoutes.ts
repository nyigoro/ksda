const API_BASE_URL = '/api';

export const apiRoutes = {
  songs: `${API_BASE_URL}/songs`,
  song: (id: string) => `${API_BASE_URL}/song/${id}`,
  login: `${API_BASE_URL}/login`,
};