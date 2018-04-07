import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Option extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
    }
    
    static propTypes = {
        value: PropTypes.any.isRequired,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }

    static displayName = 'Option'

    leaveItem = () => {
        this.setState({
            hover: false
        });
    }

    enterItem = () => {
        this.setState({
            hover: true
        });
    }

    render () {
        const { value, label, selected, className, ...rest } = this.props;
        const { hover } = this.state;

        const classes = classNames('area-select-option', className, {
            'hover': hover
        });

        return (
            <li {...rest} className={classes} 
                value={value} 
                onMouseLeave={this.leaveItem} 
                onMouseEnter={this.enterItem}>
                {label || value}
            </li>
        );
    }
}