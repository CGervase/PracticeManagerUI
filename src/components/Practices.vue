<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md6>
                <v-layout row>
                    <v-spacer v-if="$vuetify.breakpoint.smAndUp" />
                    
                    <!-- new practice dialog button -->
                    <v-btn color="primary" @click="showNewPracticeDialog = true" :block="$vuetify.breakpoint.xsOnly" >
                        <v-icon left>playlist_add</v-icon>New Practice
                    </v-btn>
                </v-layout>

                <!-- list of practices -->
                <div v-if="practices.length == 0" class="text-xs-center headline mt-5">Add some practices!</div>
                <v-expansion-panel>
                    <v-expansion-panel-content v-for="practice in practicesNewToOld" :key="practice.id">
                        <template v-slot:header>
                            <h2>{{ new Date(practice.date).toISOString().substr(0,10) }}</h2>
                        </template>
                        <v-card>
                            <v-card-text>
                                <v-layout row>
                                    <v-flex xs12 sm6>
                                        <v-list>
                                            <v-list-tile v-for="song in practice.practicedSongs" :key="song.id">
                                                <v-icon left>keyboard_arrow_right</v-icon>{{ song.name }}
                                            </v-list-tile>
                                        </v-list>
                                    </v-flex>
                                    <v-divider class="mx-5" vertical />
                                    <v-flex xs12 sm6>
                                        <label :for="'quality' + practice.id">Quality:</label>
                                        <v-rating :id="'quality' + practice.id" class="mt-2 mb-4" :value="parseInt(practice.quality)" readonly />
                                        <label :for="'comments' + practice.id">Comments:</label>
                                        <blockquote :id="'comments' + practice.id" class="blockquote">"{{ practice.comments }}"</blockquote>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn color="secondary" flat @click="initDeleteDialog(practice)">Delete this practice</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <!-- new practice dialog -->
                <v-dialog v-model="showNewPracticeDialog" @input="v => v || closeDialog()">
                    <v-card>
                        <v-card-title>
                            <span class="headline">New Practice</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form>
                                <v-layout row>
                                </v-layout>
                                <!-- new practice songs -->
                                <v-layout row justify-center>
                                    <v-flex xs12 sm4>
                                        <!-- new practice date -->
                                        <v-menu v-model="practiceDateMenu" :close-on-content-click="false" :nudge-right="40"
                                                lazy transition="scale-transition" offset-y full-width min-width="290px">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-model="practiceDate" label="Practice Date" prepend-icon="event"
                                                                readonly v-on="on" />
                                            </template>
                                            <v-date-picker v-model="practiceDate" @input="practiceDateMenu = false" />
                                        </v-menu>
                                        <v-divider class="my-4" inset />
                                        <!-- new practice rating -->
                                        <v-layout row align-center justify-space-around>
                                            <label class="pr-3">How was the practice?</label>
                                            <v-rating v-model="practiceQuality" />
                                        </v-layout>
                                        <v-divider class="my-4" inset />
                                        <!-- new practice comments -->
                                        <v-textarea name="input-7-1" label="Comments" v-model="practiceComments" box />
                                    </v-flex>
                                    <v-divider class="mx-5" vertical />
                                    <v-flex xs12 sm4>
                                        <v-text-field label="Filter Songs" v-model.trim="songFilter" class="pr-4" />
                                        <v-card>
                                            <SongList :songFilter="songFilter" :songSort="songSort" class="song-list-container" />
                                        </v-card>
                                    </v-flex>
                                    <v-flex xs12 sm4>
                                        <!-- practiced songs -->
                                        <v-list>
                                            <template v-for="song in selectedSongs">
                                                <v-list-tile :key="song.id">
                                                    <v-list-tile-content class="ml-5">
                                                        <v-list-tile-title>{{ song.name }}</v-list-tile-title>
                                                    </v-list-tile-content>
                                                    <v-list-tile-action class="mr-5">
                                                        <v-btn icon @click="removeSong(song)">
                                                            <v-icon>close</v-icon>
                                                        </v-btn>
                                                    </v-list-tile-action>
                                                </v-list-tile>
                                            </template>
                                        </v-list>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="secondary" flat @click="resetForm">Clear</v-btn>
                            <v-spacer />
                            <v-btn color="secondary" flat @click="closeDialog">Cancel</v-btn>
                            <v-btn color="primary" :disabled="selectedSongs.length == 0" @click="addPractice">Add Practice</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!-- delete practice dialog -->
                <v-dialog v-model="showDeleteDialog" max-width="400px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Delete Practice</span>
                        </v-card-title>
                        <v-card-text v-if="selectedPractice.date != undefined">
                            Are you sure you want to remove the practice from {{ new Date(selectedPractice.date).toISOString().substr(0,10) }}?
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn color="secondary" flat @click="showDeleteDialog = false">Cancel</v-btn>
                            <v-btn color="primary" @click="deletePractice(selectedPractice.id)">Delete Practice</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import SongList from './SongList';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    components: {
        SongList
    },
    data: () => ({
        showNewPracticeDialog: false,
        practiceDateMenu: false,
        practiceDate: new Date().toISOString().substr(0, 10),
        practiceQuality: 3,
        practiceComments: '',
        songFilter: '',
        songSort: 'id',
        showDeleteDialog: false,
        selectedPractice: {}
    }),
    methods: {
        closeDialog() {
            this.showNewPracticeDialog = false;
            this.resetForm();
        },
        resetForm() {
            this.practiceDate = new Date().toISOString().substr(0, 10);
            this.practiceQuality = 3;
            this.practiceComments = '';
            this.songFilter = '';
            this.clearSelectedSongs();
        },
        async addPractice() {
            let practice = {
                id: this.generateNextPracticeId(),
                date: this.practiceDate,
                practicedSongs: this.selectedSongs,
                quality: this.practiceQuality,
                comments: this.practiceComments
            };
            await this.addPracticeToUser(practice);
            this.closeDialog();
        },
        generateNextPracticeId() {
            if (this.practices.length == 0)
                return 1;
            else
                return Math.max.apply(Math, this.practices.map(practice => practice.id)) + 1;
        },
        initDeleteDialog(practice) {
            this.selectedPractice = practice;
            this.showDeleteDialog = true;
        },
        async deletePractice(practiceId) {
            await this.deletePracticeFromUser(practiceId).then(this.selectedPractice = {});
            this.showDeleteDialog = false;
        },
        ...mapMutations({
            removeSong: 'practices/removeSong',
            clearSelectedSongs: 'practices/clearSelectedSongs'
        }),
        ...mapActions({
            addPracticeToUser: 'practices/addPracticeToUser',
            deletePracticeFromUser: 'practices/deletePracticeFromUser'
        })
    },
    computed: {
        practicesNewToOld() {
            let sortedPractices = this.practices;
            return sortedPractices.sort((a,b) => (b.date > a.date) ? 1 : ((a.date > b.date) ? -1 : 0));
        },
        ...mapState({
            selectedSongs: state => state.practices.selectedSongs,
            practices: state => state.practices.practices
        })
    }
}
</script>

<style scoped>
    .song-list-container {
        overflow-y: auto;
        height: 325px;
    }
</style>
