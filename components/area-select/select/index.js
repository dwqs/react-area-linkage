import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';

import { contains, scrollIntoView, setPanelPosition } from '@src/utils';

export default class Select extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            top: 32,
            shown: false,
            val: ''
        };

        this.rootDOM = null;
        this.areaRect = null;
        this.scrolling = false;
    }

    static propTypes = {
        value: PropTypes.any.isRequired,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        disabled: PropTypes.bool,
        placeholder: PropTypes.string,
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        onChange: PropTypes.func
    }

    static defaultProps = {
        disabled: false,
        placeholder: '请选择',
        size: 'medium',
        label: ''
    }

    static displayName = 'Select'

    handleTriggerClick = (e) => {
        e.stopPropagation();
        if (this.props.disabled) {
            return;
        }
        this.setState({
            shown: !this.state.shown,
            top: this.setPosition(false)
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

    handleDocClick = (e) => {
        const target = e.target;
        if (!contains(this.rootDOM, target) && this.state.shown) {
            this.setState({
                shown: false
            });
        }
    }

    handleDocResize = () => {
        this.areaRect = this.rootDOM.getBoundingClientRect();
        this.setPosition();
    }

    handleOptionClick = (option) => {
        const { value, label } = option.props;
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(value, label);
        }

        this.setState({
            shown: false,
            val: value
        });
    }

    scrollToSelectedOption = () => {
        if (!this.scrolling) {
            this.scrolling = true;
            
            // this.scrolling = false;
            console.log('eeee');
        }
    }

    setWrapRef = (node) => {
        this.listWrap = node;
    }

    render () {
        const { placeholder, value, disabled, size, children, label } = this.props;
        const { shown, top, val } = this.state;
        
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
                <div className={classNames('area-selectable-list-wrap area-zoom-in-top-enter', {
                    'area-zoom-in-top-enter-active': shown
                })} style={{ top: top }} ref={this.setWrapRef}>
                    <ul className='area-selectable-list'>
                        {
                            React.Children.map(children, el => {
                                return React.cloneElement(el, Object.assign({}, el.props, {
                                    className: classNames(el.props.className, {
                                        'selected': el.props.value === val
                                    }),
                                    onClick: this.handleOptionClick.bind(this, el)
                                }));
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
    
    componentDidMount() {
        this.rootDOM = findDOMNode(this);
        this.areaRect = this.rootDOM.getBoundingClientRect();
        
        this.listWrap.addEventListener('transitionend', this.scrollToSelectedOption, false);
        window.document.addEventListener('scroll', this.handleDocResize, false);
        window.document.addEventListener('click', this.handleDocClick, false);
        window.addEventListener('resize', this.handleDocResize, false);
    }

    componentWillUnmount() {
        window.document.removeEventListener('scroll', this.handleDocResize, false);
        window.document.removeEventListener('click', this.handleDocClick, false);
        window.removeEventListener('resize', this.handleDocResize, false);

        this.rootDOM = null;
        this.areaRect = null;
    }
}