import UserService from '../../services/user-service';
import PracticeMgrUserService from '../../services/practice-mgr-user-service';

const user = {
	namespaced: true,
	state: {
		userId: '',
		bandName: ''
	},
	getters: {},
	mutations: {
		setUserId(state, userId) {
			state.userId = userId;
		},
		setBandName(state, bandName) {
			state.bandName = bandName;
		}
	},
	actions: {
		async getUserWithCredentials({ commit }, credentials) {
			commit('app/setLoading', true, {root: true});
			//authenticate user
			await UserService.getUserWithCredentials(credentials)
				.then(async response => {
					if (response.status == 200) {
						
						//get user's Practice Manager data
						await PracticeMgrUserService.getUserData(response.data)
						.then(response => {
							if (response.status == 200) {
									commit('setUserId', response.data.id);
									commit('setBandName', response.data.bandName);
									commit('songs/setSongs', response.data.songs, {root: true});
									commit('practices/setPractices', response.data.practices, {root: true});
								} else {
									commit('app/setSnackbar', {color:'error', text: 'Something went wrong, please try again.'}, {root: true});
								}
							});
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
			
			let userCredentials = {
				email: userDetails.email,
				password: userDetails.password
			}

			//add document to UserDb
			await UserService.addUser(userCredentials)
				.then(async response => {
					if (response.status == 201) {
						let practiceMgrUserDetails = {
							id: response.data,
							bandName: userDetails.bandName,
							songs: [],
							practices: []
						}

						//add document to PracticeManagerDb
						await PracticeMgrUserService.addUser(practiceMgrUserDetails)
							.then(response => {
								if (response.status == 201) {
									commit('app/setSnackbar', {color:'success', text: 'User created successfully!'}, {root: true});
								}
							});
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
		logout({ commit }) {
			commit('setUserId', '');
			commit('setBandName', '');
			commit('songs/setSongs', [], {root: true});
			commit('practices/setPractices', [], {root: true});
		}
	}
};

export default user;
