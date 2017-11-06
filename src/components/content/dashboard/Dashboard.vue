<template>
    <div class="portfolios" v-if="portfolios">

        <div class="portfolios-overview row">

            <div class="col-md">
                <card>

                    <p class="h5" slot="header">Overview</p>

                    <template slot="content">
                        <div class="row overview-stats">
                            <div class="col-auto sub-header">
                                <div>{{ portfolios.length }}</div>
                                <small>Porfolio(s)</small>
                            </div>
                            <div class="col-auto sub-header">
                                <div>{{ cryptoExposure }}</div>
                                <small>Percent Crypto Exposure</small>
                            </div>
                            <div class="col-auto sub-header">
                                <div>{{ statistics.totalAssets }}</div>
                                <small>Asset(s)</small>
                            </div>
                        </div>

                        <div class="row add-portfolio">

                            <div class="col">

                                <div class="m-input-group m-input-group-flat">
                                    <input type="text" v-model="newPortfolioName" @input="inputInvalid.newPortfolioName = false" :class="{ 'invalid': inputInvalid.newPortfolioName }" required>
                                    <span class="bar"></span>
                                    <label>Portfolio name</label>
                                    <span class="invalid-message" v-if="inputInvalid.newPortfolioName">Required and must be unique.</span>
                                </div>

                            </div>

                            <div class="col-auto">

                                <button class="m-button m-button-small" @click="addPortfolio">
                                    Add Portfolio
                                </button>

                            </div>

                        </div>
                    </template>

                    <div class="market-value" slot="side">
                        <div class="default-currency">
                            {{ getCurrencySymbol(userCurrencies[0]) }}{{ statistics.marketValueTotal[userCurrencies[0]] | financify }}
                        </div>
                        <small>Total Market Value</small>
                        <ul class="list-group list-group-fill list-group-small">
                            <li v-for="(marketValue, currency) in statistics.marketValueTotal" class="list-group-item" v-if="currency != userCurrencies[0]">
                                {{ getCurrencySymbol(currency) }}{{ marketValue | financify }}
                            </li>
                        </ul>
                    </div>

                </card>
            </div>

            <div class="col-md-auto">
                <card>

                    <p class="h5" slot="header">Asset Type Breakdown</p>

                    <pie-chart slot="content" :rows="statistics.marketValuePerAssetType"></pie-chart>

                    <div slot="side" class="value-breakdown">
                        <div v-for="assetTypeMarketValue in statistics.marketValuePerAssetType">
                            <div class="value">{{ getCurrencySymbol(userCurrencies[0]) }}{{ assetTypeMarketValue[1] | financify }}</div>
                            <small>{{ assetTypeMarketValue[0] }}</small>
                        </div>
                    </div>

                </card>
            </div>

            <div class="col-md-auto">
                <card>

                    <p class="h5" slot="header">Portfolio Breakdown</p>

                    <pie-chart slot="content" v-if="statistics.marketValuePerPortfolio.length > 0" :rows="statistics.marketValuePerPortfolio"></pie-chart>

                    <div slot="side" class="value-breakdown">
                        <div v-for="portfolioMarketValue in statistics.marketValuePerPortfolio">
                            <div class="value">{{ getCurrencySymbol(userCurrencies[0]) }}{{ portfolioMarketValue[1] | financify }}</div>
                            <small>{{ portfolioMarketValue[0] }}</small>
                        </div>
                    </div>

                </card>
            </div>

            <div class="col-md-auto">
                <card>

                    <div class="market-summary" slot="content">
                        <div class="sub-header">
                            <div>${{ cryptoGlobal.total_market_cap_usd | headify }}</div>
                            <small>Market Capitalization</small>
                        </div>
                        <div class="sub-header">
                            <div>{{ cryptoGlobal.bitcoin_percentage_of_market_cap }}%</div>
                            <small>of which is Bitcoin</small>
                        </div>
                        <div class="sub-header">
                            <div>{{ (cryptoGlobal.total_market_cap_usd / 27352200000000) * 100 | financify }}%</div>
                            <small>of US stock market</small>
                        </div>
                        <div class="sub-header">
                            <div>${{ cryptoGlobal.total_24h_volume_usd | headify }}</div>
                            <small>Volum 24H</small>
                        </div>
                    </div>

                </card>
            </div>

        </div>

        <div class="portfolios-tables row">

            <div class="col">

                <portfolio
                        v-for="(portfolio, index) in portfolios"
                        :portfolio="portfolio"
                        :rates="rates"
                        :tickerMap="tickerMap"
                        :index="index"
                        :key="index"
                >
                </portfolio>

            </div>

        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import filters from '../../../mixins/filters'
    import Portfolio from './Portfolio.vue'
    import Card from '../../common/Card.vue'
    import PieChart from '../../common/PieChart.vue'

    export default {
        props: [ 'rates' ],

        data() {
            return {
                newPortfolioName: '',
                inputInvalid: {
                    newPortfolioName: false
                }
            }
        },

        created() {
            if(this.loggedIn) {
                this.getPortfolios();
            }
        },

        computed: {
            statistics() {
                let statistics = {
                    marketValueTotal: {},
                    marketValuePerPortfolio: [],  // Formatted for use with google charts
                    marketValuePerAssetType: [    // Formatted for use with google charts
                        ['Crypto', 0],
                        ['Fiat', 0],
                        ['Custom Asset', 0]
                    ],
                    totalAssets: 0
                };

                this.userCurrencies.forEach(currency => statistics.marketValueTotal[currency] = 0);

                this.portfolios.forEach((portfolio, index) => {
                    statistics.marketValuePerPortfolio.push([portfolio.name,0]);
                    statistics.totalAssets += portfolio.assets.length;

                    portfolio.assets.forEach(asset => {

                        // Have to use different calculations if default user currency is btc, as the dollar rate may differ slightly between apis
                        if(this.userCurrencies[0] == 'BTC') {
                            if(!asset.custom) {
                                statistics.marketValuePerAssetType[0][1] += asset.amount * this.tickerMap.get(asset.identifier).price_btc;
                            } //TODO: add for custom and fiat
                            statistics.marketValuePerPortfolio[index][1] += asset.amount * this.tickerMap.get(asset.identifier).price_btc;
                        } else {
                            if(!asset.custom) {
                                statistics.marketValuePerAssetType[0][1] += asset.amount * this.tickerMap.get(asset.identifier).price_usd * this.rates[this.userCurrencies[0]];
                            } //TODO: add for custom and fiat
                            statistics.marketValuePerPortfolio[index][1] += asset.amount * this.tickerMap.get(asset.identifier).price_usd * this.rates[this.userCurrencies[0]];
                        }

                        this.userCurrencies.forEach(currency => {
                            if(currency == 'BTC') {
                                statistics.marketValueTotal[currency] += asset.amount * this.tickerMap.get(asset.identifier).price_btc;
                            } else {
                                statistics.marketValueTotal[currency] += asset.amount * this.tickerMap.get(asset.identifier).price_usd * this.rates[currency];
                            }
                        });

                    });

                });

                return statistics;
            },

            publicPortfolios() {
                let sum = 0;
                this.portfolios.forEach(p => {
                    if(p.public === true) sum++;
                });
                return sum;
            },

            cryptoExposure() {
                return this.statistics.marketValueTotal[this.userCurrencies[0]] == 0 ? 0 : (this.statistics.marketValuePerAssetType[0][1] / this.statistics.marketValueTotal[this.userCurrencies[0]]) * 100;
            },

            userCurrencies() {
                return this.$store.getters.userCurrencies;
            },

            tickerMap() {
                return this.$store.getters.tickerMap;
            },

            ...mapState({
                portfolios: state => state.user.portfolios,

                loggedIn: state => state.loggedIn,

                cryptoGlobal: state => state.data.crypto.global
            })
        },

        methods: {
            getPortfolios() {
                this.$store.dispatch('getPortfolios');
            },

            addPortfolio() {
                if(this.validateInput()) {
                    this.$store.dispatch('addPortfolio', this.newPortfolioName);
                    this.newPortfolioName = '';
                }
            },

            validateInput() {
                let valid = true;
                if(this.newPortfolioName == '' || this.portfolios.find(p => p.name == this.newPortfolioName) != null) {
                    this.inputInvalid.newPortfolioName = true;
                    valid = false;
                }
                return valid;
            }
        },

        mixins: [ filters ],

        components: { Portfolio, Card, PieChart }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .portfolios-overview {
        margin-bottom: 2.5rem;
    }

    .value-breakdown {
        padding: 0.75rem 1.25rem;
        max-height: 250px;
        overflow-y: auto;
        min-width: 5rem;

        &::-webkit-scrollbar {
            width: 0.5em;
        }

        &::-webkit-scrollbar-thumb {
            background-color: lighten($night-blue-medium,15);
            outline: 1px solid slategrey;
        }

        .value {
            color: $night-blue-lighter;
            font-weight: 500;
            font-size: 1rem;
        }

        small {
            font-size: 80%;
            display: block;
            margin-top: -2px;
            margin-bottom: 0.5rem;
        }
    }

    .overview-stats {
        justify-content: space-around;
        text-align: center;

        div div {
            font-size: 4rem;
        }
    }

    .market-summary {
        height: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .market-value {
        padding: 0.75rem 1.25rem;

        .default-currency {
            color: $night-blue-lighter;
            font-weight: 500;
            font-size: 1.5rem;
        }

        small {
            font-size: 80%;
            display: block;
            margin-top: -2px;
        }

        ul {
            font-weight: 500;
        }
    }

    .add-portfolio {
        margin-top: auto;
        margin-bottom: 8px;
        align-items: center;
    }
</style>