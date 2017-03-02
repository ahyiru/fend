import React,{Component} from 'react';

import {Main,Brand,SideBar,RightBar,Nav,Tabs,Tabpage,List,tools} from 'yrui';

import {sidebarMenu,rightbarTabs,rightbarTabLists,dropList,projectList} from './models/models';

let getCurrent=tools.getCurrent;
let getBreadcrumb=tools.getBreadcrumb;
let addClass=tools.addClass;

let storage=tools.$storage;

/*if(navigator.cookieEnabled){
  let theme=storage.get('theme')||'';
  addClass(document.body,theme);
  let collapse=storage.get('collapse')||'';
  addClass(document.body,collapse);
}else{
  console.log('你处于隐私模式!');
}*/

const getMenu=()=>{
  let str=location.hash.match(/#(\S+)\?/)||location.hash.match(/#(\S+)/);
  // let str=location.pathname;
  let menu=getCurrent(sidebarMenu,str);
  let breadcrumb=getBreadcrumb(sidebarMenu,str);
  return {
    menu:menu,
    breadcrumb:breadcrumb,
  }
};

export default class Frame extends Component {
	state={
    menu:getMenu().menu,
    breadcrumb:getMenu().breadcrumb,
  };
  static contextTypes={
    router:React.PropTypes.object
  };
  componentWillMount=()=>{
    /*if(!isAuth()){
      this.context.router.push('/user/login');
      return;
    }*/
    window.addEventListener('hashchange',this.hashChg,false);
  };
  componentDidMount=()=>{
    
  };
  //hashchange
  hashChg=()=>{
    document.documentElement.scrollTop?(document.documentElement.scrollTop=0):(document.body.scrollTop=0);
    this.setState({
      menu:getMenu().menu,
      breadcrumb:getMenu().breadcrumb,
    });
  };
  componentWillUnmount=()=>{
    window.removeEventListener('hashchange',this.hashChg,false);
  };

  render() {
  	const {breadcrumb,menu}=this.state;
    return (
      <div>
        <header>
          <div className="y-header">
            <Brand title="React" subtitle="UI Demo" logo={false} />
            <Nav dropList={dropList} hideRightTogbar={false} />
          </div>
        </header>
        <aside>
          <SideBar menu={menu} userInfo={null} />
          <RightBar>
            <Tabs>
              {
                rightbarTabs.map((v,k)=>{
                  return (
                    <Tabpage key={`tabs-${k}`} icon={v.icon}>
                      <List list={rightbarTabLists} name={v.name} />
                    </Tabpage>
                  )
                })
              }
            </Tabs>
          </RightBar>
        </aside>
        <Main breadcrumb={breadcrumb} hidePagetitle={false}>
          {this.props.children}
        </Main>
      </div>
    );
  }
}
