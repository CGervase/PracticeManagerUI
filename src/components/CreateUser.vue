<template>
	<v-dialog v-model="createUserDialog" max-width="600px" @input="v => v || closeDialog()">
		<template v-slot:activator="{ on }">
			<v-btn color="secondary" flat v-on="on">Create User</v-btn>
		</template>
		<v-card>
			<v-card-title>
				<span class="headline">Create User</span>
			</v-card-title>
			<v-card-text>
				<v-form ref="createUserForm" v-model="valid">
					<v-text-field prepend-icon="email" name="email" label="Email*" type="email" v-model.trim="email"
									:rules="emailRules" required validate-on-blur @keyup.enter="validate" />
					<v-text-field id="new-password" prepend-icon="lock" name="new-password" label="Password*"
									type="password" v-model.trim="newPassword" :rules="newPasswordRules" required
									validate-on-blur @keyup.enter="validate" />
					<v-text-field id="confirm-password" prepend-icon="done_all" name="confirm-password" label="Confirm Password*"
									type="password" v-model.trim="confirmPassword" :rules="confirmPasswordRules" required
									validate-on-blur :error-messages="passwordMatchError()" @keyup.enter="validate" />
					<v-text-field prepend-icon="group" name="band" label="Band Name*" type="text" v-model.trim="bandName"
									:rules="bandNameRules" required @keyup.enter="validate" />
				</v-form>
				<small>* Indicates required field</small>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn color="secondary" flat @click="closeDialog">Cancel</v-btn>
				<v-btn color="primary" :disabled="!valid" @click="validate">Create User</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	data: () => ({
		createUserDialog: false,
		valid: true,
		email: '',
		emailRules: [
			v => !!v || 'Email is required',
			v => /.+@.+/.test(v) || 'Email must be valid'
		],
		bandName: '',
		bandNameRules: [ v => !!v || 'Band Name is required' ],
		newPassword: '',
		newPasswordRules: [ v => !!v || 'Password is required' ],
		confirmPassword: '',
		confirmPasswordRules: [ v => !!v || 'Password is required' ]
	}),
	methods: {
		validate() {
			if (this.$refs.createUserForm.validate()) {
				let userDetails = {
					email: this.email,
					password: this.newPassword,
					bandName: this.bandName,
					songs: [],
					practices: []
				};
				this.addUser(userDetails);
				this.closeDialog();
			}
		},
		passwordMatchError() {
			return (this.newPassword === this.confirmPassword) ? '' : 'Passwords must match';
		},
		closeDialog() {
			this.$refs.createUserForm.reset();
			this.createUserDialog = false;
		},
		...mapActions({
			addUser: 'user/addUser'
		})
	}
}
</script>

<style>
</style>
