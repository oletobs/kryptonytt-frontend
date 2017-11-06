import Format from '../Format.js'
import getSymbolFromCurrency from 'currency-symbol-map'

export default {
    filters: {
        financify(value) {
            if(value == 0) return Format.number(2).format(value);
            if(value*10000 < 1) return Format.number(6).format(value);
            if(value*100 < 1) return Format.number(4).format(value);
            return Format.number(2).format(value);
        },

        headify(value) {
            return Format.number(0).format(value);
        },

        dateify(value) {
            let date = new Date(parseInt(value));
            return ((date.getHours() < 10)   ? '0'+date.getHours()   : date.getHours())   + ":" +
                ((date.getMinutes() < 10) ? '0'+date.getMinutes() : date.getMinutes()) + ":" +
                ((date.getSeconds() < 10) ? '0'+date.getSeconds() : date.getSeconds());
        }
    },

    methods: {
        getCurrencySymbol(currency) {
            return getSymbolFromCurrency(currency);
        }
    }
};