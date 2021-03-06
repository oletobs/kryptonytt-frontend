import axios from 'axios';

class CMCap {

    static getTickers() {
        return axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=0')
    }

    static getGlobal() {
        return axios.get('https://api.coinmarketcap.com/v1/global/')
    }
}

export default CMCap;