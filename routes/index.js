/*
*所有的路由接口
*/
const users = require('./users');

module.exports = app => {
	app.post('/login', users.login);
	app.post('/logout', users.logout);
	app.post('/register', users.register);
	app.post('/delUser', users.delUser);
	app.post('/userInfo', users.userInfo);
};
