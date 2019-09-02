const User = require('../models/user');
import { responseClient, md5 } from '../util/util.js';

exports.login = (req, res) => {
  const { phone, password } = req.body;
  const reg =/^1[34578]\d{9}$/
  if (!phone) {
    responseClient(res, 200, 400, '用户邮箱不可为空');
    return;
  }else if(!reg.test(phone)){
    responseClient(res, 200, 400, '请输入格式正确的手机号码');
    return;
  }
  if (!password) {
    responseClient(res, 200, 400, '密码不可为空');
    return;
  }
  User.findOne({
    phone,
    password: md5(password),
  })
    .then(userInfo => {
      console.log(userInfo._id)
      if (userInfo) {
        //登录成功后设置session
        req.session.userInfo = userInfo;
        responseClient(res, 200, 200, '登录成功', null);
      } else {
        responseClient(res, 200, 402, '用户名或者密码错误');
      }
    })
    .catch(err => {
      responseClient(res);
    });
};

//用户验证(获取用户信息)
exports.userInfo = (req, res) => {
  if (req.session.userInfo) {
    responseClient(res, 200, 200, '', req.session.userInfo);
  } else {
    responseClient(res, 200, 403, '请重新登录', req.session.userInfo);
  }
};

exports.logout = (req, res) => {
  console.log(req.session)
  if (req.session.userInfo) {
    req.session.userInfo = null; // 删除session
    responseClient(res, 200, 200, '登出成功！！');
  } else {
    responseClient(res, 200, 402, '您还没登录！！！');
  }
};

exports.register = (req, res) => {
  const { name, password, phone, type,email } = req.body;
  const regPhone =/^1[34578]\d{9}$/
  const regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  if (!phone) {
    responseClient(res, 200, 400, '用户手机号码不能为空');
    return;
  }else if(!regPhone.test(phone)){
    responseClient(res, 200, 400, '请输入格式正确的手机号码');
    return;
  }
  if (!name) {
    responseClient(res, 200, 400, '用户名不可为空');
    return;
  }
  if (!email) {
    responseClient(res, 200, 400, '用户邮箱不可为空');
    return;
  }else if(!regEmail.test(email)){
    responseClient(res, 200, 400, '请输入格式正确的邮箱');
    return;
  }
  if (!password) {
    responseClient(res, 200, 400, '用户密码不可为空');
    return;
  }
  //验证用户是否已经在数据库中
  User.findOne({ phone })
    .then(data => {
      if (data) {
        responseClient(res, 200, 402, '用户手机号码已存在！');
        return;
      }
      //保存到数据库
      let user = new User({
        name,
        password: md5(password),
        phone,
        type,
        email
      });
      user.save().then(data => {
        responseClient(res, 200, 200, '注册成功', data);
      });
    })
    .catch(err => {
      responseClient(res);
      return;
    });
};

exports.delUser = (req, res) => {
  let { id } = req.body;
  User.deleteMany({ _id: id })
    .then(result => {
      if (result.n === 1) {
        responseClient(res, 200, 0, '用户删除成功!');
      } else {
        responseClient(res, 200, 1, '用户不存在');
      }
    })
    .catch(err => {
      responseClient(res);
    });
};

