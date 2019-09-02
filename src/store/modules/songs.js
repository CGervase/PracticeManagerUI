import SongService from '../../services/song-service';

const songs = {
	namespaced: true,
	state: {
		songs: []
	},
	getters: {},
	mutations: {
		setSongs(state, songs) {
			state.songs = songs;
		},
		addSong(state, song) {
			state.songs.push(song);
		},
		deleteSong(state, songId) {
			state.songs = state.songs.filter(song => { return song.id !== songId; });
		},
		editSongName(state, editSongParams) {
			let song = state.songs.find(s => s.id === editSongParams.songId);
			song.name = editSongParams.newName;
		},
		setSongNeedsPractice(state, songId) {
			let song = state.songs.find(s => s.id === songId);
			song.needsPractice = !song.needsPractice;
		}
	},
	actions: {
		async addSongToUser({ commit, rootState }, song) {
			commit('app/setLoading', true, {root: true});
			
			let userId = rootState.user.userId;

			if (userId !== 'guest') {
				await SongService.addSong(userId, song)
					.then(response => {
						if (response.status == 201) {
							commit('addSong', response.data);
							commit('app/setSnackbar', {color: 'success', text: 'Song successfully added.'}, {root: true});
						} else {
							throw new Error();
						}
					}).catch(error => {
						// eslint-disable-next-line
						console.error(error);
						commit('app/setSnackbar', {color: 'error', text: 'Something went wrong, please try again.'}, {root: true});
					});
			} else {
				try {
					commit('addSong', song);
					commit('app/setSnackbar', {color: 'success', text: 'Song successfully added.'}, {root: true});
				} catch(error) {
					// eslint-disable-next-line
					console.error(error);
					commit('app/setSnackbar', {color: 'error', text: 'Something went wrong, please try again.'}, {root: true});
				}
			}

			commit('app/setLoading', false, {root: true});
		},
		async deleteSongFromUser({ commit, rootState }, songId) {
			commit('app/setLoading', true, {root: true});

			let userId = rootState.user.userId;

			if (userId !== 'guest') {
				await SongService.deleteSong(userId, songId)
					.then(response => {
						if (response.status == 204) {
							commit('deleteSong', songId);
							commit('app/setSnackbar', {color: 'success', text: 'Song successfully removed.'}, {root: true});
						} else {
							throw new Error();
						}
					}).catch(error => {
						// eslint-disable-next-line
						console.error(error);
						commit('app/setSnackbar', {color: 'error', text: 'Something went wrong, please try again.'}, {root: true});
					});
			} else {
				try {
					commit('deleteSong', songId);
					commit('app/setSnackbar', {color: 'success', text: 'Song successfully removed.'}, {root: true});
				} catch(error) {
					// eslint-disable-next-line
					console.error(error);
					commit('app/setSnackbar', {color: 'error', text: 'Something went wrong, please try again.'}, {root: true});
				}
			}

			commit('app/setLoading', false, {root: true});
		},
		async editSong({ commit, rootState }, { songId, newName }) {
			commit('app/setLoading', true, {root: true});
			let userId = rootState.user.userId;

			if (userId !== 'guest') {
				await SongService.editSong(userId, songId, newName)
					.then(response => {
						if (response.status == 204) {
							commit('editSongName', {songId: songId, newName: newName});
							commit('app/setSnackbar', {color: 'success', text: 'Song successfully updated.'}, {root: true});
						} else {
							throw new Error();
						}
					}).catch(error => {
						// eslint-disable-next-line
						console.error(error);
						commit('app/setSnackbar', {color: 'error', text: 'Something went wrong, please try again.'}, {root: true});
					});
			} else {
				try {
					commit('editSongName', {songId: songId, newName: newName});
					commit('app/setSnackbar', {color: 'success', text: 'Song successfully updated.'}, {root: true});
				} catch(error) {
					// eslint-disable-next-line
					console.error(error);
					commit('app/setSnackbar', {color: 'error', text: 'Something went wrong, please try again.'}, {root: true});
				}
			}

			commit('app/setLoading', false, {root: true});
		},
		async toggleSongNeedsPractice({ commit, rootState }, songId) {
			let userId = rootState.user.userId;

			if (userId !== 'guest') {
				await SongService.toggleSongNeedsPractice(userId, songId)
					.then(response => {
						if (response.status == 204) {
							commit('setSongNeedsPractice', songId);
						} else {
							throw new Error();
						}
					}).catch(error => {
						//eslint-disable-next-line
						console.error(error);
						commit('app/setSnackbar', {color: 'error', text: 'Something went wrong, please try again.'}, {root: true});
					});
			} else {
				try {
					commit('setSongNeedsPractice', songId);
				} catch(error) {
					//eslint-disable-next-line
					console.error(error);
					commit('app/setSnackbar', {color: 'error', text: 'Something went wrong, please try again.'}, {root: true});
				}
			}
		}
	}
};

export default songs;
