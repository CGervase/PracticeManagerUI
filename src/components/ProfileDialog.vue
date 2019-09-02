<template>
    <v-flex xs12>
        <!-- profile dialog -->
        <v-dialog v-model="showProfileDialog" max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Profile Details</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field :value="bandName" label="Band Name" prepend-icon="group" readonly />
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: ['visible'],
    computed: {
        showProfileDialog: {
            get() {
                return this.visible;
            },
            set(value) {
                if (!value) this.$emit('close');
            }
        },
        ...mapState({
            bandName: state => state.user.bandName
        })
    }
}
</script>

<style>

</style>
