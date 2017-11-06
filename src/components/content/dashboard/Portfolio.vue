<template>
    <div class="portfolio">

        <div class="row align-items-center justify-content-between portfolio-header">

            <div class="col-xl-3">

                <h4 class="portfolio-title" v-if="!editable">{{ portfolio.name }}</h4>

                <div v-else class="m-input-group m-input-group-flat">
                    <input type="text" v-model="portfolio.name" required>
                    <span class="bar"></span>
                    <label>Portfolio Name</label>
                </div>

            </div>

            <div class="col-xl-8">
                <portfolio-edit :portfolio="portfolio" :index="index" @addAssetToActive="addAssetToActive" @editable="toggleEditable"></portfolio-edit>
            </div>

        </div>

        <div class="portfolio-table-container">
            <div class="table-responsive">
                <table class="table portfolio-table">
                    <thead>
                    <tr>
                        <th>Asset Name</th>
                        <th class="u-w10r">Amount</th>
                        <th class="u-w10r">{{ userCurrencies[0] }} Last Price</th>
                        <th class="u-w10r" v-for="currency in userCurrencies">
                            {{ currency }} Value
                        </th>
                        <th class="u-w5r">&Delta; 1H</th>
                        <th class="u-w5r">&Delta; 24H</th>
                        <th class="u-w5r">&Delta; 7D</th>
                    </tr>
                    </thead>
                    <tbody>
                    <asset
                            v-for="(asset, index) in portfolio.assets"
                            :key="asset.identifier"
                            :color="chartData[index].color"
                            :editable="editable"
                            :asset="asset"
                            :ticker="tickerMap.get(asset.identifier)"
                            :rates="rates"
                            :active="active[asset.identifier]"
                            :currencies="userCurrencies"
                            @remove="removeAsset"
                    >
                    </asset>
                    </tbody>
                    <tfoot>
                    <tr>
                        <th colspan="3">Total</th>
                        <th v-for="portfolioValue in portfolioValues">
                            {{ getCurrencySymbol(portfolioValue.currency) }}{{ portfolioValue.value | financify }}
                        </th>
                        <th colspan="3"></th>
                    </tr>
                    </tfoot>
                </table>
            </div>

            <single-bar-chart
                    v-if="portfolioValues[0].value > 0"
                    class="portfolio-chart"
                    :data="chartData"
                    :active="active"
                    @toggleActive="toggleActiveAsset">
            </single-bar-chart>
        </div>

    </div>
</template>

<script>
    import filters from '../../../mixins/filters'
    import Charts from '../../../charts'
    import { EventBus } from '../../../EventBus'
    import Asset from './Asset.vue'
    import SingleBarChart from '../../common/SingleBarChart.vue'
    import PortfolioEdit from './PortfolioEdit.vue'

    export default {
        components: { Asset, SingleBarChart, PortfolioEdit },

        props: [ 'portfolio', 'rates', 'tickerMap', 'index' ],

        mixins: [ filters ],

        data() {
            return {
                editable: false,
                active: {},
            }
        },

        created() {
            this.portfolio.assets.forEach(asset => {
                this.$set(this.active, asset.identifier, false)
            });
        },

        computed: {
            userCurrencies() {
                return this.$store.getters.userCurrencies;
            },

            portfolioValues() {
                let sums = [];
                this.userCurrencies.forEach(currency => {
                    sums.push({ currency: currency, value: 0 })
                });

                this.portfolio.assets.forEach(asset => {
                    sums.forEach(sum => {
                        if(sum.currency == 'BTC') {
                            sum.value += asset.amount * this.tickerMap.get(asset.identifier).price_btc;
                        } else {
                            sum.value += asset.amount * this.tickerMap.get(asset.identifier).price_usd * this.rates[sum.currency];
                        }
                    });
                });

                return sums;
            },

            chartData() {
                return Charts.getChartData(this.portfolio.assets,this.tickerMap,this.portfolioValues[0].value,this.rates[this.userCurrencies[0]]);
            }
        },

        methods: {
            toggleActiveAsset(assetIdentifier) {
                this.$set(this.active, assetIdentifier, !this.active[assetIdentifier]);
            },
            removeAsset(asset) {
                this.portfolio.assets.splice(this.portfolio.assets.findIndex(a => a.identifier == asset.identifier),1);
            },
            toggleEditable(editable) {
                this.editable = editable;
            },
            addAssetToActive(tickerId) {
                this.$set(this.active, tickerId, false);
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .portfolio {
        margin-bottom: 2.5rem;
    }

    .portfolio-table {
        text-align: right;
        white-space: nowrap;
        margin-bottom: 0;

        th:first-child, td:first-child{
            text-align: left;
        }
    }

    .portfolio-table-container {
        background-color: $night-blue-medium;
        box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
    }

    .u-w15p {
        width: 15%;
    }

    .u-w5r {
        width: 5rem;
    }

    .u-w10r {
        width: 10rem;
    }

    .portfolio-header {
        height: calc(1.5rem + 10px);
        margin-bottom: 0.5rem;
    }

    .portfolio-title {
        margin: 0;
    }

    .portfolio-chart {
        height: 30px;
    }
</style>