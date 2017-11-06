<template>
    <div class="search" v-on-clickaway="clickAway">
        <div class="m-input-group m-input-group-flat">
            <input type="text" v-model="value" @input="changed" @focus="active = true" ref="input" required>
            <span class="bar"></span>
            <label>Search and add assets</label>
        </div>

        <div v-show="(suggestions.length > 0) && active" class="search-dropdown" ref="dropdown">
            <div v-for="ticker in suggestions" @click="add(ticker.id)" class="search-dropdown__item">
                <span>
                    <span class="cc ticker-logo-icon" :class="ticker.symbol" :style="{ 'color': '#'+getTickerColor(ticker.id) }"></span>
                    {{ ticker.name }}
                </span>
                <i class="material-icons">add</i>
            </div>
        </div>
    </div>
</template>

<script>
    import { mixin as clickaway } from 'vue-clickaway';
    import Charts from '../../../charts'

    export default {
        props: [ 'assets' ],

        mixins: [ clickaway ],

        data() {
            return {
                value: '',
                suggestions: [],
                popper: null,
                sortedTickers: [],
                active: false
            }
        },

        computed: {
            tickers() {
                return this.$store.state.data.crypto.tickers;
            }
        },

        mounted() {
            this.sortedTickers = this.tickers.concat().sort((a,b) => {
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });
        },

        watch: {
            assets() {
                this.changed();
            }
        },

        methods: {
            changed() {
                if(this.value.length == 0) {
                    this.suggestions.splice(0,this.suggestions.length);

                    return;
                }
                let count = 0;
                for(let i = 0; i < this.sortedTickers.length; i++) {
                    if(this.sortedTickers[i].name.toLowerCase().startsWith(this.value.toLowerCase())) {
                        if(!this.assets.find(asset => asset.identifier == this.sortedTickers[i].id)) {
                            this.$set(this.suggestions, count++, this.sortedTickers[i]);
                        }
                    }
                    if(count == 5) break;
                }
                if(count < 5) {
                    //console.log([count,5-count]);
                    this.suggestions.splice(count, this.suggestions.length-count);
                }
            },

            add(tickerId) {
                this.$emit('add', tickerId);
                this.changed();
                this.value = '';
            },

            clickAway() {
                this.active = false;
            },

            getTickerColor(id) {
                return Charts.getColorFromText(id);
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .search {
        position: relative;
    }

    .search-dropdown {
        position: absolute;
        top: 100%;
        width: 100%;
        background-color: $night-blue-medium;
        color: $night-gray;
        padding: 0.2rem;
        box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
        z-index: 100;
    }
    
    .search-dropdown__item {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0.5rem;

        i {
            font-size: 100%;
        }

        &:hover {
            color: darken($night-gray,15%);
        }
    }

    .ticker-logo-icon::before {
        font-family: FontAwesome,"cryptocoins" !important;
        content: "\f111";
    }
</style>