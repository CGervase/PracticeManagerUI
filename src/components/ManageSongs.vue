<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md6>
                <v-layout row>
                    <!-- song filter -->
                    <v-text-field label="Filter Songs" v-model.trim="songFilter" class="pr-4" />

                    <v-spacer />

                    <!-- song sort -->
                    <v-select :items="songSortOptions" v-model="songSort" label="Sort" dense class="pr-4" />

                    <v-spacer />

                    <!-- add song dialog button -->
                    <v-btn color="primary" @click="initAddEditDialog('', 'Add')">
                        <v-icon left>add</v-icon>Add Song
                    </v-btn>
                </v-layout>

                <!-- song list -->
                <SongList :songFilter="songFilter" :songSort="songSort" @initAddEdit="initAddEditDialog(...arguments, 'Edit')" @initDelete="initDeleteDialog" />

                <!-- add/edit song dialog -->
                <v-dialog v-model="showAddEditDialog" max-width="400px" @input="v => v || closeDialog()">
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ addEditMode }} Song</span>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field label="Song Name" v-model.trim="addEditSongName" v-if="showAddEditDialog" autofocus
                                            @keyup.enter="addEditSubmit" :error-messages="errorText" />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn color="secondary" flat @click="closeDialog">Cancel</v-btn>
                            <v-btn color="primary" :disabled="addEditSongName.length <= 0" @click="addEditSubmit">{{ addEditMode }} Song</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!-- delete song dialog -->
                <v-dialog v-model="showDeleteDialog" max-width="400px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Delete Song</span>
                        </v-card-title>
                        <v-card-text>
                            Are you sure you want to remove {{ selectedSong.name }} from the list?
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn color="secondary" flat @click="showDeleteDialog = false">Cancel</v-btn>
                            <v-btn color="primary" @click="deleteSong(selectedSong.id)">Delete Song</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import SongList from './SongList';
import { mapState, mapActions } from 'vuex';

export default {
    components: {
        SongList
    },
    data: () => ({
        songFilter: '',
        songSortOptions: [
            { text: 'Date Added', value: 'id' },
            { text: 'Name', value: 'name' },
            { text: 'Needs Practice', value: 'needsPractice' }
        ],
        songSort: 'id',
        showAddEditDialog: false,
        showDeleteDialog: false,
        addEditSongName: '',
        addEditMode: '',
        selectedSong: {},
        errorText: ''
    }),
    methods: {
        closeDialog() {
            this.addEditSongName = '';
            this.showAddEditDialog = false;
            this.selectedSong = {};
        },
        async addEditSubmit() {
            if (this.addEditMode == 'Add') {
                this.errorText = '';
                if (this.songs.find(song => { song.Name === this.addEditSongName }) === undefined) {
                    let song = {
                        id: this.generateNextSongId(),
                        name: this.addEditSongName,
                        lastPractice: new Date(),
                        needsPractice: false
                    }
                    await this.addSongToUser(song).then(() => { this.closeDialog(); });
                } else {
                    this.errorText = 'The song has already been added.'
                }
            } else if (this.addEditMode == 'Edit') {
                await this.editSong({ songId: this.selectedSong.id, newName: this.addEditSongName });
            }
            this.showAddEditDialog = false;
        },
        generateNextSongId() {
            if (this.songs.length == 0)
                return 1;
            else
                return Math.max.apply(Math, this.songs.map(song => song.id)) + 1;
        },
        initAddEditDialog(song, mode) {
            this.addEditMode = mode;
            if (this.addEditMode == 'Edit') {
                this.selectedSong = song;
                this.addEditSongName = this.selectedSong.name;
            }
            this.showAddEditDialog = true;
        },
        initDeleteDialog(song) {
            this.selectedSong = song;
            this.showDeleteDialog = true;
        },
        async deleteSong(songId) {
            await this.deleteSongFromUser(songId).then(this.selectedSong = {});
            this.showDeleteDialog = false;
        },
        ...mapActions({
            addSongToUser: 'songs/addSongToUser',
            deleteSongFromUser: 'songs/deleteSongFromUser',
            editSong: 'songs/editSong'
		})
    },
    computed: {
        ...mapState({
            songs: state => state.songs.songs
        })
    }
}
</script>

<style>
[role="listitem"]:hover {
    background-color: #525252;
}
</style>
