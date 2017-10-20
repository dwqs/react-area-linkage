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
        type: PropTypes.string,  // 返回类型：['code', 'text', 'all']
        placeholders: PropTypes.array, 
        level: PropTypes.number,  // 0-->一联 1->二联 2->三联 3->四联
        size: PropTypes.string, // 大小：['large', 'default', 'small']
        defaultArea: [], // 默认值
        onChange: PropTypes.func 
    };

    static defaultProps = {
        type: 'code',
        placeholders: [],
        level: 1,
        size: 'default',
        defaultArea: []
    };

    getAreaCode () {
        const { level } = this.props;
        const { curProvinceCode, curCityCode, curAreaCode, curStreetCode } = this.state;
        let selected = [];

        switch (level) {
            case 0:
                selected = [curProvinceCode];
                break;
            case 1:
                selected = [curProvinceCode, curCityCode];
                break;
            case 2:
                selected = [curProvinceCode, curCityCode, curAreaCode];
                break;
            case 3:
                selected = [curProvinceCode, curCityCode, curAreaCode, curStreetCode];
                break;
        }

        return selected;
    }   

    getAreaText () {
        const { level } = this.props;
        const { curProvince, curCity, curArea, curStreet } = this.state;
        
        let texts = [];
        
        switch (level) {
            case 0:
                texts = [curProvince];
                break;
            case 1:
                texts = [curProvince, curCity];
                break;
            case 2:
                texts = [curProvince, curCity, curArea];
                break;
            case 3:
                texts = [curProvince, curCity, curArea, curStreet];
                break;
        }

        return texts;
    }

    getAreaCodeAndText () {
        const { level } = this.props;
        const { 
            curProvince, curCity, curArea, curStreet,
            curProvinceCode, curCityCode, curAreaCode, curStreetCode  
        } = this.state;

        let textCodes = [];

        switch (level) {
            case 0:
                textCodes = [{[curProvinceCode]: curProvince}];
                break;
            case 1:
                textCodes = [{[curProvinceCode]: curProvince}, {[curCityCode]: curCity}];
                break;
            case 2:
                textCodes = [{[curProvinceCode]: curProvince}, {[curCityCode]: curCity}, {[curAreaCode]: curArea}];
                break;
            case 3:
                textCodes = [{[curProvinceCode]: curProvince}, {[curCityCode]: curCity}, {[curAreaCode]: curArea}, {[curStreetCode]: curStreet}];
                break;
        }

        return textCodes;
    }

    callback () {
        const { onChange, type } = this.props;
        
        if(typeof onChange === 'function') {
            if(type === 'code') {
                onChange(this.getAreaCode());
            } else if (type === 'text') {
                onChange(this.getAreaText());
            } else if (type === 'all') {
                onChange(this.getAreaCodeAndText());
            }
        }
    }

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
        }, () => {
            this.callback();
        });
    }

    handleCityChange = (cityCode) => {
        console.log('city change', cityCode, AreaData[cityCode]);
        const curCity = this.state.citys[cityCode];
        this.setState({
            curCity,
            curCityCode: cityCode,
            areas: AreaData[cityCode]
        }, () => {
            this.callback();
        });
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