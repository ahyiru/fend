var express = require('express');
var webpack = require('webpack');
var webpackConfig = require('./webpack.development');
var colors=require('colors');
var request=require('request');

var config = require('./config');

var app = express();
var compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  stats: {
    colors: true,
  },
}));

app.use(require('webpack-hot-middleware')(compiler));

app.set('port', process.env.PORT || config.PORT);

var cors=require('cors');
var logger=require('morgan');
var bodyParser=require('body-parser');  // 数据解析
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
if(app.get('env')==='production'){
  app.use(function(req,res,next) {
    var protocol=req.get('x-forwarded-proto');
    protocol=='https'?next():res.redirect('https://'+req.hostname+req.url);
  });
}

// var rest=require('./demo/servers/restful')(app);

// start mongodb
var mongoose=require("mongoose");
mongoose.Promise = require('bluebird');
// 建立连接
var dataCom=mongoose.createConnection(config.DATA_URI);
dataCom.on('error',function(err) {
  console.log('数据库连接失败！'.red);
});
dataCom.once('open',function(err) {
  console.log('数据库连接成功！'.green);
});
var userData={
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  name: String,
  addr: String,
  qq: String,
  role:{type:Number,max:5},
  pic: String,
  picture: String,
  weibo: String,
  weixin: String,
};
var userSchema = new mongoose.Schema(userData);
// 创建表
var User=dataCom.model('users',userSchema);


var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var moment = require('moment');

function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
};
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};

app.get('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    res.send(user);
  });
});

// 登录
app.post('/auth/login',function(req,res){
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      return res.status(401).send({ message: '该邮箱尚未注册！' });
    }
    if (user.password!=req.body.password) {
      return res.status(401).send({ message: '密码错误！' });
    }
    res.send({ token: createJWT(user), user: user });
  });
});
// 注册
app.post('/auth/signup', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: '该邮箱已注册！' });
    }
    var user = new User({
      name: req.body.name||'',
      email: req.body.email||'',
      password: req.body.password||'',
      role:req.body.role||0,
    });
    user.save(function(err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.send({ token: createJWT(result), user: user });
    });
  });
});

// 微信oAuth2
app.post('/auth/weixin', function(req, res) {
  var code=req.body.code,
      accessTokenUrl = config.WEIXIN_TOKENURL,
      peopleInfoUrl = config.WEIXIN_INFOURL,
      appid=config.WEIXIN_APPID,
      secret=config.WEIXIN_SECRET;

  //res.send(req.body);

  request.post({url: accessTokenUrl+'?appid='+appid+'&secret='+secret+'&code='+code+'&grant_type=authorization_code', json: true} ,function(err, response, token) {
    console.log(token);
    var accessToken = token.access_token;
    var openid=token.openid;
    //res.send(token);
    request.get({ url: peopleInfoUrl+'?access_token='+accessToken+'&openid='+openid+'&lang=zh_CN', json: true }, function(err, response, profile) {
      console.log(profile);
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
      //res.send(profile);
      if (req.headers.authorization) {
        User.findOne({ weixin: profile.openid }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.weixin = profile.openid;
            user.pic = user.pic || profile.headimgurl;
            user.displayName = user.displayName || profile.nickname;
            user.role=0;
            user.addr=user.addr || (profile.province+' '+profile.city);
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        User.findOne({ weixin: profile.openid }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createJWT(existingUser) });
          }
          var user = new User();
          user.weixin = profile.openid;
          user.pic = profile.headimgurl;
          user.displayName = profile.nickname;
          user.role=0;
          user.addr=profile.province+' '+profile.city;
          user.save(function(err) {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

app.listen(app.get('port'),(err)=>{
  if (err) {
    console.log(err);
  }
  console.log('监听端口:'+ app.get('port') +', 正在构建,请稍后...');
});
