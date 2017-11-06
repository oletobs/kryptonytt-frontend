import axios from 'axios';

class Fixxer {

    static getRatesBaseUSD() {
        return axios.get('https://api.fixer.io/latest?base=USD')
    }
}

export default Fixxer;