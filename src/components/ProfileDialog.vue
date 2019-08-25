<template>
    <v-flex xs12>
        <!-- profile dialog -->
        <v-dialog v-model="showProfileDialog" max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Profile Details</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field :value="signedInUser.email" label="Email" prepend-icon="email" readonly />
                    <v-text-field :value="signedInUser.bandName" label="Band Name" prepend-icon="group" readonly />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="secondary" flat @click="showDeleteProfileDialog = true; showProfileDialog = false">Delete Profile</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- delete profile dialog -->
        <v-dialog v-model="showDeleteProfileDialog" max-width="500px" @input="v => v || closeDeleteProfileDialog()">
            <v-card>
                <v-card-title>
                    <span class="headline">Delete Profile</span>
                </v-card-title>
                <v-card-text>
                    <div class="text-xs-center pb-5 subheading">
                        Deleting your profile is irreversible and will delete any songs, practices, and other data associated with
                        this account.<br>Are you sure you want to proceed?
                    </div>
                    <v-spacer />
                    <div>
                        <label>Enter your band name to continue with profile deletion.</label>
                        <v-text-field v-model="bandNameDelete" :label="signedInUser.bandName" />
                        <v-checkbox v-model="confirmProfileDelete" label="I understand the consequences. Delete my account anyway." />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="closeDeleteProfileDialog">Cancel</v-btn>
                    <v-btn color="error" flat :disabled="disableDeleteButton" @click="deleteProfile">Delete Profile</v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    props: ['visible'],
    data: () => ({
        showDeleteProfileDialog: false,
        bandNameDelete: '',
        confirmProfileDelete: false
    }),
    methods: {
        closeDeleteProfileDialog() {
            this.showDeleteProfileDialog = false;
            this.bandNameDelete = '';
            this.confirmProfileDelete = false;
        },
        async deleteProfile() {
            this.closeDeleteProfileDialog();
            await this.deleteUserProfile();
        },
        ...mapActions({
            deleteUserProfile: 'user/deleteUserProfile'
        })
    },
    computed: {
        showProfileDialog: {
            get() {
                return this.visible;
            },
            set(value) {
                if (!value) this.$emit('close');
            }
        },
        disableDeleteButton() {
            return !this.confirmProfileDelete || this.bandNameDelete.toLowerCase() !== this.signedInUser.bandName.toLowerCase();
        },
        ...mapState({
            signedInUser: state => state.user.signedInUser
        })
    }
}
</script>

<style>

</style>
