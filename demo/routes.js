import * as React from 'react';
import { Route, IndexRoute, Redirect, IndexRedirect } from 'react-router';
import Frame from './base';

import Layout from './views/layout';

import HeadDemo from './views/headdemo';
import AsideDemo from './views/asidedemo';
import MainDemo from './views/maindemo';

import ColDemo from './views/coldemo';
import Color from './views/color';
import ButtonDemo from './views/buttondemo';
import PanelDemo from './views/paneldemo';
import TableDemo from './views/tabledemo';
import EchartDemo from './views/echartdemo';
import InputDemo from './views/inputdemo';
import FormDemo from './views/formdemo';


export default (
  <Route path="/" component={Frame}>

    <IndexRoute component={Layout} />

    <Route path="base/head" component={HeadDemo} />
    <Route path="base/aside" component={AsideDemo} />
    <Route path="base/main" component={MainDemo} />

    <Route path="component/col" component={ColDemo} />
    <Route path="component/color" component={Color} />
    <Route path="component/button" component={ButtonDemo} />
    <Route path="component/panel" component={PanelDemo} />
    <Route path="component/table" component={TableDemo} />
    <Route path="component/echart" component={EchartDemo} />
    <Route path="component/input" component={InputDemo} />
    <Route path="component/form" component={FormDemo} />

    <Route path="tools/tool1" component={FormDemo} />
    <Route path="tools/tool2" component={FormDemo} />
    <Route path="tools/tool3" component={FormDemo} />

  </Route>
);
