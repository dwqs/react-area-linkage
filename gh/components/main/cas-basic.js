import React, {Component, Children} from 'react';

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
        const { placeholder, level, size, type } = this.props;

        return (
            <div className="code-area">
                <div className="area-left">
                    <AreaCascader 
                        level={level ? level : 0} 
                        size={size ? size : ''}
                        type={type ? type : ''}
                        placeholder={placeholder ? placeholder : undefined} 
                        onChange={this.handleSelectedChange}/>
                </div>
                <div className="area-right">
                    <pre><code>{`[${this.state.selected}]`}</code></pre>
                </div>
                {
                    this.state.shown && !placeholder && !level &&
                    <div className="original-code">
                        <pre><code><span>//返回值是一个数组，分别是省市的行政区域代码</span><br /><span>&lt;</span>AreaCascader&nbsp;onChange=&#123;this.handleSelectedChange&#125;/<span>&gt;</span></code></pre>
                    </div>
                }
                {
                    this.state.shown && placeholder && !level &&
                    <div className="original-code">
                        <pre><code><span>//返回值是一个数组，分别是省市的行政区域代码</span><br /><span>&lt;</span>AreaCascader&nbsp;placeholder=&#123;'选择区域'&#125;&nbsp;onChange=&#123;this.handleSelectedChange&#125;/<span>&gt;</span></code></pre>
                    </div>
                }
                {
                    this.state.shown && level &&
                    <div className="original-code">
                        <pre><code><span>//返回值是一个数组，分别是省市的行政区域文本</span><br /><span>&lt;</span>AreaCascader&nbsp;type='text';&nbsp;level=&#123;1&#125;&nbsp;size='large'&nbsp;onChange=&#123;this.handleSelectedChange&#125;/<span>&gt;</span></code></pre>
                    </div>
                }
                <div className="show-code" onClick={this.toggle}>
                    {this.state.shown ? 'Hide Code' : 'Show Code'}
                </div>
            </div>
        );
    }
}