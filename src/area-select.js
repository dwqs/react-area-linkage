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
            // 区域数据
            provinces: AreaData['86'],
            citys: {},
            areas: {},
            streets: {},

            // state
            curProvince: undefined,
            curProvinceCode: undefined,
            curCity: undefined,
            curCityCode: undefined,
            curArea: undefined,
            curAreaCode: undefined,
            curStreet: undefined,
            curStreetCode: undefined,

            // 设置默认值的判断
            defaults: [],
            isCode: false,
            isSetDefault: false
        };
    }

    static propTypes = {
        type: PropTypes.string,
        placeholders: PropTypes.array,
        level: PropTypes.number,
        size: PropTypes.string,
        defaultArea: []
    };

    static defaultProps = {
        type: 'code',
        placeholders: [],
        level: 1,
        size: 'default',
        defaultArea: []
    };

    handleProvinceChange = (provinceCode) => {
        console.log('province change', provinceCode, AreaData[provinceCode]);
        const curProvince = this.state.provinces[provinceCode];
        const citys = AreaData[provinceCode];
        const curCity = Object.values(citys)[0];

        this.setState({
            curProvince,
            curProvinceCode: provinceCode,
            curCity,
            curCityCode: Object.keys(citys)[0],
            citys
        });
        this.props.onChange([provinceCode, Object.keys(citys)[0]]);
    }

    handleCityChange = (cityCode) => {
        console.log('city change', cityCode, AreaData[cityCode]);
        const curCity = this.state.citys[cityCode];
        this.setState({
            curCity,
            curCityCode: cityCode,
            areas: AreaData[cityCode]
        });
        this.props.onChange([this.state.curProvinceCode, cityCode]);
    }

    render () {
        let { size, type, placeholders, level } = this.props;
        let { provinces, citys, areas, streets, curProvince, curCity } = this.state;

        if(!['large', 'default', 'small'].includes(size)) {
            size = 'default';
        }

        if(!['all', 'code', 'text'].includes(type)) {
            type = 'code';
        }

        let defaultClass = 'area-select';
        let classes = size === 'default' ? 'medium' : size === 'small' ? 'small' : 'large';
        classes = `${defaultClass} ${classes}`;

        // ant design 的一个 bug: value 为时, placeholder 才显示
        return (
            <div className={classes}>
                <Select 
                    placeholder={placeholders[0] ? placeholders[0] : '请选择'}
                    notFoundContent='无数据'
                    size={size}
                    value={curProvince}
                    onChange={this.handleProvinceChange}
                >
                    {
                        Object.keys(provinces).map((code) => {
                            return <Option key={code}>{provinces[code]}</Option>;
                        })
                    }
                </Select>
                {
                    level >= 1 && 
                    <Select 
                        placeholder={placeholders[1] ? placeholders[1] : '请选择'}
                        notFoundContent='无数据'
                        size={size}
                        value={curCity}
                        onChange={this.handleCityChange}
                    >
                        {
                            Object.keys(citys).map((code) => {
                                return <Option key={code}>{citys[code]}</Option>;
                            })
                        }
                    </Select>
                }
            </div>
        );
    }
}