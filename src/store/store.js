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
            online: null,
            offline: {
                username:'Anonymous',
                portfolios: [],
                settings: {
                    'defaultCurrency': 'USD',
                    'currencies': [],
                    'nightMode': true,
                    'autoSyncApi': true
                }
            },
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
        user: state => {
            if(state.loggedIn) {
                return state.user.online;
            } else {
                return state.user.offline;
            }
        },
        settings: (state, getters) => {
            return getters.user.settings;
        },
        userCurrencies: (state, getters) => {
            let currencies = [ getters.settings['defaultCurrency'] ];
            return currencies.concat(getters.settings.currencies);
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

    mutations: {
        setAuthToken(state, authToken) {
            state.user.online.authToken = authToken;
        },
        deletePassword(state) {
            delete state.user.online.password;
        },
        setLoggedIn(state, loggedIn) {
            state.loggedIn = loggedIn;
        },
        setUser(state, user) {
            state.user.online = user;
        },
        setUsername(state, username) {
            if(state.loggedIn) {
                state.user.online.username = username;
            } else {
                state.user.offline.username = username;
            }
        },
        setPortfolios(state, portfolios) {
            if(state.loggedIn) {
                Vue.set(state.user.online, 'portfolios', portfolios);
            } else {
                Vue.set(state.user.offline, 'portfolios', portfolios);
            }
        },
        setSettings(state, settings) {
            if(state.loggedIn) {
                Vue.set(state.user.online, 'settings', settings);
            } else {
                Vue.set(state.user.offline, 'settings', settings);
            }
        },
        removePortfolios(state) {
            if(state.loggedIn) {
                state.user.online.portfolios = [];
            } else {
                state.user.offline.portfolios = [];
            }
        },
        addPortfolio(state, portfolio) {
            if(state.loggedIn) {
                state.user.online.portfolios.push(portfolio);
            } else {
                state.user.offline.portfolios.push(portfolio);
            }
        },
        setPortfolio(state, {index, portfolio}) {
            if(state.loggedIn) {
                Vue.set(state.user.online.portfolios, index, portfolio);
            } else {
                Vue.set(state.user.offline.portfolios, index, portfolio);
            }
        },
        removePortfolio(state, index) {
            if(state.loggedIn) {
                state.user.online.portfolios.splice(index, 1);
            } else {
                state.user.offline.portfolios.splice(index, 1);
            }
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
            if(state.loggedIn) {
                state.user.online.settings['nightMode'] = nightMode;
            } else {
                state.user.offline.settings['nightMode'] = nightMode;
            }
        },
        setAutoSyncApi(state, autoSyncApi) {
            if(state.loggedIn) {
                state.user.online.settings['autoSyncApi'] = autoSyncApi;
            } else {
                state.user.offline.settings['autoSyncApi'] = autoSyncApi;
            }
        },
        setDefaultCurrency(state, defaultCurrency) {
            if(state.loggedIn) {
                state.user.online.settings['defaultCurrency'] = defaultCurrency;
            } else {
                state.user.offline.settings['defaultCurrency'] = defaultCurrency;
            }
        },
        setCurrencies(state, currencies) {
            if(state.loggedIn) {
                state.user.online.settings['currencies'] = currencies;
            } else {
                state.user.offline.settings['currencies'] = currencies;
            }
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
            context.commit('setNightMode',!context.getters.settings['nightMode']);
        },

        toggleAutoSyncApi(context) {
            context.commit('setAutoSyncApi',!context.getters.settings['autoSyncApi']);
        },

        addUsdBtcRate(context) {
            console.log(context.getters.tickerMap.get('bitcoin').price_usd)
            let rate = 1 / context.getters.tickerMap.get('bitcoin').price_usd;
            context.commit('addFiatRate', { currency: 'BTC', rate: rate});
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

        getAllExternalApiData(context) {
            return new Promise((resolve, reject) => {
                let getFiatRates = context.dispatch('getFiatData');
                let getCryptoTickers = context.dispatch('getCryptoData');
                let getCryptoGlobal = context.dispatch('getCryptoGlobalData');

                Promise.all([getFiatRates, getCryptoTickers, getCryptoGlobal]).then(() => {
                    context.dispatch('addUsdBtcRate');
                    resolve();
                }).catch((error) => {
                    console.log(error);
                    reject();
                });
            });
        },

        signUp(context, {username, password}){
            let user = {
                username: username,
                password: password,
            };

            return new Promise((resolve, reject) => {
                kryptonytt.signUp(user).then(() => {
                    context.dispatch('login',user).then(() => {
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

        login(context, {username, password}){
            return new Promise((resolve, reject) => {
                kryptonytt.login(username, password).then(response => {
                    context.commit('setUser', response.data);
                    context.commit('deletePassword'); // TODO: Remove
                    context.commit('setLoggedIn', true);
                    context.commit('setAuthToken', response.headers['authorization']);
                    resolve();
                }).catch(error => {
                    console.log(error.response);
                    reject();
                });
            })
        },

        logout(context){
            context.commit('setLoggedIn', false);
            context.commit('setUser', null);
        },

        getUser(context) {
            kryptonytt.getUser(context.state.user.online.authToken).then(response => {
                context.commit('setUser', response.data);
            }).catch(error => {
                console.log(error.response);
            });
        },

        updateSettings(context) {
            return new Promise((resolve, reject) => {
                kryptonytt.setUser(context.state.user.online.settings, context.state.user.online.authToken).then(response => {
                    context.commit('setSettings', response.data);
                    resolve();
                }).catch(error => {
                    console.log(error);
                    reject();
                });
            });
        },

        getPortfolios(context) {
            kryptonytt.getPortfolios(context.state.user.online.authToken).then(response => {
                context.commit('setPortfolios', response.data);
            }).catch(error => {
                console.log(error.response);
            });
        },

        addPortfolio(context, portfolioName) {
            let portfolio = {
                name: portfolioName,
                public: false,
                coins: [],
                customAssets: [],
                fiat: []
            };

            if(context.state.loggedIn) {
                kryptonytt.addPortfolio(portfolio, context.state.user.online.authToken).then(response => {
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
                    kryptonytt.updatePortfolio(portfolioName, portfolio, context.state.user.online.authToken).then(response => {
                        context.commit('setPortfolio', { index: index, portfolio: response.data});
                        EventBus.$emit('notify', {message: 'Portfolio updated successfully', duration: 2000});
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
        },

        deletePortfolio(context, { index, portfolioName }) {
            return new Promise((resolve, reject) => {
                if (context.state.loggedIn) {
                    kryptonytt.deletePortfolio(portfolioName, context.state.user.online.authToken).then(() => {
                        context.commit('removePortfolio', index);
                        EventBus.$emit('notify', {message: 'Portfolio deleted successfully', duration: 2000});
                        resolve();
                    }).catch(error => {
                        console.log(error.response);
                        EventBus.$emit('notify', {message: 'Could not delete portfolio', duration: 2000});
                        reject();
                    });
                } else {
                    context.commit('removePortfolio', index);
                }
            });
        }

    },

    plugins: [createPersistedState()]

});

export default store;