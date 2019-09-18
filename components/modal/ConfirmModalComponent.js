// @flow weak

import React from 'react';
import { Modal, Button } from 'react-blur-admin';
import PropTypes from 'prop-types';

const ConfirmModalComponent = props => (
  <Modal title="Confirm" type={props.type} isOpen={props.show}>
    {props.content}
    <div className="modal-footer">
      <Button
        type={props.type}
        isIconHidden={true}
        size="sm"
        title={'Confirm'}
        onClick={props.resolve}
      />
      <Button
        isIconHidden={true}
        size="sm"
        title={'Cancel'}
        onClick={props.reject}
      />
    </div>
  </Modal>
);
ConfirmModalComponent.propTypes = {
  show: PropTypes.bool,
  resolve: PropTypes.func,
  reject: PropTypes.func,
  type: PropTypes.string,
  content: PropTypes.any
};
ConfirmModalComponent.defaultProps = {
  type: 'warning',
  content: 'Are you sure?'
};

export default ConfirmModalComponent;
