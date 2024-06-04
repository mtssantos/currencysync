import axios from 'axios';

const restcountriesInstance = axios.create({
  baseURL: 'https://restcountries.com/v3.1/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export default restcountriesInstance;
