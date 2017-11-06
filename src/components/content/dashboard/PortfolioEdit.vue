<template>
    <div class="portfolio-edit row align-items-center justify-content-end">

        <div v-if="editable" class="col-xl">

            <div class="row align-items-center justify-content-end">

                <div class="col-auto">
                    <select-dropdown class="asset-type" v-model="assetType" :option-list="assetTypes">Asset Type</select-dropdown>
                </div>

                <div class="col-xl">
                    <ticker-search v-if="assetType.value == 'crypto'" :assets="portfolio.assets" @add="addAsset"></ticker-search>

                    <div v-else class="name m-input-group m-input-group-flat">
                        <input type="text" v-model="name" required>
                        <span class="bar"></span>
                        <label>Name</label>
                    </div>
                </div>

                <div v-if="assetType.value != 'crypto'" class="col-auto">
                    <div class="amount m-input-group m-input-group-flat">
                        <input type="text" v-model="amount" required>
                        <span class="bar"></span>
                        <label>Amount</label>
                    </div>
                </div>

                <div v-if="assetType.value == 'custom'" class="col-auto">
                    <div class="price m-input-group m-input-group-flat">
                        <input type="text" v-model="price" required>
                        <span class="bar"></span>
                        <label>Price</label>
                        <i class="multiply material-icons">close</i>
                    </div>
                </div>

                <div v-if="assetType.value != 'crypto'" class="col-auto">
                    <div class="currency">
                        <select-dropdown v-model="currency" :option-list="allCurrencies">Currency</select-dropdown>
                        <div class="in-currency">in</div>
                    </div>
                </div>

                <div v-if="assetType.value != 'crypto'" class="col-auto">
                    <button class="add-button m-button m-button-small m-button-block">
                        {{ assetType.value == 'custom' ? 'Add Asset' : 'Add Fiat' }}
                    </button>
                </div>

                <div class="col-auto">
                    <check-box v-model="portfolio.public" class="public m-checkbox-group m-checkbox-group-right">Public</check-box>
                </div>

            </div>

        </div>

        <div class="col-auto">

            <button v-if="editable" @click="save" class="save-button m-button m-button-small m-button-block">
                <beating-heart v-if="loading"></beating-heart>
                <template v-else>Save</template>
            </button>
            <button v-else @click="edit" class="edit-button m-button m-button-small m-button-block">
                Edit
            </button>

        </div>

    </div>
</template>

<script>
    import { EventBus } from '../../../EventBus'
    import BeatingHeart from '../../common/BeatingHeart.vue'
    import CheckBox from '../../common/CheckBox.vue'
    import SelectDropdown from '../../common/SelectDropdown.vue'
    import TickerSearch from './TickerSearch.vue'

    export default {
        props: [ 'portfolio', 'index' ],

        data() {
            return {
                editable: false,
                assetTypes: [
                    {
                        value: 'crypto',
                        text: 'Crypto'
                    },
                    {
                        value: 'fiat',
                        text: 'Fiat',

                    },
                    {
                        value: 'custom',
                        text: 'Custom',
                    }
                ],
                assetType: null,
                name: '',
                amount: '',
                price: '',
                currency: null,
                cachedPortfolioName: '',
                loading: false
            }
        },

        created() {
            this.assetType = this.assetTypes[0];
            this.currency = { text: this.defaultCurrency, value: this.defaultCurrency };
            this.cachedPortfolioName = this.portfolio.name;
        },

        computed: {
            allCurrencies() {
                return this.$store.getters.allCurrencies.map(currency => {
                    return { value: currency, text: currency }
                });
            },
            defaultCurrency() {
                return this.$store.state.user.settings['default-currency'];
            },
            offlineMode() {
                return this.$store.state.offlineMode;
            },
        },

        methods: {
            edit() {
                this.editable = true;
                this.$emit('editable', this.editable);
            },
            save() {
                // TODO: Cache old portfolio name
                this.loading = true;
                this.$store.dispatch('updatePortfolio',{ index: this.index, portfolioName: this.cachedPortfolioName, portfolio: this.portfolio }).then(() => {
                    this.loading = false;
                    this.cachedPortfolioName = this.portfolio.name;
                    this.editable = false;
                    this.$emit('editable', this.editable);
                }).catch(() => {
                    this.loading = false;
                });
                //EventBus.$emit('update-portfolio'); // Plot.ly Pie-chart event
            },
            addAsset(tickerId) {
                this.portfolio.assets.push({ identifier: tickerId, amount: 0, custom: false });
                this.$emit('addAssetToActive', tickerId);
            }
        },

        components: { CheckBox, SelectDropdown, TickerSearch, BeatingHeart }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .portfolio-edit {

        .asset-type {
            width: 5rem;
        }

        .amount {
            width: 5rem;
        }

        .price {
            width: 5rem;
            position: relative;

            .multiply {
                position: absolute;
                left: -23px;
                top: 12px;
                cursor: default;
                user-select: none;
                font-size: 16px;
            }
        }

        .currency {
            width: 5rem;
            position: relative;

            .in-currency {
                position: absolute;
                left: -23px;
                top: 11px;
                cursor: default;
                user-select: none;
                font-size: 16px;
                line-height: 1;
            }
        }

        .tickers {
            width: 5rem;
        }

        .add-button, .edit-button, .save-button {
            width: 6rem;
        }

    }
</style>