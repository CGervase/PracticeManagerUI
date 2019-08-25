<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md6>
                <v-layout justify-center row>
                    <SongSuggestions />
                </v-layout>
                <v-card class="pa-4">
                    <div v-if="songs.length == 0" class="text-xs-center headline">Go to the <strong class="mx-2">SONGS</strong> tab and add some songs!</div>
                    <v-layout v-else row>
                        <!-- need practice -->
                        <v-flex xs12 sm6 fill-height>
                            <v-layout row>
                                <v-layout class="mr-4" column>
                                    <v-icon x-large>error_outline</v-icon>
                                </v-layout>
                                <v-layout column>
                                    <span class="headline">These songs might need some practice...</span>
                                </v-layout>
                            </v-layout>
                            <v-list>
                                <v-list-tile v-for="song in songsNeedPractice" :key="song.id">
                                    <v-icon left>keyboard_arrow_right</v-icon>{{ song.name }}
                                </v-list-tile>
                            </v-list>
                        </v-flex>

                        <v-divider class="mx-5" vertical />

                        <!-- haven't been practiced in a while -->
                        <v-flex xs12 sm6 fill-height>
                            <v-layout row>
                                <v-layout class="mr-4" column>
                                    <!-- schedule (regular clock) -->
                                    <v-icon x-large>history</v-icon>
                                </v-layout>
                                <v-layout column>
                                    <span class="headline">These songs haven't been practiced in a while...</span>
                                </v-layout>
                            </v-layout>
                            <v-list>
                                <v-list-tile v-for="song in songsNotPracticed" :key="song.id">
                                    <v-icon left>keyboard_arrow_right</v-icon>{{ song.name }}
                                </v-list-tile>
                            </v-list>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import SongSuggestions from './SongSuggestions';
import { mapState } from 'vuex';

export default {
    components: {
        SongSuggestions
    },
    computed: {
        songsNeedPractice() {
            let needPractice = this.songs;
            return needPractice.filter(song => { return song.needsPractice });
        },
        songsNotPracticed() {
            let notPracticed = this.songs;
            notPracticed.sort((a,b) => (b.lastPractice > a.lastPractice) ? 1 : ((a.lastPractice > b.lastPractice) ? -1 : 0));
            
            //if less than 3 songs need practice, return at least 3 songs that haven't been practiced in a while
            return notPracticed.slice(0, (this.songsNeedPractice.length < 3 ? 3 : this.songsNeedPractice.length));
        },
        ...mapState({
            songs: state => state.songs.songs
        })
    }
}
</script>

<style>

</style>
