import PracticeService from '../../services/practice-service';

const practices = {
	namespaced: true,
	state: {
		practices: [],
		selectedSongs: []
	},
	getters: {},
	mutations: {
		setPractices(state, practices) {
			state.practices = practices;
		},
		selectSong(state, song) {
			state.selectedSongs.push(song);
		},
		removeSong(state, song) {
			state.selectedSongs = state.selectedSongs.filter(s => { return s != song });
		},
		clearSelectedSongs(state) {
			state.selectedSongs = [];
		},
		addPractice(state, practice) {
			state.practices.push(practice);
		},
		deletePractice(state, practiceId) {
			state.practices = state.practices.filter(practice => { return practice.id != practiceId; });
		}
	},
	actions: {
		async addPracticeToUser({ commit, rootState }, practice) {
			commit('app/setLoading', true, {root: true});

			let userId = rootState.user.signedInUser.id;

			if (userId !== 'guest') {
				await PracticeService.addPractice(userId, practice)
					.then(response => {
						if (response.status == 201) {
							commit('addPractice', response.data);
							commit('app/setSnackbar', {color: 'success', text: 'Practice successfully added.'}, {root: true});
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
					commit('addPractice', practice);
					commit('app/setSnackbar', {color: 'success', text: 'Practice successfully added.'}, {root: true});
				} catch(error) {
					// eslint-disable-next-line
					console.error(error);
					commit('app/setSnackbar', {color: 'error', text: 'Something went wrong, please try again.'}, {root: true});
				}
			}

			commit('app/setLoading', false, {root: true});
		},
		async deletePracticeFromUser({ commit, rootState }, practiceId) {
			commit('app/setLoading', true, {root: true});

			let userId = rootState.user.signedInUser.id;

			if (userId !== 'guest') {
				await PracticeService.deletePractice(userId, practiceId)
					.then(response => {
						if (response.status == 204) {
							commit('deletePractice', practiceId);
							commit('app/setSnackbar', {color: 'success', text: 'Practice successfully removed.'}, {root: true});
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
					commit('deletePractice', practiceId);
					commit('app/setSnackbar', {color: 'success', text: 'Practice successfully removed.'}, {root: true});
				} catch(error) {
					// eslint-disable-next-line
					console.error(error);
					commit('app/setSnackbar', {color: 'error', text: 'Something went wrong, please try again.'}, {root: true});
				}
			}

			commit('app/setLoading', false, {root: true});
		}
	}
};

export default practices;
