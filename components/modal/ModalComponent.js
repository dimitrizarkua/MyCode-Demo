// this is a copy from https://github.com/knledg/react-blur-admin/blob/master/src/modal.js
// with some modifications to allow proper size change

import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'react-blur-admin';

export default class ModalComponent extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    buttonText: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.string,
    align: PropTypes.string,
    type: PropTypes.string,
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    children: PropTypes.node
  }

  static defaultProps = {
    className: '',
    size: 'md',
    align: 'left',
    title: '',
    type: 'success',
    isOpen: false,
    icon: ''
  }

  getHeaderClass() {
    switch (this.props.type) {
    case 'success':
      return 'success';

    case 'primary':
      return 'primary';

    case 'remove':
    case 'danger':
      return 'danger';

    case 'info':
      return 'info';

    case 'warning':
      return 'warning';

    default:
      throw new Error('Unknown Modal Type');
    }
  }

  getBodyAlignment() {
    switch (this.props.align) {
    case 'center':
      return 'text-center';

    case 'right':
      return 'text-right';

    case 'left':
    default:
      return '';
    }
  }

  renderIcon() {
    if (!this.props.icon) {
      return null;
    }

    return <i className={this.props.icon} />;
  }

  renderModalSize() {
    switch (this.props.size) {
    case 'xs':
    case 'extra-small':
      return 'modal-xs';

    case 'sm':
    case 'small':
      return 'modal-sm';

    case 'md':
    case 'medium':
      return 'modal-md';

    case 'lg':
    case 'large':
      return 'modal-lg';

    case 'auto':
    case 'none':
    default:
      return '';
    }
  }

  renderHeader() {
    return (
      <div className={`modal-header bg-${this.getHeaderClass()}`}>
        {this.renderIcon()} {this.props.title}
      </div>
    );
  }

  renderBody() {
    return (
      <div className={`modal-body ${this.getBodyAlignment()}`}>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }

  renderFooter() {
    if (!this.props.onClose) {
      return null;
    }
    return (
      <div className="modal-footer">
        <Button
          type={this.props.type}
          isIconHidden={true}
          size="sm"
          title={this.props.buttonText ? this.props.buttonText : 'OK'}
          onClick={this.props.onClose} />
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className={`fade ${this.props.isOpen ? 'modal-backdrop in' : ''}`} />

        <div className={`modal fade ${this.props.isOpen ? 'modal-open in' : ''} ${this.props.className}`}>
          <div className={`modal-dialog ${this.renderModalSize()}`}>
            <div className="modal-content">
              {this.renderHeader()}
              {this.renderBody()}
              {this.renderFooter()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
