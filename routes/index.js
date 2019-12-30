/*
*所有的路由接口
*/
const users = require('./users');

module.exports = app => {
	app.post('/api/login', users.login);
	app.post('/api/logout', users.logout);
	app.post('/api/register', users.register);
	app.post('/api/delUser', users.delUser);
	app.post('/api/userInfo', users.userInfo);
};
