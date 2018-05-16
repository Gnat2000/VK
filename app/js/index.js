(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var Model = require('./model.js');
var View = require('./view.js');

module.exports = {
    friendsRoute: function friendsRoute() {
        return Model.getFriends().then(function (friends) {
            var results = document.querySelector('.results');
            results.innerHTML = View.render('friends', friends);
        });
    },
    newsRoute: function newsRoute() {
        return Model.getNews().then(function (news) {
            var results = document.querySelector('.results');
            results.innerHTML = View.render('news', { items: news.items });
        });
    },
    videoRoute: function videoRoute() {
        return Model.getVideo().then(function (video) {
            var results = document.querySelector('.results');
            results.innerHTML = View.render('video', video);
        });
    }
};

},{"./model.js":3,"./view.js":5}],2:[function(require,module,exports){
'use strict';

var Model = require('./model');
var View = require('./view');
var Router = require('./router');

Handlebars.registerHelper('formatTime', function (time) {
    var minutes = parseInt(time / 60),
        seconds = time - minutes * 60;

    minutes = minutes > 9 ? minutes : '0' + minutes;
    seconds = seconds > 9 ? seconds : '0' + seconds;

    return minutes + ':' + seconds;
});

Handlebars.registerHelper('formatDate', function (ts) {
    return new Date(ts * 1000).toLocaleString();
});

new Promise(function (resolve) {
    window.load = resolve();
}).then(function () {
    return Model.login(5770505, 2 | 16 | 8192);
}).then(function () {
    return Model.getUser().then(function (users) {
        var header = document.querySelector('.head');
        header.innerHTML = View.render('header', users[0]);
    });
}).catch(function (e) {
    alert(e + '. \u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0443 \u0432\u0441\u043F\u043B\u044B\u0432\u0430\u044E\u0449\u0438\u0445 \u043E\u043A\u043E\u043D.');
});

var anchor = document.querySelectorAll('.nav__link');

for (var i = 0; i < anchor.length; i++) {
    anchor[i].addEventListener('click', function (event) {
        event.preventDefault();
        var route = event.currentTarget.dataset.route;
        Router.handle(route);
    });
}

},{"./model":3,"./router":4,"./view":5}],3:[function(require,module,exports){
'use strict';

module.exports = {
    login: function login(appId, perms) {
        VK.init({
            apiId: appId
        });

        return new Promise(function (resolve, reject) {
            VK.Auth.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    resolve(response);
                } else {
                    reject(new Error('Не авторизован'));
                }
            });
        }).catch(function () {
            return new Promise(function (resolve, reject) {
                VK.Auth.login(function (response) {
                    if (response.session) {
                        resolve(response);
                    } else {
                        reject(new Error('Не удалось авторизоваться'));
                    }
                }, perms);
            });
        });
    },
    callApi: function callApi(method, params) {
        params = params || {};
        params.v = "5.74";

        return new Promise(function (resolve, reject) {
            VK.Api.call(method, params, function (data) {
                if (data.error) {
                    reject(new Error(data.error.error_msg));
                } else {
                    resolve(data.response);
                }
            });
        });
    },
    getUser: function getUser() {
        return this.callApi('users.get', { name_case: "gen" });
    },
    getFriends: function getFriends() {
        return this.callApi('friends.get', { order: 'random', count: 15, fields: 'city, country, photo_100', name_case: "non" });
    },
    getNews: function getNews() {
        return this.callApi('newsfeed.get', { filters: ['post', 'wall_photo'], max_photos: 1, count: 20 });
    },
    getVideo: function getVideo() {
        return this.callApi('video.get', { count: 20 });
    }
};

},{}],4:[function(require,module,exports){
'use strict';

var Controller = require('./controller.js');

module.exports = {
    handle: function handle(route) {
        var routeName = route + 'Route';
        Controller[routeName]();
    }
};

},{"./controller.js":1}],5:[function(require,module,exports){
'use strict';

module.exports = {
    render: function render(templateName, model) {
        templateName = templateName + 'Template';
        var templateElement = document.getElementById(templateName).textContent,
            renderFn = Handlebars.compile(templateElement);
        return renderFn(model);
    }
};

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvY29tbW9uL2NvbnRyb2xsZXIuanMiLCJhcHAvanMvY29tbW9uL2VudHJ5LmpzIiwiYXBwL2pzL2NvbW1vbi9tb2RlbC5qcyIsImFwcC9qcy9jb21tb24vcm91dGVyLmpzIiwiYXBwL2pzL2NvbW1vbi92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFNLFFBQVEsUUFBUSxZQUFSLENBQWQ7QUFDQSxJQUFNLE9BQU8sUUFBUSxXQUFSLENBQWI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2IsZ0JBRGEsMEJBQ0U7QUFDWCxlQUFPLE1BQU0sVUFBTixHQUFtQixJQUFuQixDQUF3QixtQkFBVztBQUN0QyxnQkFBSSxVQUFVLFNBQVMsYUFBVCxDQUF1QixVQUF2QixDQUFkO0FBQ0Esb0JBQVEsU0FBUixHQUFvQixLQUFLLE1BQUwsQ0FBWSxTQUFaLEVBQXVCLE9BQXZCLENBQXBCO0FBQ0gsU0FITSxDQUFQO0FBSUgsS0FOWTtBQU9iLGFBUGEsdUJBT0Q7QUFDUixlQUFPLE1BQU0sT0FBTixHQUFnQixJQUFoQixDQUFxQixnQkFBUTtBQUNoQyxnQkFBSSxVQUFVLFNBQVMsYUFBVCxDQUF1QixVQUF2QixDQUFkO0FBQ0Esb0JBQVEsU0FBUixHQUFvQixLQUFLLE1BQUwsQ0FBWSxNQUFaLEVBQW9CLEVBQUMsT0FBTyxLQUFLLEtBQWIsRUFBcEIsQ0FBcEI7QUFDSCxTQUhNLENBQVA7QUFJSCxLQVpZO0FBYWIsY0FiYSx3QkFhQTtBQUNULGVBQU8sTUFBTSxRQUFOLEdBQWlCLElBQWpCLENBQXNCLGlCQUFTO0FBQ2xDLGdCQUFJLFVBQVUsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQWQ7QUFDQSxvQkFBUSxTQUFSLEdBQW9CLEtBQUssTUFBTCxDQUFZLE9BQVosRUFBcUIsS0FBckIsQ0FBcEI7QUFDSCxTQUhNLENBQVA7QUFJSDtBQWxCWSxDQUFq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QXhCO0FBQ0EsbUJBQVcsU0FBWDtBQUNIO0FBSlksQ0FBakI7Ozs7O0FDRkEsT0FBTyxPQUFQLEdBQWlCO0FBQ2IsVUFEYSxrQkFDTixZQURNLEVBQ1EsS0FEUixFQUNlO0FBQ3hCLHVCQUFlLGVBQWUsVUFBOUI7QUFDQSxZQUFJLGtCQUFrQixTQUFTLGNBQVQsQ0FBd0IsWUFBeEIsRUFBc0MsV0FBNUQ7QUFBQSxZQUNJLFdBQVcsV0FBVyxPQUFYLENBQW1CLGVBQW5CLENBRGY7QUFFQSxlQUFPLFNBQVMsS0FBVCxDQUFQO0FBQ0g7QUFOWSxDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbC5qcycpO1xuY29uc3QgVmlldyA9IHJlcXVpcmUoJy4vdmlldy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBmcmllbmRzUm91dGUoKSB7XG4gICAgICAgIHJldHVybiBNb2RlbC5nZXRGcmllbmRzKCkudGhlbihmcmllbmRzID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc3VsdHMnKTtcbiAgICAgICAgICAgIHJlc3VsdHMuaW5uZXJIVE1MID0gVmlldy5yZW5kZXIoJ2ZyaWVuZHMnLCBmcmllbmRzKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBuZXdzUm91dGUoKSB7XG4gICAgICAgIHJldHVybiBNb2RlbC5nZXROZXdzKCkudGhlbihuZXdzID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc3VsdHMnKTtcbiAgICAgICAgICAgIHJlc3VsdHMuaW5uZXJIVE1MID0gVmlldy5yZW5kZXIoJ25ld3MnLCB7aXRlbXM6IG5ld3MuaXRlbXN9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICB2aWRlb1JvdXRlKCkge1xuICAgICAgICByZXR1cm4gTW9kZWwuZ2V0VmlkZW8oKS50aGVuKHZpZGVvID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc3VsdHMnKTtcbiAgICAgICAgICAgIHJlc3VsdHMuaW5uZXJIVE1MID0gVmlldy5yZW5kZXIoJ3ZpZGVvJywgdmlkZW8pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwiY29uc3QgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyk7XG5jb25zdCBWaWV3ID0gcmVxdWlyZSgnLi92aWV3Jyk7XG5jb25zdCBSb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlcicpO1xuXG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2Zvcm1hdFRpbWUnLCB0aW1lID0+IHtcbiAgICBsZXQgbWludXRlcyA9IHBhcnNlSW50KHRpbWUgLyA2MCksXG4gICAgICAgIHNlY29uZHMgPSB0aW1lIC0gbWludXRlcyAqIDYwO1xuXG4gICAgbWludXRlcyA9IG1pbnV0ZXMgPiA5ID8gbWludXRlczogJzAnICsgbWludXRlcztcbiAgICBzZWNvbmRzID0gc2Vjb25kcyA+IDkgPyBzZWNvbmRzOiAnMCcgKyBzZWNvbmRzO1xuXG4gICAgcmV0dXJuIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xufSk7XG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2Zvcm1hdERhdGUnLCB0cyA9PiB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHRzICogMTAwMCkudG9Mb2NhbGVTdHJpbmcoKTtcbn0pO1xuXG5uZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICB3aW5kb3cubG9hZCA9IHJlc29sdmUoKTtcbn0pXG4gICAgLnRoZW4oKCkgPT4gTW9kZWwubG9naW4oNTc3MDUwNSwgMiB8IDE2IHwgODE5MikpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gTW9kZWwuZ2V0VXNlcigpLnRoZW4odXNlcnMgPT4ge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkJyk7XG4gICAgICAgICAgICBoZWFkZXIuaW5uZXJIVE1MID0gVmlldy5yZW5kZXIoJ2hlYWRlcicsIHVzZXJzWzBdKTtcbiAgICAgICAgfSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgYWxlcnQoYCR7ZX0uINCe0YLQutC70Y7Rh9C40YLQtSDQsiDQsdGA0LDRg9C30LXRgNC1INCx0LvQvtC60LjRgNC+0LLQutGDINCy0YHQv9C70YvQstCw0Y7RidC40YUg0L7QutC+0L0uYClcbiAgICB9KTtcblxuY29uc3QgYW5jaG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdl9fbGluaycpO1xuXG5mb3IobGV0IGk9MDsgaSA8IGFuY2hvci5sZW5ndGg7IGkrKykge1xuICAgIGFuY2hvcltpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IHJvdXRlID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnJvdXRlO1xuICAgICAgICBSb3V0ZXIuaGFuZGxlKHJvdXRlKVxuICAgIH0pO1xufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGxvZ2luKGFwcElkLCBwZXJtcykge1xuICAgICAgICBWSy5pbml0KHtcbiAgICAgICAgICAgIGFwaUlkOiBhcHBJZFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICBWSy5BdXRoLmdldExvZ2luU3RhdHVzKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ9Cd0LUg0LDQstGC0L7RgNC40LfQvtCy0LDQvScpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkuY2F0Y2goKCk9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIFZLLkF1dGgubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ9Cd0LUg0YPQtNCw0LvQvtGB0Ywg0LDQstGC0L7RgNC40LfQvtCy0LDRgtGM0YHRjycpKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgcGVybXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjYWxsQXBpKG1ldGhvZCwgcGFyYW1zKSB7XG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgcGFyYW1zLnYgPSBcIjUuNzRcIjtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgVksuQXBpLmNhbGwobWV0aG9kLCBwYXJhbXMsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihkYXRhLmVycm9yLmVycm9yX21zZykpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YS5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0VXNlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbEFwaSgndXNlcnMuZ2V0JywgeyBuYW1lX2Nhc2U6IFwiZ2VuXCJ9KVxuICAgIH0sXG4gICAgZ2V0RnJpZW5kcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbEFwaSgnZnJpZW5kcy5nZXQnLCB7IG9yZGVyOiAncmFuZG9tJywgY291bnQ6IDE1LCBmaWVsZHM6ICdjaXR5LCBjb3VudHJ5LCBwaG90b18xMDAnLCBuYW1lX2Nhc2U6IFwibm9uXCJ9KVxuICAgIH0sXG4gICAgZ2V0TmV3cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbEFwaSgnbmV3c2ZlZWQuZ2V0JywgeyBmaWx0ZXJzOiBbJ3Bvc3QnLCAnd2FsbF9waG90byddLCBtYXhfcGhvdG9zOiAxLCBjb3VudDogMjB9KVxuICAgIH0sXG4gICAgZ2V0VmlkZW8oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGxBcGkoJ3ZpZGVvLmdldCcsIHtjb3VudDogMjB9KVxuICAgIH1cbn07IiwiY29uc3QgQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGhhbmRsZShyb3V0ZSkge1xuICAgICAgICBsZXQgcm91dGVOYW1lID0gcm91dGUgKyAnUm91dGUnO1xuICAgICAgICBDb250cm9sbGVyW3JvdXRlTmFtZV0oKTtcbiAgICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlbmRlcih0ZW1wbGF0ZU5hbWUsIG1vZGVsKSB7XG4gICAgICAgIHRlbXBsYXRlTmFtZSA9IHRlbXBsYXRlTmFtZSArICdUZW1wbGF0ZSc7XG4gICAgICAgIGxldCB0ZW1wbGF0ZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZU5hbWUpLnRleHRDb250ZW50LFxuICAgICAgICAgICAgcmVuZGVyRm4gPSBIYW5kbGViYXJzLmNvbXBpbGUodGVtcGxhdGVFbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHJlbmRlckZuKG1vZGVsKTtcbiAgICB9XG59OyJdfQ==
