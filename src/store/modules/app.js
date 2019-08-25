import TabNames from '../../constants/tabNames';
const app = {
	namespaced: true,
	state: {
		snackbar: {
			display: false,
			color: '',
			text: ''
		},
		loading: false,
		currentTab: TabNames.DASHBOARD
	},
	getters: {},
	mutations: {
		setSnackbar(state, snackbarParams) {
			state.snackbar.display = true;
			state.snackbar.color = snackbarParams.color;
			state.snackbar.text = snackbarParams.text;
		},
		setLoading(state, isLoading) {
			state.loading = isLoading;
		},
		setCurrentTab(state, tab) {
			state.currentTab = tab;
		}
	},
	actions: {}
};

export default app;
