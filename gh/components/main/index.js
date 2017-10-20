import './index.less';

import React, {Component, Children} from 'react';

import Basic from './basic';
import Size from './size';

export default class Main extends Component {
    constructor (){
        super ();
    }

    render () {
        return (
            <div className="app-main">
                <h3>基本使用</h3>
                <h4>1. 作为选择器</h4>
                <h5>默认形式</h5>
                <Basic />
                <h5>改变大小</h5>
                <Size></Size>
            </div>
        );
    }
}