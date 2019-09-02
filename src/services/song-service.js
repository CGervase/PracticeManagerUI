import { practiceMgrHTTP } from './http-common';

const route = '/Song';

export default {
    async addSong(userId, song) {
        let requestPath = `${route}/addSong/${userId}`;
        let body = JSON.stringify(song);
        let headers = { 'Content-Type': 'application/json' };
        let response = await practiceMgrHTTP.put(requestPath, body, { headers: headers });
        return response;
    },
    async deleteSong(userId, songId) {
        let requestPath = `${route}/deleteSong/${userId}/${songId}`;
        let response = await practiceMgrHTTP.delete(requestPath);
        return response;
    },
    async editSong(userId, songId, newName) {
        let requestPath = `${route}/editSongName/${userId}/${songId}`;
        let body = JSON.stringify({newName});
        let headers = { 'Content-Type': 'application/json' };
        let response = await practiceMgrHTTP.put(requestPath, body, { headers: headers });
        return response;
    },
    async toggleSongNeedsPractice(userId, songId) {
        let requestPath = `${route}/toggleSongNeedsPractice/${userId}/${songId}`;
        let response = await practiceMgrHTTP.put(requestPath);
        return response;
    }
}