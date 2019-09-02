import { userHTTP } from './http-common';

const route = '/User';

export default {
    async getUserWithCredentials(credentials) {
        let requestPath = `${route}/login`;
        let body = JSON.stringify({ 
            email: credentials.email,
            password: credentials.password
        });
        let headers = { 'Content-Type': 'application/json' };
        
        let response = await userHTTP.post(requestPath, body, { headers: headers });
        return response;
    },
    async addUser(userCredentials) {
        let requestPath = `${route}/addUser`;
        let body = JSON.stringify(userCredentials);
        let headers = { 'Content-Type': 'application/json' };
        let response = await userHTTP.post(requestPath, body, { headers: headers });
        return response;
    }
}