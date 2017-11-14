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
                                <div>{{ cryptoExposure | headify }}</div>
                                <small>Percent Crypto Exposure</small>
                            </div>
                            <div class="col-auto sub-header">
                                <div>{{ statistics.totalCryptoCoins + statistics.totalCustomAssets }}</div>
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
                            {{ getCurrencySymbol(userDefaultCurrency) }}{{ statistics.marketValueTotal * rates[userDefaultCurrency] | financify }}
                        </div>
                        <small>Total Market Value</small>
                        <ul class="list-group list-group-fill list-group-small">
                            <li v-for="currency in userCurrencies" class="list-group-item" v-if="currency != userDefaultCurrency">
                                {{ getCurrencySymbol(currency) }}{{ statistics.marketValueTotal * rates[currency] | financify }}
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
                            <div class="value">{{ getCurrencySymbol(userDefaultCurrency) }}{{ assetTypeMarketValue[1] | financify }}</div>
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
                            <div class="value">{{ getCurrencySymbol(userDefaultCurrency) }}{{ portfolioMarketValue[1] | financify }}</div>
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
                        :key="portfolio.id"
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
                    marketValueTotal: 0,
                    marketValuePerPortfolio: [], // Formatted for use with google charts
                    marketValuePerAssetType: [ ['Crypto', 0], ['Custom Assets', 0], ['Fiat', 0] ], // Formatted for use with google charts
                    totalCryptoCoins: 0,
                    totalCustomAssets: 0,
                };

                this.portfolios.forEach(portfolio => {
                    let coinValueUsd = 0;
                    portfolio.coins.forEach(coin => {
                        coinValueUsd += coin.amount * this.tickerMap.get(coin.identifier).price_usd;
                    });

                    let fiatValueUsd = 0;
                    portfolio.fiat.forEach(fiat => {
                        fiatValueUsd += fiat.amount / this.rates[fiat.currency];
                    });

                    let customAssetValueUsd = 0;
                    portfolio.customAssets.forEach(customAsset => {
                        customAssetValueUsd += (customAsset.amount * customAsset.price) / this.rates[customAsset.currency];
                    });

                    // Total Market Value in usd
                    statistics.marketValueTotal += coinValueUsd+fiatValueUsd+customAssetValueUsd;

                    // Market values in users default currency
                    statistics.marketValuePerPortfolio.push([portfolio.name,(coinValueUsd+fiatValueUsd+customAssetValueUsd) * this.rates[this.userDefaultCurrency]]);
                    statistics.marketValuePerAssetType[0][1] += coinValueUsd * this.rates[this.userDefaultCurrency];
                    statistics.marketValuePerAssetType[1][1] += fiatValueUsd * this.rates[this.userDefaultCurrency];
                    statistics.marketValuePerAssetType[2][1] += customAssetValueUsd * this.rates[this.userDefaultCurrency];

                    // Number of coins and custom asset
                    statistics.totalCryptoCoins += portfolio.coins.length;
                    statistics.totalCustomAssets += portfolio.customAssets.length;
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
                if(this.statistics.marketValueTotal == 0) {
                    return 0;
                } else {
                    return (this.statistics.marketValuePerAssetType[0][1] / (this.statistics.marketValueTotal*this.rates[this.userDefaultCurrency])) * 100;
                }
            },

            userCurrencies() {
                return this.$store.getters.userCurrencies;
            },

            userDefaultCurrency() {
                return this.userCurrencies[0];
            },

            tickerMap() {
                return this.$store.getters.tickerMap;
            },

            portfolios() {
                return this.$store.getters.user.portfolios;
            },

            ...mapState({
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