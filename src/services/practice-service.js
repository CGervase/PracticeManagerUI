import { practiceMgrHTTP } from './http-common';

const route = '/Practice';

export default {
    async addPractice(userId, practice) {
        let requestPath = `${route}/addPractice/${userId}`;
        let body = JSON.stringify(practice);
        let headers = { 'Content-Type': 'application/json' };
        let response = await practiceMgrHTTP.put(requestPath, body, { headers: headers });
        return response;
    },
    async deletePractice(userId, practiceId) {
        let requestPath = `${route}/deletePractice/${userId}/${practiceId}`;
        let response = await practiceMgrHTTP.delete(requestPath);
        return response;
    }
}