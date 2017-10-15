/**
 * Created by pomy on 20/07/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Info extends React.Component{
    constructor(props){
        super(props);
    }

    static propTypes = {
        info: PropTypes.string
    };

    static defaultProps = {
        info: 'project info:'
    };

    render() {
        return (
            <div className="info" style={{margin: '10px'}}>
                <h2 style={{margin: '10px', fontSize: "20px"}}>{this.props.info}</h2>
                <h3>Project Name: 1</h3>
                <h3>Project Version: 2</h3>
                <h3>Author: 3</h3>
                <h3>Desc: 4</h3>
            </div>
        )
    }
}
