import React, { Component } from 'react';
import { Select } from 'antd'; 
import PropTypes from 'prop-types';

import AreaData from 'area-data';
import find from 'lodash.find';

import { assert, isArray } from './utils';

const Option = Select.Option;

export default class AreaSelect extends Component {
    constructor (props) {
        super(props);
    }

    static propTypes = {

    };

    static defaultProps = {

    };

    render () {
        return (
            <div className="area-select">

            </div>
        );
    }
}