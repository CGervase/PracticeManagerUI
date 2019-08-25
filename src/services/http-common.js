import axios from 'axios';

export const HTTP = axios.create({
    baseURL: `${process.env.VUE_APP_API_BASE_URI}:${process.env.VUE_APP_API_PORT}`
})