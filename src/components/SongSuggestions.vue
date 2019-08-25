<template>
    <v-dialog v-model="songSuggestionsDialog" width="600px">
        <template v-slot:activator="{ on }">
            <v-btn large color="primary" :block="$vuetify.breakpoint.xsOnly" v-on="on">
                <!-- flash_on (lightning bolt) -->
                <v-icon left>star</v-icon>Song Practice Suggestions
            </v-btn>
        </template>
        <v-card>
            <v-card-title class="headline justify-center">Song Suggestions</v-card-title>
            <v-card-text>
                <v-list-tile v-for="(song, index) in suggestions" :key="song.id">
                    <v-flex text-xs-center>
                    <!-- <v-icon left>keyboard_arrow_right</v-icon>{{ song.name }} -->
                    <v-icon left>{{ suggestionIcons[index] }}</v-icon>{{ song.name }}
                    </v-flex>
                </v-list-tile>
            </v-card-text>
            <v-card-actions>
                <v-btn class="mx-auto" color="primary" @click="rollSuggestions">
                    <!-- autorenew (rounded version) -->
                    <v-icon left>repeat</v-icon>Re-Roll
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data: () => ({
        songSuggestionsDialog: false,
        suggestions: [],
        suggestionIcons: []
    }),
    methods: {
        rollSuggestions() {
            this.suggestions = [];
            this.suggestionIcons = [];

            //suggest one song that needs practice
            if (this.songsNeedPractice.length > 0) {
                let needsPractice = JSON.parse(JSON.stringify(this.songsNeedPractice));
                let song = needsPractice[Math.floor(Math.random() * needsPractice.length)];
                this.suggestions.push(song);
                this.suggestionIcons.push('error_outline');
            }
            
            //suggest one song that hasn't been practiced in a while
            if (this.songsNotPracticed.length > 0) {
                let notPracticed = JSON.parse(JSON.stringify(this.songsNotPracticed));
                let length = notPracticed.length;
                let count = 0;
                while (count < length) {
                    let song = notPracticed.splice([Math.floor(Math.random() * notPracticed.length)], 1)[0];
                    if (!this.suggestions.find(s => s.id === song.id)) {
                        this.suggestions.push(song);
                        this.suggestionIcons.push('history')
                        break;
                    }
                    count++;
                }
            }

            //remaining suggestions come from entire song list
            let tempSongs = JSON.parse(JSON.stringify(this.songs));
            let suggestionsLength = tempSongs.length < 3 ? tempSongs.length : 3;
            let count = 0;
            while (this.suggestions.length < suggestionsLength && count < tempSongs.length) {
                let song = tempSongs.splice([Math.floor(Math.random() * tempSongs.length)], 1)[0];
                if (!this.suggestions.find(s => s.id === song.id)) {
                    this.suggestions.push(song);
                    this.suggestionIcons.push('music_note')
                }
                count++;
            }
        },
    },
    computed: {
        songsNeedPractice() {
            let needPractice = this.songs;
            return needPractice.filter(song => { return song.needsPractice });
        },
        songsNotPracticed() {
            let notPracticed = this.songs;
            let date = new Date(Math.max.apply(null, notPracticed.map(song => new Date(song.lastPractice))));
            return notPracticed.filter(song => new Date(song.lastPractice).valueOf() === new Date(date).valueOf());
        },
        ...mapState({
            songs: state => state.songs.songs
        })
    },
    watch: {
        songSuggestionsDialog(isOpen) {
            if (isOpen) this.rollSuggestions();
        }
    }
}
</script>

<style>

</style>
