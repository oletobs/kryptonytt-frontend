<template>
    <div class="portfolio-edit row align-items-center justify-content-end">

        <div v-if="editable" class="col-xl">

            <div class="row align-items-center justify-content-end">

                <div class="col-auto">
                    <select-dropdown class="asset-type" v-model="userInput.assetType" :option-list="assetTypes">Asset Type</select-dropdown>
                </div>

                <div class="col-xl">
                    <ticker-search v-if="userInput.assetType.value == 'crypto'" :coins="portfolio.coins" @add="addCoin"></ticker-search>

                    <div v-else class="name m-input-group m-input-group-flat">
                        <input type="text" v-model="userInput.name" required>
                        <span class="bar"></span>
                        <label>Name</label>
                    </div>
                </div>

                <div v-if="userInput.assetType.value != 'crypto'" class="col-auto">
                    <div class="amount m-input-group m-input-group-flat">
                        <input type="text" v-model="userInput.amount" required>
                        <span class="bar"></span>
                        <label>Amount</label>
                    </div>
                </div>

                <div v-if="userInput.assetType.value == 'custom'" class="col-auto">
                    <div class="price m-input-group m-input-group-flat">
                        <input type="text" v-model="userInput.price" required>
                        <span class="bar"></span>
                        <label>Price</label>
                        <i class="multiply material-icons">close</i>
                    </div>
                </div>

                <div v-if="userInput.assetType.value != 'crypto'" class="col-auto">
                    <div class="currency">
                        <select-dropdown v-model="userInput.currency" :option-list="allCurrencies">Currency</select-dropdown>
                        <div class="in-currency">in</div>
                    </div>
                </div>

                <div v-if="userInput.assetType.value != 'crypto'" class="col-auto">
                    <button class="add-button m-button m-button-small m-button-block" @click="addAsset">
                        {{ userInput.assetType.value == 'custom' ? 'Add Asset' : 'Add Fiat' }}
                    </button>
                </div>

                <div class="col-auto">
                    <check-box v-model="portfolio.public" class="public m-checkbox-group m-checkbox-group-right">Public</check-box>
                </div>

                <div class="col-auto">
                    <button @click="deletePortfolio" class="save-button m-button m-button-small m-button-block"  :disabled="loadingAny">
                        <beating-heart v-if="loading.deletePortfolio"></beating-heart>
                        <template v-else>Delete</template>
                    </button>
                </div>

            </div>

        </div>

        <div class="col-auto">

            <button v-if="editable" @click="savePortfolio" class="save-button m-button m-button-small m-button-block"  :disabled="loadingAny">
                <beating-heart v-if="loading.savePortfolio"></beating-heart>
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
                editable: false,
                cachedPortfolioName: '',
                userInput: {
                    name: '',
                    amount: '',
                    price: '',
                    currency: null,
                    assetType: null,
                },
                loading: {
                    deletePortfolio: false,
                    savePortfolio: false,
                }
            }
        },

        created() {
            this.userInput.assetType = this.assetTypes[0];
            this.userInput.currency = { text: this.userDefaultCurrency, value: this.userDefaultCurrency };
            this.cachedPortfolioName = this.portfolio.name;
        },

        computed: {
            allCurrencies() {
                return this.$store.getters.allCurrencies.map(currency => {
                    return { value: currency, text: currency }
                });
            },
            userDefaultCurrency() {
                return this.$store.getters.user.settings['defaultCurrency'];
            },
            offlineMode() {
                return this.$store.state.offlineMode;
            },
            loadingAny() {
                return this.loading.deletePortfolio || this.loading.savePortfolio;
            }
        },

        methods: {
            edit() {
                this.editable = true;
                this.$emit('editable', this.editable);
            },
            savePortfolio() {
                if(this.portfolio.name.length == 0) return 0;
                this.loading.savePortfolio = true;
                this.$store.dispatch('updatePortfolio', { index: this.index, portfolioName: this.cachedPortfolioName, portfolio: this.portfolio }).then(() => {
                    this.loading.savePortfolio = false;
                    this.editable = false;
                    this.$emit('editable', this.editable);
                    this.cachedPortfolioName = this.portfolio.name;
                }).catch(() => {
                    this.loading.savePortfolio = false;
                });
            },
            deletePortfolio() {
                this.loading.deletePortfolio = true;
                this.$store.dispatch('deletePortfolio', { index: this.index, portfolioName: this.cachedPortfolioName }).then(() => {
                    this.loading.deletePortfolio = false;
                }).catch(() => {
                    this.loading.deletePortfolio = false;
                });
            },
            addCoin(tickerId) {
                this.portfolio.coins.push({ identifier: tickerId, amount: '' });
            },
            addAsset() {
                if(this.userInput.assetType.value == 'fiat') {
                    this.portfolio.fiat.push({
                        identifier: this.userInput.name,
                        amount: this.userInput.amount,
                        currency: this.userInput.currency.value
                    });
                    this.clearUserInput();
                } else if(this.userInput.assetType.value == 'custom') {
                    this.portfolio.customAssets.push({
                        identifier: this.userInput.name,
                        amount: this.userInput.amount,
                        price: this.userInput.price,
                        currency: this.userInput.currency.value
                    });
                    this.clearUserInput();
                }
            },
            clearUserInput() {
                this.userInput.name = '';
                this.userInput.amount = '';
                this.userInput.price = '';
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