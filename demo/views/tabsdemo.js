import * as React from 'react';

import {Items,Item,Row,Col,Table} from 'yrui';

let thead=['ID','参数','说明','类型','可选值','默认值'];
let tabs=[{
  key:'active',
  expr:'默认显示的tab',
  type:'number',
  values:'-',
  default:'0'
},{
  key:'icon',
  expr:'tab图标',
  type:'string',
  values:'-',
  default:'-'
},{
  key:'name',
  expr:'tab名字',
  type:'string',
  values:'-',
  default:'-'
}];
let tabpage=[{
  key:'icon',
  expr:'tab图标',
  type:'string',
  values:'-',
  default:'-'
},{
  key:'name',
  expr:'tab名字',
  type:'string',
  values:'-',
  default:'-'
}];

export default class TabsDemo extends React.Component<any,any> {

  render() {
    return (
      <Items>
        <Item>
          <h2>tabs配置</h2>
          <Table thead={thead} tbody={tabs} noBorder={true} />
        </Item>
        <Item>
          <h2>tabpage配置</h2>
          <Table thead={thead} tbody={tabpage} noBorder={true} />
        </Item>
      </Items>
    )
  };
}
