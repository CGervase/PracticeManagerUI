import Vue from 'vue';
import Vuetify, {
	VApp,
	VFooter,
	VToolbar,
	VTabs,
	VCard,
	VForm
} from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
	components: {
		VApp,
		VFooter,
		VToolbar,
		VTabs,
		VCard,
		VForm
	},
	iconfont: 'md',
	theme: {
		primary: '#36794D',
		secondary: '#7FAF6A',
		accent: '#D0E0B7',
		error: '#FF6262'
	}
});
