module.exports = {
    login(appId, perms) {
        VK.init({
            apiId: appId
        });

        return new Promise((resolve, reject)=> {
            VK.Auth.getLoginStatus((response) => {
                if (response.status === 'connected') {
                    resolve(response);
                } else {
                    reject(new Error('Не авторизован'));
                }
            });
        }).catch(()=> {
            return new Promise((resolve, reject) => {
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

    callApi(method, params) {
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
    getUser() {
        return this.callApi('users.get', { name_case: "gen"})
    },
    getFriends() {
        return this.callApi('friends.get', { order: 'random', count: 15, fields: 'city, country, photo_100', name_case: "non"})
    },
    getNews() {
        return this.callApi('newsfeed.get', { filters: ['post', 'wall_photo'], max_photos: 1, count: 20})
    },
    getVideo() {
        return this.callApi('video.get', {count: 20})
    }
};