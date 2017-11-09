import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import kryptonytt from '../api/kryptonytt'
import cmcap from '../api/cmcap.js'
import fixxer from '../api/fixxer.js'
import { EventBus } from '../EventBus'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: {
            username:'',
            authToken: '',
            portfolios: [],
            settings: {
                'default-currency': 'USD',
                'currencies': [],
                'night-mode': true,
                'auto-sync-api': false
            }
        },
        loggedIn: false,
        offlineMode: false,
        data: {
            fiat: {
                rates: null,
                lastUpdated: null
            },
            crypto: {
                global: null,
                tickers: null,
                lastUpdated: null
            }
        }
    },

    getters: {
        settings: state => {
            return state.user.settings;
        },
        userCurrencies: state => {
            let currencies = [ state.user.settings['default-currency'] ];
            return currencies.concat(state.user.settings.currencies);
        },
        allCurrencies: state => {
            let allCurrencies = Object.keys(state.data.fiat.rates);
            allCurrencies.unshift('BTC');
            return allCurrencies;
        },
        tickerMap: state => {
            let tickerMap = new Map();
            state.data.crypto.tickers.forEach(ticker => {
                tickerMap.set(ticker.id,ticker);
            });
            return tickerMap;
        }
    },

    plugins: [createPersistedState()],

    mutations: {
        addWebToken(state, webToken){
            state.user.authToken = webToken;
        },
        removeWebToken(state){
            state.user.authToken = '';
        },
        setLoggedIn(state, loggedIn) {
            state.loggedIn = loggedIn;
        },
        setUsername(state, username) {
            state.user.username = username;
        },
        setPortfolios(state, portfolios) {
            state.user.portfolios = portfolios;
        },
        removePortfolios(state) {
            state.user.portfolios = [];
        },
        addPortfolio(state, portfolio) {
            state.user.portfolios.push(portfolio);
        },
        setPortfolio(state, {index, portfolio}) {
            Vue.set(state.user.portfolios, index, portfolio);
        },
        setFiatRates(state, rates) {
            state.data.fiat.rates = rates;
        },
        setCryptoTickers(state, tickers) {
            state.data.crypto.tickers = tickers;
        },
        setFiatLastUpdated(state, timestamp) {
            state.data.fiat.lastUpdated = timestamp;
        },
        setCryptoLastUpdated(state, timestamp) {
            state.data.crypto.lastUpdated = timestamp;
        },
        addFiatRate(state, { currency, rate }) {
            Vue.set(state.data.fiat.rates, currency, rate);
        },
        setNightMode(state, nightMode) {
            state.user.settings['night-mode'] = nightMode;
        },
        setAutoSyncApi(state, autoSyncApi) {
            state.user.settings['auto-sync-api'] = autoSyncApi;
        },
        setDefaultCurrency(state, defaultCurrency) {
            state.user.settings['default-currency'] = defaultCurrency;
        },
        setCurrencies(state, currencies) {
            state.user.settings['currencies'] = currencies;
        },
        setOfflineMode(state, offline) {
            state.offlineMode = offline;
        },
        setCryptoGlobal(state, global) {
            state.data.crypto.global = global;
        }
    },
    actions: {
        toggleNightMode(context) {
            context.commit('setNightMode',!context.state.user.settings['night-mode']);
        },

        toggleAutoSyncApi(context) {
            context.commit('setAutoSyncApi',!context.state.user.settings['auto-sync-api']);
        },

        getFiatData(context) {
            return new Promise((resolve, reject) => {
                fixxer.getRatesBaseUSD().then(response => {
                    context.commit('setFiatRates', response.data.rates);
                    context.commit('addFiatRate', { currency: 'USD', rate: 1});
                    context.commit('setFiatLastUpdated', +new Date());
                    resolve();
                }).catch(error => {
                    console.log(error.response);
                    reject();
                });
            });
        },

        getCryptoData(context) {
            return new Promise((resolve, reject) => {
                cmcap.getTickers().then(response => {
                    context.commit('setCryptoTickers', response.data);
                    context.commit('setCryptoLastUpdated', +new Date());
                    resolve();
                }).catch(error => {
                    console.log(error.response);
                    reject();
                });
            });
        },

        getCryptoGlobalData(context) {
            return new Promise((resolve, reject) => {
                cmcap.getGlobal().then(response => {
                    context.commit('setCryptoGlobal', response.data);
                    resolve();
                }).catch(error => {
                    console.log(error.response);
                    reject();
                });
            });
        },

        goOffline(context) {
            context.commit('setOfflineMode', true);
            context.commit('setUsername', 'Anonymous');
        },

        goOnline(context) {
            context.commit('setOfflineMode', false);
            context.commit('setUsername', '');
        },

        signUp(context, userInput){
            return new Promise((resolve, reject) => {
                kryptonytt.signUp(userInput.username, userInput.password).then(() => {
                    context.dispatch('login',userInput).then(() => {
                        resolve();
                    }).catch(() => {
                        reject();
                    })
                }).catch(error => {
                    console.log(error.response);
                    reject();
                });
            })
        },

        login(context, userInput){
            return new Promise((resolve, reject) => {
                kryptonytt.login(userInput.username, userInput.password).then(response => {
                    context.commit('addWebToken', response.headers['authorization']);
                    context.commit('setUsername', userInput.username);
                    context.commit('setLoggedIn', true);
                    resolve();
                }).catch(error => {
                    console.log(error.response);
                    reject();
                });
            })
        },

        logout(context){
            context.commit('removeWebToken');
            context.commit('setUsername', '');
            context.commit('setLoggedIn', false);
            context.commit('removePortfolios');
        },

        getPortfolios(context) {
            kryptonytt.getPortfolios(context.state.user.authToken).then(response => {
                context.commit('setPortfolios', response.data);
            }).catch(error => {
                console.log(error.response);
            });
        },

        addPortfolio(context, portfolioName) {
            let portfolio = {
                name: portfolioName,
                public: false,
                assets: []
            };

            if(context.state.loggedIn) {
                kryptonytt.addPortfolio(context.state.user.authToken, portfolio).then(response => {
                    context.commit('addPortfolio', response.data);
                    EventBus.$emit('notify', { message: 'Portfolio added', duration: 2000 });
                }).catch(error => {
                    console.log(error.response);
                    EventBus.$emit('notify', { message: 'Could not add portfolio', duration: 2000 });
                });
            } else {
                context.commit('addPortfolio', portfolio);
            }
        },

        updatePortfolio(context, { index, portfolioName, portfolio }) {
            return new Promise((resolve, reject) => {
                if (context.state.loggedIn) {
                    kryptonytt.updatePortfolio(context.state.user.authToken, portfolioName, portfolio).then(response => {
                        context.commit('setPortfolio', { index: index, portfolio: response.data});
                        EventBus.$emit('notify', {message: 'Portfolio updated', duration: 2000});
                        resolve();
                    }).catch(error => {
                        console.log(error.response);
                        EventBus.$emit('notify', {message: 'Could not update portfolio', duration: 2000});
                        reject();
                    });
                } else {
                    context.commit('setPortfolio', {index, portfolio});
                    resolve();
                }
            });
        }

    }

});

export default store;