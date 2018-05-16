const Model = require('./model.js');
const View = require('./view.js');

module.exports = {
    friendsRoute() {
        return Model.getFriends().then(friends => {
            let results = document.querySelector('.results');
            results.innerHTML = View.render('friends', friends);
        });
    },
    newsRoute() {
        return Model.getNews().then(news => {
            let results = document.querySelector('.results');
            results.innerHTML = View.render('news', {items: news.items});
        });
    },
    videoRoute() {
        return Model.getVideo().then(video => {
            let results = document.querySelector('.results');
            results.innerHTML = View.render('video', video);
        });
    }
};
