import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';

import CascaderMenu from './menu';

import { contains, setPanelPosition } from '@src/utils.js';

// import emitter from '../emit';

export default class Cascader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            top: 32,
            shown: false,
            label: '',
            values: []
        };

        this.rootDOM = null;
        this.areaRect = null;
    }
    
    static displayName = 'Cascader'

    static propTypes = {
        options: PropTypes.array.isRequired,
        disabled: PropTypes.bool,
        placeholder: PropTypes.string,
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        separator: PropTypes.string
    }

    static defaultProps = {
        disabled: false,
        placeholder: '请选择',
        size: 'medium',
        separator: '/'
    }

    handleTriggerClick = (e) => {
        e.stopPropagation();
        if (this.props.disabled) {
            return;
        }
        
        const tmp = this.state.shown;
        if (!tmp) {
            this.props.emitter.emit('shown');
        }
        
        this.setState({
            shown: !tmp,
            top: this.setPosition(false)
        }, () => {
            if (!this.state.shown) {
                this.props.emitter.emit('doc-click');
            }
        });
    }

    setPosition = (isUpdate = true) => {
        const panelHeight = parseInt(window.getComputedStyle(this.listWrap, null).getPropertyValue('height'));
        if (isUpdate) {
            this.setState({
                top: setPanelPosition(panelHeight, this.areaRect)
            });
        } else {
            return setPanelPosition(panelHeight, this.areaRect);
        }
    }

    handleDocResize = () => {
        this.areaRect = this.rootDOM.getBoundingClientRect();
        this.setPosition();
    }

    handleDocClick = (e) => {
        const target = e.target;
        if (!contains(this.rootDOM, target) && this.state.shown) {
            this.setState({
                shown: false
            }, () => {
                this.props.emitter.emit('doc-click');
            });
        }
    }

    handleSelectedChange = (codes, labels) => {
        this.setState({
            shown: false,
            label: labels.join(this.props.separator),
            values: codes
        });
    }

    // 设置默认值
    setDefValues = (codes, labels) => {
        this.setState({
            label: labels.join(this.props.separator),
            values: codes
        });
    }

    setWrapRef = (node) => {
        this.listWrap = node;
    }

    render () {
        const { placeholder, disabled, size, children, options, ...rest } = this.props;
        const { shown, top, label, values } = this.state;

        const classes = classNames('area-select', {
            'medium': size === 'medium',
            'small': size === 'small',
            'large': size === 'large',
            'is-disabled': disabled
        });

        return (
            <div className={classes}>
                <span className='area-selected-trigger' onClick={this.handleTriggerClick}>{label ? label : placeholder}</span>
                <i className={classNames('area-select-icon', { 'active': shown })} onClick={this.handleTriggerClick}></i>
                <div className={classNames('cascader-menu-list-wrap area-zoom-in-top-enter', {
                    'area-zoom-in-top-enter-active': shown
                })} style={{ top: top }} ref={this.setWrapRef}>
                    <CascaderMenu data={options} values={values}  {...rest} />
                </div>
            </div>
        );
    }

    componentDidMount () {
        this.rootDOM = findDOMNode(this);
        this.areaRect = this.rootDOM.getBoundingClientRect();

        window.document.addEventListener('scroll', this.handleDocResize, false);
        window.document.addEventListener('click', this.handleDocClick, false);
        window.addEventListener('resize', this.handleDocResize, false);

        // some emit
        this.props.emitter.on('selected', this.handleSelectedChange);
        this.props.emitter.on('set-def-values', this.setDefValues);
    }

    componentWillUnmount() {
        window.document.removeEventListener('scroll', this.handleDocResize, false);
        window.document.removeEventListener('click', this.handleDocClick, false);
        window.removeEventListener('resize', this.handleDocResize, false);

        this.rootDOM = null;
        this.areaRect = null;
    }
}