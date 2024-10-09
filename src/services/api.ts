import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://ts.teksystem.com.br:8091',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
