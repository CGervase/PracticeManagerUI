import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import app from './modules/app';
import user from './modules/user';
import songs from './modules/songs';
import practices from './modules/practices';

Vue.use(Vuex);
const vuexPersist = new VuexPersist({
	key: 'practice-manager',
	storage: sessionStorage
})

export default new Vuex.Store({
	modules: {
		app,
		user,
		songs,
		practices
	},
	plugins: [vuexPersist.plugin]
});
