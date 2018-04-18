import React, {Component, Children} from 'react';
import { pcaa } from 'area-data';

import { AreaCascader } from '../../../src/index';

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

        return (
            <div className="code-area">
                <div className="area-left">
                    <AreaCascader data={pcaa} type='text' level={1} onChange={this.handleSelectedChange}/>
                </div>
                <div className="area-right">
                    <pre><code>{`[${this.state.selected}]`}</code></pre>
                </div>
                {
                    this.state.shown &&
                    <div className="original-code">
                        <pre><code><span>//代码对应的区域文本是['广东省', '深圳市', '南山区']</span><br /><span>&lt;</span>AreaCascader&nbsp;type='text'&nbsp;level=&#123;1&#125;&nbsp;&nbsp;onChange=&#123;this.handleSelectedChange&#125;/<span>&gt;</span></code></pre>
                    </div>
                }
                <div className="show-code" onClick={this.toggle}>
                    {this.state.shown ? 'Hide Code' : 'Show Code'}
                </div>
            </div>
        );
    }
}