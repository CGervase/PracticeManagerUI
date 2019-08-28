<template>
	<v-app dark>
		<v-toolbar app height="72px">
			<v-toolbar-title class="headline text-uppercase">
				<span>Practice</span>
				<span class="font-weight-light">Manager</span>
			</v-toolbar-title>
			<v-spacer />
			<v-tabs v-if="isUserSignedIn" :value="currentTab" class="tabs pr-5 mr-5" color="transparent" icons-and-text>
				<v-tab @click="setCurrentTab(tabNames.DASHBOARD)">
					Dashboard
					<v-icon>dashboard</v-icon>
				</v-tab>
				<v-tab @click="setCurrentTab(tabNames.MANAGE_SONGS)">
					Songs
					<v-icon>queue_music</v-icon>
				</v-tab>
				<v-tab @click="setCurrentTab(tabNames.PRACTICES)">
					Practices
					<v-icon>radio</v-icon>
				</v-tab>
				<!-- <v-tab @click="setCurrentTab(tabNames.SET_LISTS)">
					Set Lists
					<v-icon>description</v-icon>
				</v-tab> -->
			</v-tabs>
			<v-spacer class="pl-4 ml-5" />
			<!-- Profile dropdown -->
			<v-menu offset-y min-width="150px">
				<template v-slot:activator="{ on }">
					<v-btn v-show="isUserSignedIn" flat icon v-on="on">
						<v-icon>menu</v-icon>
					</v-btn>
				</template>
				<v-list>
					<v-list-tile>
						<h3>Hello, {{ isGuestAccount ? 'Guest' : signedInUser.bandName }}!</h3>
					</v-list-tile>
					<v-divider /><v-divider /><v-divider /><v-divider />
					<!-- Guest menu options -->
					<v-list-tile v-show="isGuestAccount" @click="logout">
						<v-list-tile-title>Back to Login Page</v-list-tile-title>
					</v-list-tile>

					<!-- User menu options -->
					<v-list-tile v-show="!isGuestAccount" @click="showProfileDialog = true">
						<v-list-tile-title>Profile</v-list-tile-title>
					</v-list-tile>
					<v-divider v-show="!isGuestAccount" />
					<v-list-tile v-show="!isGuestAccount" @click="logout">
						<v-list-tile-title>Logout</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu>
		</v-toolbar>

		<v-content class="mb-4">
			<div v-if="isUserSignedIn">
				<Dashboard v-if="currentTab == tabNames.DASHBOARD" />
				<ManageSongs v-if="currentTab == tabNames.MANAGE_SONGS" />
				<Practices v-if="currentTab == tabNames.PRACTICES" />
				<SetLists v-if="currentTab == tabNames.SET_LISTS" />
			</div>
			<SignIn v-else />

			<!-- Snackbar and Loading overlay -->
			<v-snackbar v-model="snackbar.display" :color="snackbar.color" :timeout="6000">
				{{ snackbar.text }}
				<v-btn dark flat @click="snackbar.display = false">Close</v-btn>
			</v-snackbar>
			<v-layout row justify-center>
				<v-dialog v-model="loading" fullscreen full-width persistent>
					<v-layout justify-center align-center fill-height style="background-color: rgba(255, 255, 255, 0.5)">
						<v-progress-circular indeterminate color="primary" :size="70" />
					</v-layout>
				</v-dialog>
			</v-layout>

			<!-- Profile dialog -->
			<ProfileDialog :visible="showProfileDialog" @close="showProfileDialog = false" />
		</v-content>

		<v-footer fixed class="pa-3">
			<!-- <button @click="test">test</button> -->
			<v-spacer />
			&copy; {{ new Date().getFullYear() }} Charles Gervase
		</v-footer>
	</v-app>
</template>

<script>
import SignIn from './SignIn';
import Dashboard from './Dashboard';
import ManageSongs from './ManageSongs';
import Practices from './Practices';
import SetLists from './SetLists';
import ProfileDialog from './ProfileDialog';
import { mapState, mapMutations, mapActions } from 'vuex';
import TabNames from '../constants/tabNames';

export default {
	name: "App",
	components: {
		SignIn,
		Dashboard,
		ManageSongs,
		Practices,
		SetLists,
		ProfileDialog
	},
	data: () => ({
		showProfileDialog: false,
		tabNames: TabNames
	}),
	methods: {
		...mapMutations({
			setCurrentTab: 'app/setCurrentTab'
		}),
		...mapActions({
			logout: 'user/logout'
		})
	},
	computed: {
		isUserSignedIn() {
			return this.signedInUser.id != '';
		},
		isGuestAccount() {
			return this.signedInUser.id === 'guest';
		},
		...mapState({
			signedInUser: state => state.user.signedInUser,
			snackbar: state => state.app.snackbar,
			loading: state => state.app.loading,
			currentTab: state => state.app.currentTab
		})
	}
};
</script>
<style>
html {
	overflow-y: auto !important;
}
.tabs {
	width: initial !important;
}
</style>