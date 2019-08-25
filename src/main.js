import Vue from 'vue';
import App from './components/App.vue';
import './plugins/vuetify';
import store from './store/store';

Vue.config.productionTip = false;

new Vue({
	store,
	render: h => h(App)
}).$mount('#app');
