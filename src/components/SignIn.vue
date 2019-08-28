<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm8 md4>
				<v-card>
					<v-toolbar color="primary">
						<h3 class="headline mb-0">Sign In</h3>
					</v-toolbar>
					<v-card-text>
						<v-form ref="signInForm" v-model="valid">
							<v-text-field prepend-icon="email" name="email" label="Email" type="email" v-model.trim="email"
											required @keyup.enter="validate" />
							<v-text-field id="password" prepend-icon="lock" name="password" label="Password" type="password"
											v-model.trim="password" required @keyup.enter="validate" />
						</v-form>
					</v-card-text>
					<v-card-actions>
						<CreateUser />
						<v-spacer/>
						<v-btn color="secondary" flat @click="signInAsGuest">Continue as Guest</v-btn>
						<v-btn color="primary" @click="validate" :disabled="!valid">Sign In</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import CreateUser from './CreateUser';
import { mapActions, mapMutations } from 'vuex';

export default {
	components: {
		CreateUser
	},
	data: () => ({
		valid: true,
		email: '',
		emailRules: [ v => !!v || 'Email is required' ],
		password: '',
		passwordRules: [ v => !!v || 'Password is required']
	}),
	methods: {
		validate() {
			if (this.$refs.signInForm.validate()) {
				let credentials = {
					email: this.email,
					password: this.password
				};
				this.getUserWithCredentials(credentials);
			}
		},
		signInAsGuest() {
			let user = {
				id: 'guest',
				email: '',
				bandName: ''
			}
			this.setSignedInUser(user);
		},
		...mapMutations({
			setSignedInUser: 'user/setSignedInUser'
		}),
		...mapActions({
			getUserWithCredentials: 'user/getUserWithCredentials'
		})
	}
}
</script>

<style>
</style>
