const Model = require('./model');
const View = require('./view');
const Router = require('./router');


Handlebars.registerHelper('formatTime', time => {
    let minutes = parseInt(time / 60),
        seconds = time - minutes * 60;

    minutes = minutes > 9 ? minutes: '0' + minutes;
    seconds = seconds > 9 ? seconds: '0' + seconds;

    return minutes + ':' + seconds;
});

Handlebars.registerHelper('formatDate', ts => {
    return new Date(ts * 1000).toLocaleString();
});

new Promise(resolve => {
    window.load = resolve();
})
    .then(() => Model.login(5770505, 2 | 16 | 8192))
    .then(() => {
        return Model.getUser().then(users => {
            let header = document.querySelector('.head');
            header.innerHTML = View.render('header', users[0]);
        });
    })
    .catch(function (e) {
        alert(`${e}. Отключите в браузере блокировку всплывающих окон.`)
    });

const anchor = document.querySelectorAll('.nav__link');

for(let i=0; i < anchor.length; i++) {
    anchor[i].addEventListener('click', event => {
        event.preventDefault();
        let route = event.currentTarget.dataset.route;
        Router.handle(route)
    });
}