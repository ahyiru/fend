import * as React from 'react';

import {tools} from 'yrui';
const {$storage,$fetch} = tools;

const getParms:any=()=>{
  const href=location.href;
  const hasParm=href.split('?')[1];
  const parms=hasParm&&hasParm.split('&');
  let obj={};
  parms&&parms.map((v,k)=>{
    if(v){
      let key=v.split('=')[0],
          val=v.split('=')[1];
      obj[key]=val;
    }
  });
  console.log(obj);
  return obj;
};

export default class WeixinAuth extends React.Component<any,any> {
  constructor(props){
    super(props);
  };

  componentDidMount=()=>{
    // var h=document.body.offsetHeight;
    var h=window.innerHeight;
    var weixin:any=document.getElementsByClassName('weixin')[0];
    weixin.style.height=h+'px';

    //
    const code=getParms().code;
    if(code){
      $fetch('/auth/weixin',{data:{code:code}}).then((data)=>{
        console.log(data);
      }).catch(e => console.log('微信登录失败,'+e));
    }
  };
  render() {
    return(
      <div className="weixin">
        <h2>扫码登录!</h2>
        <div className="weixin-auth">
          <img src={require('./qrcode.png')} />
        </div>
      </div>
    )
  }
}