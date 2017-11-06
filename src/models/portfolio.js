import axios from 'axios';

class Portfolio {

    static all() {
        return axios.get('http://kryptonytt.io:8080/portfolios');
    }
}

export default Portfolio;