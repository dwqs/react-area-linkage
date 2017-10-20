import './index.less';

import React, {Component, Children} from 'react';

import Basic from './basic';
import Size from './size';
import AreaText from './area-text';
import AreaTextCode from './area-text-code';
import DefaultVal from './default-value';

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
                <Size />
                <h5>返回区域文本</h5>
                <AreaText />
                <h5>返回区域代码和文本</h5>
                <AreaTextCode />
                <h5>设置 placeholders</h5>
                <Basic placeholders={['选择省', '选择市']}/>
                <p className='desc'>
                    <code>placeholders</code>&nbsp;是一个数组, 数组项顺序分别对应省/市/区/街道.
                </p>
                <h5>设置默认值及省市区联动</h5>
                <DefaultVal level={2} />
                <p className='desc'>
                    <code>selected</code>&nbsp;是一个数组, 数组项顺序分别对应省/市/区/街道, 且类型(区域代码/区域文本)必须统一. 以第一个元素类型为基准. 类型不统一将报错.
                </p>
                <p className='desc'>
                    <code>level</code>&nbsp;表示联动层级, 0-->一联 1->二联 2->三联 3->四联.
                </p>
                <h5>省市区街联动</h5>
                <DefaultVal level={3} type='text' />
                <h5>只选省份</h5>
                <DefaultVal level={0} type='all' />
                <h4>2. 作为级联器(只支持2/3级联动)</h4>
                <h5>默认形式</h5>
            </div>
        );
    }
}