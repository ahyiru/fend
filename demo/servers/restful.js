
module.exports=function rest(app){
	//test1
	app.get('/test11',function(req,res){
		/*res.send({header:res.headers});
		res.send({body:res.body});
		res.send({route:res.route});*/
		// res.status(res.statusCode).send({statusCode:res.statusCode});
		res.send({test:'test1'});
	});

	//test2
	app.post('/test2',function(req,res){
		/*res.send({header:res.headers});
		res.send({body:res.body});
		res.send({route:res.route});*/
		res.status(res.statusCode).send({statusCode:res.statusCode});
	});
	// 登录
app.post('/auth/login',function(req,res){
  global['users'].findOne({ email: req.body.email }, function(err, user) {
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
  global['users'].findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: '该邮箱已注册！' });
    }
    var user = new global['users']({
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
  var accessTokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token';
  var peopleApiUrl = 'https://api.weixin.qq.com/sns/userinfo';
  var code=req.body.code,
      appid='wx7f4df123f88372a5',
      secret='965981c4ee42e0bdde3df2b91b070ea4';

  //res.send(req.body);

  request.post({url: accessTokenUrl+'?appid='+appid+'&secret='+secret+'&code='+code+'&grant_type=authorization_code', json: true} ,function(err, response, token) {
    console.log(token);
    var accessToken = token.access_token;
    var openid=token.openid;
    //res.send(token);
    request.get({ url: peopleApiUrl+'?access_token='+accessToken+'&openid='+openid+'&lang=zh_CN', json: true }, function(err, response, profile) {
      console.log(profile);
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
      //res.send(profile);
      if (req.headers.authorization) {
        global['users'].findOne({ weixin: profile.openid }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          global['users'].findById(payload.sub, function(err, user) {
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
        global['users'].findOne({ weixin: profile.openid }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createJWT(existingUser) });
          }
          var user = new global['users']();
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
};










































