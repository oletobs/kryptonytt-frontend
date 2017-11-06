import axios from 'axios';

class Kryptonytt {

    static signUp(username,password) {
        return axios.post('http://kryptonytt.io:8080/users/sign-up', {
            username: username,
            password: password
        })
    }

    static login(username,password) {
        return axios.post('http://kryptonytt.io:8080/login', {
            username: username,
            password: password
        })
    }

    static getPortfolios(token) {
        let instance = axios.create({
            baseURL: 'http://kryptonytt.io:8080/portfolios',
            headers: {'Authorization': token}
        });

        return instance.get();
    }

    static addPortfolio(token,portfolio) {
        let instance = axios.create({
            baseURL: 'http://kryptonytt.io:8080',
            headers: {'Authorization': token}
        });

        return instance.post('portfolios',portfolio);
    }

    static updatePortfolio(token,portfolioName,portfolio) {
        let instance = axios.create({
            baseURL: 'http://kryptonytt.io:8080/portfolios',
            headers: {'Authorization': token}
        });

        return instance.put(portfolioName,portfolio);
    }

    static getPublicPortfolios() {

    }

    static getSettings(token) {
        let instance = axios.create({
            baseURL: 'http://kryptonytt.io:8080/users/settings',
            headers: {'Authorization': token}
        });

        return instance.get();
    }

    static setSettings(token,settings) {
        let instance = axios.create({
            baseURL: 'http://kryptonytt.io:8080/users/settings',
            headers: {'Authorization': token}
        });

        return instance.put(settings);
    }
}

export default Kryptonytt;