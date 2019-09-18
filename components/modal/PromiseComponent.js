// @flow weak

import assert from 'assert';
import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';

// Use for temporarily show some component
export default class PromiseComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      props: {}
    };
    this.promiseInfo = {
      resolve: () => {},
      reject: () => {}
    };
  }

  /**
   * Start the 'promise' by showing the content. Don't call it again before it finishes.
   * @param {*} props Additional properties to pass to child component.
   * @returns {Promise} Promise which resolves/rejects when child component is closed/finished.
   */
  start(props) {
    assert(this.state.show !== true, 'already started');

    return new Promise((resolve, reject) => {
      this.promiseInfo = {
        resolve,
        reject
      };
      this.setState({ props: props });
      this.show();
    });
  }

  show() {
    this.setState({ show: true });
  }

  hide() {
    this.setState({ show: false });
  }

  resolve = (payload) => {
    const { resolve } = this.promiseInfo;

    this.hide();
    resolve(payload);
  }

  reject = (err) => {
    const { reject } = this.promiseInfo;

    this.hide();
    reject(err);
  }

  render() {
    const { show } = this.state;

    return React.cloneElement(
      React.Children.only(this.props.children),
      {
        ...this.state.props,
        show: show,
        resolve: this.resolve,
        reject: this.reject
      }
    );
  }
}
