import axios from 'axios';

export const http = axios.create({
  timeout: 10_000,
  // headers comuns se precisar
});

// interceptor simples de erro
http.interceptors.response.use(
  (res) => res,
  (err) => {
    // padroniza erro
    const status = err.response?.status;
    const data = err.response?.data;
    const msg = `[HTTP ${status}] ${err.config?.method?.toUpperCase()} ${err.config?.url}`;
    return Promise.reject(new Error(`${msg} - ${JSON.stringify(data)}`));
  }
);
