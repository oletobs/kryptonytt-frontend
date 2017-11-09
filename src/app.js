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
        }
    },

    computed:  mapState({
        cryptoLastUpdated: state => state.data.crypto.lastUpdated,

        fiatLastUpdated: state => state.data.fiat.lastUpdated,

        tickers: state => state.data.crypto.tickers,

        rates: state => state.data.fiat.rates,

        nightMode: state => state.user.settings['night-mode'],

        loggedIn: state => state.loggedIn,

        offlineMode: state => state.offlineMode,

        cachedData() {
            return this.tickers != null && this.rates != null;
        }
    }),

    mounted() {
        let getFiatRates = this.$store.dispatch('getFiatData');
        let getCryptoTickers = this.$store.dispatch('getCryptoData');
        let getCryptoGlobal = this.$store.dispatch('getCryptoGlobalData');

        if(this.cachedData) {
            this.loading = false;
        }

        Promise.all([getFiatRates, getCryptoTickers, getCryptoGlobal]).then(() => {
            if(this.loading == true) {
                this.loading = false;
            }
        });

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
        }
    }
});
