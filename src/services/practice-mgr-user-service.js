import { practiceMgrHTTP } from './http-common';

const route = '/User';

export default {
    async getUserData(userId) {
        let requestPath = `${route}?userId=${userId}`;
        let response = await practiceMgrHTTP.get(requestPath);
        return response;
    },
    async addUser(practiceMgrUserDetails) {
        let requestPath = `${route}/addUser`;
        let body = JSON.stringify(practiceMgrUserDetails);
        let headers = { 'Content-Type': 'application/json' };
        let response = await practiceMgrHTTP.post(requestPath, body, { headers: headers });
        return response;
    },
    async updateBandName(userId, bandName) {
        let requestPath = `${route}?userId=${userId}`;
        let body = JSON.stringify({ bandName: bandName });
        let headers = { 'Content-Type': 'application/json' };
        let response = await practiceMgrHTTP.put(requestPath, body, { headers: headers });
        return response;
    }
}