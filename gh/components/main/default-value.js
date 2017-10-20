import React, {Component, Children} from 'react';

import { AreaSelect } from '../../../src/index';

export default class DefaultVal extends Component {
    constructor (){
        super ();
        this.state = {
            selected: [],
            shown: false
        };
    }

    handleSelectedChange = (val) => {
        this.setState({
            selected: val
        });
    }

    toggle = () => {
        this.setState({
            shown: !this.state.shown
        });
    }

    render () {
        const { level, type } = this.props;
        let def = [];
        if(level === 0) {
            def = ['440000'];
        } else if (level === 2) {
            def = ['440000','440300','440305'];
        } else {
            def = ['广东省', '深圳市', '南山区', '粤海街道'];
        }

        return (
            <div className="code-area">
                <div className="area-left">
                    <AreaSelect type={type} level={level} defaultArea={def} onChange={this.handleSelectedChange}/>
                </div>
                <div className="area-right">
                    {
                        level > 0 &&
                        <pre><code>{`[${this.state.selected}]`}</code></pre>
                    }
                    {
                        level === 0 &&
                        <pre><code>{`${JSON.stringify(this.state.selected)}`}</code></pre>
                    }
                </div>
                {
                    this.state.shown && level === 2 &&
                    <div className="original-code">
                        <pre><code><span>//绑定默认值defaultArea=['440000','440300','440305']，代码对应的区域文本是['广东省', '深圳市', '南山区']</span><br /><span>&lt;</span>AreaSelect&nbsp;level=&#123;2&#125;&nbsp;defaultArea=&#123;['440000','440300','440305']&#125;&nbsp;onChange=&#123;this.handleSelectedChange&#125;/<span>&gt;</span></code></pre>
                    </div>
                }
                {
                    this.state.shown && level === 3 &&
                    <div className="original-code">
                        <pre><code><span>//返回值是一个数组，分别是省份行政区域文本</span><br /><span>&lt;</span>AreaSelect&nbsp;type='text'&nbsp;level=&#123;3&#125;&nbsp;defaultArea=&#123;['广东省', '深圳市', '南山区', '粤海街道']&#125;&nbsp;onChange=&#123;this.handleSelectedChange&#125;/<span>&gt;</span></code></pre>
                    </div>
                }
                {
                    this.state.shown && level === 0 &&
                    <div className="original-code">
                        <pre><code><span>//返回值是一个数组，分别是省份行政区域代码</span><br /><span>&lt;</span>AreaSelect&nbsp;type='all'&nbsp;level=&#123;0&#125;&nbsp;defaultArea=&#123;['440000']&#125;&nbsp;onChange=&#123;this.handleSelectedChange&#125;/<span>&gt;</span></code></pre>
                    </div>
                }
                <div className="show-code" onClick={this.toggle}>
                    {this.state.shown ? 'Hide Code' : 'Show Code'}
                </div>
            </div>
        );
    }
}