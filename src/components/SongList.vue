<template>
    <v-list>
        <div v-if="songs.length == 0" class="text-xs-center headline">Add some songs!</div>

        <template v-for="(song, index) in filteredSortedSongs">
            <v-list-tile :key="song.id">
                
                <v-list-tile-action v-if="currentTab == tabNames.PRACTICES">
                    <v-checkbox :value="song" v-model="selectedSongs" @change="toggleSelectedSong(song)" />
                </v-list-tile-action>

                <!-- song name -->
                <v-list-tile-content>
                    <v-list-tile-title v-text="song.name" />
                </v-list-tile-content>

                <!-- needs practice button -->
                <v-list-tile-action>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn icon @click="toggleSongNeedsPractice(song.id)" v-on="on">
                                <v-icon v-if="song.needsPractice" color="error">error</v-icon>
                                <v-icon v-else>error_outline</v-icon>
                            </v-btn>
                        </template>
                        <span>Needs Practice</span>
                    </v-tooltip>
                </v-list-tile-action>

                <!-- edit song button -->
                <v-list-tile-action v-if="currentTab == tabNames.MANAGE_SONGS">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn icon @click="initAddEdit(song)" v-on="on">
                                <v-icon>edit</v-icon>
                            </v-btn>
                        </template>
                        <span>Edit</span>
                    </v-tooltip>
                </v-list-tile-action>

                <!-- delete song button -->
                <v-list-tile-action v-if="currentTab == tabNames.MANAGE_SONGS">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn icon @click="initDelete(song)" v-on="on">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </template>
                        <span>Delete</span>
                    </v-tooltip>
                </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index < songs.length - 1" :key="'divider-' + index" />
        </template>
    </v-list>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import TabNames from '../constants/tabNames';

export default {
    props: ['songFilter', 'songSort'],
    data: () => ({
        tabNames: TabNames
    }),
    methods: {
        initAddEdit(song) {
            this.$emit('initAddEdit', song);
        },
        initDelete(song) {
            this.$emit('initDelete', song);
        },
        toggleSelectedSong(song) {
            this.storedSelectedSongs.find(s => s == song) == undefined ? this.selectSong(song) : this.removeSong(song);
        },
        ...mapMutations({
            selectSong: 'practices/selectSong',
            removeSong: 'practices/removeSong'
        }),
        ...mapActions({
            toggleSongNeedsPractice: 'songs/toggleSongNeedsPractice'
        })
    },
    computed: {
        filteredSortedSongs() {
            let sortedSongs = this.songs
            sortedSongs.sort((a,b) => (a[this.songSort] > b[this.songSort]) ? 1 : 
                                    ((b[this.songSort] > a[this.songSort]) ? -1 : 
                                    0));
            
            // reverse boolean sort, so songs that need practice go to the top
            if (this.songSort == 'needsPractice')
                sortedSongs.reverse();
            
            return sortedSongs.filter(song => {
                return song.name.toLowerCase().includes(this.songFilter.toLowerCase());
            });
        },
        selectedSongs: {
            get() {
                return this.storedSelectedSongs;
            },
            set() {}
        },
        ...mapState({
            songs: state => state.songs.songs,
            currentTab: state => state.app.currentTab,
            storedSelectedSongs: state => state.practices.selectedSongs
        })
    }
}
</script>

<style>

</style>
