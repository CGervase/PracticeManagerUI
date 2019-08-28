import UserService from '../../services/user-service';

const user = {
	namespaced: true,
	state: {
		signedInUser: {
			id: '',
			email: '',
			bandName: ''
		}
	},
	getters: {},
	mutations: {
		setSignedInUser(state, user) {
			state.signedInUser.id = user.id;
			state.signedInUser.email = user.email;
			state.signedInUser.bandName = user.bandName;
		}
	},
	actions: {
		async getUserWithCredentials({ commit }, credentials) {
			commit('app/setLoading', true, {root: true});
			await UserService.getUserWithCredentials(credentials)
				.then(response => {
					if (response.status == 200) {
						commit('setSignedInUser', response.data);
						commit('songs/setSongs', response.data.songs, {root: true});
						commit('practices/setPractices', response.data.practices, {root: true});
					} else {
						commit('app/setSnackbar', {color:'error', text: 'Something went wrong, please try again.'}, {root: true});
					}
				})
				.catch(error => {
					// eslint-disable-next-line
					console.error(error)
					if (error.response.status == 401) {
						commit('app/setSnackbar', {color:'error', text:'Invalid email or password, please try again.'}, {root: true});
					}
				});

			commit('app/setLoading', false, {root: true});
		},
		async addUser({ commit }, userDetails) {
			commit('app/setLoading', true, {root: true});
			await UserService.addUser(userDetails)
				.then(response => {
					if (response.status == 201) {
						commit('app/setSnackbar', {color:'success', text: 'User created successfully!'}, {root: true});
					} else if (response.status == 200) {
						commit('app/setSnackbar', {color:'warning', text: 'A user with this email already exists, please try again.'}, {root: true});
					}
				})
				.catch(error => {
					// eslint-disable-next-line
					console.error(error.response);
					commit('app/setSnackbar', {color:'error', text: 'Something went wrong, please try again.'}, {root: true});
				});

			commit('app/setLoading', false, {root: true});
		},
		async deleteUserProfile({ commit, state, dispatch }) {
			commit('app/setLoading', true, {root: true});

			await UserService.deleteUser(state.signedInUser.id)
				.then(() => {
					dispatch('logout');
				})
				.catch(error => {
					// eslint-disable-next-line
					console.error(error.response);
					commit('app/setSnackbar', {color:'error', text: 'Something went wrong, please try again.'}, {root: true});
				});
			
			commit('app/setLoading', false, {root: true});
		},
		logout({ commit }) {
			commit('setSignedInUser', {id: '', email: '', bandName: ''});
			commit('songs/setSongs', [], {root: true});
			commit('practices/setPractices', [], {root: true});
		}
	}
};

export default user;
