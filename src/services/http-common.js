import axios from 'axios';

export const practiceMgrHTTP = axios.create({
    baseURL: process.env.VUE_APP_PRACTICE_API_BASE_URI
})

export const userHTTP = axios.create({
    baseURL: process.env.VUE_APP_USER_API_BASE_URI
})