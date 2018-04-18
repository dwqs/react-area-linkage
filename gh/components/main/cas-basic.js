import React, {Component, Children} from 'react';
import { pca } from 'area-data';

import { AreaCascader } from '../../../src/index';

export default class CasBasic extends Component {
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
                    <AreaCascader data={pca} onChange={this.handleSelectedChange}/>
                </div>
                <div className="area-right">
                    <pre><code>{`[${this.state.selected}]`}</code></pre>
                </div>
                {
                    this.state.shown && 
                    <div className="original-code">
                        <pre><code><span>//返回值是一个数组，分别是省市的行政区域代码</span><br /><span>&lt;</span>AreaCascader&nbsp;onChange=&#123;this.handleSelectedChange&#125;/<span>&gt;</span></code></pre>
                    </div>
                }
                <div className="show-code" onClick={this.toggle}>
                    {this.state.shown ? 'Hide Code' : 'Show Code'}
                </div>
            </div>
        );
    }
}