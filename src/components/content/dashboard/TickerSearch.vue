<template>
    <div class="search" v-on-clickaway="clickAway">
        <div class="m-input-group m-input-group-flat">
            <input type="text" v-model="value" @input="changed" @focus="active = true" ref="input" required>
            <span class="bar"></span>
            <label>Search and add coin</label>
        </div>

        <div v-show="(suggestions.length > 0) && active" class="search-dropdown" ref="dropdown">
            <div v-for="ticker in suggestions" @click="add(ticker.id)" class="search-dropdown__item">
                <span class="cc ticker-logo-icon" :class="ticker.symbol" :style="{ 'color': '#'+getColorFromText(ticker.id) }"></span>
                {{ ticker.name }}
            </div>
        </div>
    </div>
</template>

<script>
    import { mixin as clickaway } from 'vue-clickaway';
    import filters from '../../../mixins/filters'

    export default {
        props: [ 'coins' ],

        mixins: [ clickaway, filters ],

        data() {
            return {
                value: '',
                suggestions: [],
                popper: null,
                active: false
            }
        },

        computed: {
            tickers() {
                return this.$store.state.data.crypto.tickers;
            }
        },

        watch: {
            coins() {
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
                for(let i = 0; i < this.tickers.length; i++) {
                    let lowerCaseSearchString = this.value.toLowerCase();
                    if(this.tickers[i].name.toLowerCase().startsWith(lowerCaseSearchString) || this.tickers[i].symbol.toLowerCase().startsWith(lowerCaseSearchString)) {
                        if(!this.coins.find(asset => asset.identifier == this.tickers[i].id)) {
                            this.$set(this.suggestions, count++, this.tickers[i]);
                        }
                    }
                    if(count == 5) break;
                }
                if(count < 5) {
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
        padding-top: 2px;
        box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
        z-index: 100;
    }
    
    .search-dropdown__item {
        cursor: pointer;
        padding: 0.5rem 0.5rem;

        &:hover {
            background: $night-blue-lighter;
            color: $white;
        }
    }

    .ticker-logo-icon {
        margin-right: 0.5rem;

        &::before {
            font-family: FontAwesome,"cryptocoins" !important;
            content: "\f111";
        }
    }
</style>