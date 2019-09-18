// @flow weak

import React, {
  PureComponent
}                     from 'react';
import PropTypes      from 'prop-types';
import { isExternalUrl } from '../../../../models/navigation';

class Menu extends PureComponent {
  static propTypes = {
    name:      PropTypes.string.isRequired,
    linkTo:  PropTypes.string,
    faIconName: PropTypes.string,
    activeView:       PropTypes.string.isRequired,

    initialCollapseState: PropTypes.bool
  };

  static defaultProps = {
    headerBackColor: '#283744'
  };

  state = {
    isCollapsed: true
  };

  componentDidMount() {
    const { initialCollapseState } = this.props;
    if (typeof initialCollapseState === 'boolean') {
      this.setInitialCollapse(initialCollapseState);
    }
  }

  isSelected(name) {
    return this.props.activeView === name ? 'selected' : '';
  }

  render() {
    const {
      name,
      linkTo,
      faIconName,
      activeView
    } = this.props;
    const { isCollapsed } = this.state;

    const linkProps = isExternalUrl(linkTo) ? {
      target: '_blank'
    } : {};

    return (

      <li className={`al-sidebar-list-item ${this.isSelected(name)}`} key={name}>
        <a className="al-sidebar-list-link" href={ linkTo } {...linkProps}>
          <i className={`fa ${faIconName}`} />
          <span>{name}</span>
        </a>
      </li>
    );
  }

  setInitialCollapse = (value) => {
    this.setState({ isCollapsed: value });
  }

  handlesCollapseClick = (evt) => {
    evt.preventDefault();
    const { isCollapsed } = this.state;
    this.setState({ isCollapsed: !isCollapsed });
  }
}

export default Menu;
