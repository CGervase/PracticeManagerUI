import { HTTP } from './http-common';

const route = '/User';

export default {
    async getUserWithCredentials(credentials) {
        let requestPath = `${route}/login`;
        let body = JSON.stringify({ 
            email: credentials.email,
            password: credentials.password
        });
        let headers = { 'Content-Type': 'application/json' };
        
        let response = await HTTP.post(requestPath, body, { headers: headers });
        return response;
    },
    async addUser(userDetails) {
        let requestPath = `${route}/addUser`;
        let body = JSON.stringify(userDetails);
        let headers = { 'Content-Type': 'application/json' };
        let response = await HTTP.post(requestPath, body, { headers: headers });
        return response;
    },
    async deleteUser(userId) {
        let requestPath = `${route}/deleteUser/${userId}`;
        let response = await HTTP.delete(requestPath);
        return response;
    }
}