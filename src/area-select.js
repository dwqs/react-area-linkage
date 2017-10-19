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
        this.state = {
            provinces: AreaData['86'],
            citys: {},
            areas: {},
            streets: {},
            curProvince: '',
            curCity: '',
            curArea: '',
            curStreet: '',
            defaults: [],
            isCode: false,
            isSetDefault: false
        };
    }

    static propTypes = {
        type: PropTypes.string,
        placeholders: PropTypes.array,
        level: PropTypes.number,
        size: PropTypes.string
    };

    static defaultProps = {
        type: 'code',
        placeholders: [],
        level: 1,
        size: 'medium'
    };

    render () {
        let { size, type } = this.props;

        if(!['small', 'medium', 'large'].includes(size)) {
            size = 'medium';
        }

        if(!['all', 'code', 'text'].includes(type)) {
            type = 'code';
        }

        let defaultClass = 'area-select';
        let classes = size === 'medium' ? 'medium' : size === 'small' ? 'small' : 'large';
        classes = defaultClass + ' ' +  defaultClass;

        return (
            <div className={classes}>

            </div>
        );
    }
}