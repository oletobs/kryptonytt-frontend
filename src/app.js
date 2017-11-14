import Vue from 'vue'
import router from './routes.js'
import store from './store/store'
import { mapState } from 'vuex'
import { EventBus } from './EventBus'
import LeftBar from './components/layout/leftbar/LeftBar.vue'
import Snackbar from './components/common/Snackbar.vue'
import VueCharts from 'vue-charts'
import './assets/favicon.ico';

Vue.use(VueCharts);

new Vue({
    el: '#app',

    components: { LeftBar, Snackbar },

    router,

    store,

    data() {
        return {
            loading: true,
            showSideNav: false,
            snackbar: {
                show: false,
                timer: null,
                message: ''
            },
            autoSyncApiTimer: null,
            loading: {
                externalApi: false
            }
        }
    },

    computed: {
        loadingAny() {
            return this.loading.externalApi;
        },

        nightMode() {
            return this.$store.getters.settings['nightMode'];
        },

        autoSyncApi() {
            return this.$store.getters.settings['autoSyncApi'];
        },

        cachedExternalApiData() {
            return this.tickers != null && this.rates != null;
        },

        ...mapState({
            cryptoLastUpdated: state => state.data.crypto.lastUpdated,

            fiatLastUpdated: state => state.data.fiat.lastUpdated,

            tickers: state => state.data.crypto.tickers,

            rates: state => state.data.fiat.rates,

            loggedIn: state => state.loggedIn,

            offlineMode: state => state.offlineMode
        })
    },

    watch: {
        autoSyncApi() {
            clearInterval(this.autoSyncApiTimer);
            if(this.autoSyncApi) {
                console.log('watcher true')
                this.autoSyncApiTimer = setInterval(() => {
                    this.getAllExternalApiData();
                }, 300000);

            } else {
                console.log('watcher false')
            }
        }
    },

    mounted() {
        this.getAllExternalApiData();

        if(this.autoSyncApi) {
            console.log('mounted true')
            this.autoSyncApiTimer = setInterval(() => {
                this.getAllExternalApiData();
            }, 300000);
        }

        EventBus.$on('notify', this.notify);
    },

    methods: {
        notify({message,duration}) {
            clearTimeout(this.snackbar.timer);
            this.snackbar.message = message;
            this.snackbar.show = true;

            this.snackbar.timer = setTimeout(() => {
                this.snackbar.show = false;
                this.snackbar.message = '';
            }, duration);
        },

        getAllExternalApiData() {
            this.loading.externalApi = true;
            this.$store.dispatch('getAllExternalApiData').then(() => {
                this.loading.externalApi = false;
            }).catch(() => {
                this.loading.externalApi = false;
            });
        }
    }
});
