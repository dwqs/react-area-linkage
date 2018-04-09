import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import arrayTreeFilter from 'array-tree-filter';
import { findDOMNode } from 'react-dom';
import AreaData from 'area-data';

import { isArray, scrollIntoView } from '@src/utils';

export default class CascaderMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeValues: props.values,
            labels: []
        };
        this.menuItems = {};
    }
    
    static displayName = 'CascaderMenu'

    static propTypes = {
        data: PropTypes.array,
        values: PropTypes.array
    }

    static defaultProps = {
        data: [],
        values: []
    }

    handleMenuItemClick = (option, menuIndex) => {
        return (e) => {
            e.stopPropagation();
            const { label, value, children } = option;
            let { activeValues, labels } = this.state;

            activeValues = activeValues.slice(0, menuIndex + 1);
            activeValues[menuIndex] = value;
            labels = labels.slice(0, menuIndex + 1);
            labels[menuIndex] = label;

            this.setState({
                activeValues: activeValues,
                labels: labels
            });

            if (!children) {
                this.props.emitter.emit('selected', activeValues, labels);
            }
        };
    }

    getOption = (option, menuIndex) => {
        const { activeValues, values } = this.state;
        return (
            <li className={classNames('cascader-menu-option', {
                'cascader-menu-extensible': option['children'],
                'selected': activeValues.includes(option.value)
            })} key={option.value} value={option.value} onClick={this.handleMenuItemClick(option, menuIndex)}>
                {option.label}
            </li>
        );
    }

    getActiveOptions = () => {
        const { data } = this.props;
        const activeValues = this.state.activeValues;
        
        return arrayTreeFilter(data, (o, level) => o.value === activeValues[level]);
    }
    
    getShowOptions = () => {
        const { data } = this.props;
        const result = this.getActiveOptions()
            .map(activeOption => activeOption.children)
            .filter(activeOption => !!activeOption);

        result.unshift(data);
        return result;
    }

    getActiveLabels = (codes) => {
        const provinces = AreaData['86'];
        const citys = AreaData[codes[0]];
        const l = codes.length;

        if (l < 2) {
            return [];
        }

        let labels = [];

        if (l === 2) {
            labels = [provinces[codes[0]], citys[codes[1]]];
        } else if (l === 3) {
            const areas = AreaData[codes[1]];
            labels = [provinces[codes[0]], citys[codes[1]], areas[codes[2]]];
        }

        return labels;
    }

    resetActiveVal = (labels) => {
        this.setState({
            activeValues: this.props.values,
            labels: this.getActiveLabels(this.props.values)
        });
    }

    setDefValues = (codes, labels) => {
        this.setState({
            activeValues: codes,
            labels: labels
        });
    }

    scrollToSelectedOption = () => {
        const optionsLength = this.getShowOptions().length;
        for (let i = 0; i < optionsLength; i++) {
            const itemComponent = this.menuItems[i];
            if (itemComponent) {
                const ul = findDOMNode(itemComponent);
                const target = ul.querySelector('.selected');
                target && scrollIntoView(ul, target);
            }
        }
    }

    saveMenuRef = index => node => {
        this.menuItems[index] = node;
    }

    render () {
        return this.getShowOptions().map((options, index) => {
            return (
                <ul className='cascader-menu-list' key={index} ref={this.saveMenuRef(index)}>
                    {
                        options.map(option => this.getOption(option, index))
                    }
                </ul>
            );
        });
    }

    componentDidMount () {
        this.props.emitter.on('doc-click', this.resetActiveVal);
        this.props.emitter.on('set-def-values', this.setDefValues);
        this.props.emitter.on('shown', this.scrollToSelectedOption);
    }
}