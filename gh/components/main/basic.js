import React, {Component, Children} from 'react';

import { AreaSelect } from '../../../src/index';

export default class Basic extends Component {
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
        const { placeholders } = this.props;
        return (
            <div className="code-area">
                <div className="area-left">
                    <AreaSelect placeholders={placeholders ? placeholders : []} onChange={this.handleSelectedChange}/>
                </div>
                <div className="area-right">
                    <pre><code>{`[${this.state.selected}]`}</code></pre>
                </div>
                {
                    this.state.shown && !placeholders &&
                    <div className="original-code">
                        <pre><code><span>//返回值是一个数组，分别是省市的行政区域代码</span><br /><span>&lt;</span>AreaSelect&nbsp;onChange=&#123;this.handleSelectedChange&#125;/<span>&gt;</span></code></pre>
                    </div>
                }
                {
                    this.state.shown && placeholders &&
                    <div className="original-code">
                        <pre><code><span>//设置 placeholders，其值应该和关联层次对应</span><br /><span>&lt;</span>AreaSelect&nbsp;placeholders=&#123;['选择省', '选择市']&#125;&nbsp;onChange=&#123;this.handleSelectedChange&#125;/<span>&gt;</span></code></pre>
                    </div>
                }
                <div className="show-code" onClick={this.toggle}>
                    {this.state.shown ? 'Hide Code' : 'Show Code'}
                </div>
            </div>
        );
    }
}