import assert from 'assert';
import _ from 'lodash';
import React, {
  PureComponent
} from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import PropTypes from 'prop-types';

function isTextOverflow(element) {
  return element.clientWidth < element.scrollWidth;
}

export default class OverflowPopupComponent extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    maxWidth: PropTypes.string
  };
  static defaultProps = {
    maxWidth: '100px'
  };

  constructor(props) {
    super(props);

    this.state = {
      overflow: false
    };
  }

  componentDidMount() {
    this.checkOverflow();
  }

  componentDidUpdate() {
    this.checkOverflow();
  }

  // Protects unnecessary rerenders when state hasn't changed
  safeSetState(obj) {
    for (let propname in obj) {
      if (this.state[propname] !== obj[propname]) {
        this.setState(obj);
        break;
      }
    }
  }

  checkOverflow() {
    const element = this.element;
    assert(element, 'element must be present here');

    const overflow = isTextOverflow(element);
    this.safeSetState({ overflow });
  }

  render() {
    const { overflow } = this.state;
    const { children, maxWidth, title } = this.props;

    const popover = (
      <Popover id={`popover-trigger-${_.uniqueId}`} title={title}>
        {children}
      </Popover>
    );

    const content = (
      <div ref={ref => (this.element=ref)} style={{maxWidth: maxWidth, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
        {children}
      </div>
    );

    return (
      overflow
        ?
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
          {content}
        </OverlayTrigger>
        :
        <div>
          {content}
        </div>
    );
  }
}
