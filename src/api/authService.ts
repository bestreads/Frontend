import axios from 'axios';

const API_BASE_URL = '/api/v1';

interface AuthResponse {
  message?: string;
}

/**
 * Loggt einen Benutzer ein.
 * @param email - Email des Benutzers
 * @param password - Passwort des Benutzers
 * @returns Die Response-Daten vom Server
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return response.data;
};

/**
 * Loggt den aktuellen Benutzer aus.
 * @returns Die Response-Daten vom Server
 */
export const logout = async (): Promise<AuthResponse> => {
  const response = await axios.post(`${API_BASE_URL}/auth/logout`, null, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Erneuert das Auth-Token des Benutzers.
 * @returns Die Response-Daten vom Server
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Erstellt einen neuen Benutzer.
 * @param email - Email des Benutzers
 * @param username - Username des Benutzers
 * @param password - Passwort des Benutzers
 * @returns Die Response-Daten vom Server
 */
export const createUser = async (email: string, username: string, password: string): Promise<AuthResponse> => {
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('username', username);
  params.append('password', password);

  const response = await axios.post(`${API_BASE_URL}/user`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};
