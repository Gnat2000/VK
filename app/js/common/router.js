const Controller = require('./controller.js')

module.exports = {
    handle(route) {
        let routeName = route + 'Route';
        Controller[routeName]();
    }
};