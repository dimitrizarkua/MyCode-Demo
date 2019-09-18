// @flow weak

import React from 'react';
import { Modal, Button } from 'react-blur-admin';
import PropTypes from 'prop-types';
import {
  TableComponent
} from '../../components';

const LogsModalComponent = props => {
  return (
    <Modal title={props.title} type={props.type} isOpen={props.show}>
      <TableComponent
        headData={props.headData}
        data={props.data} />

      <div className="modal-footer">
        <Button
          type={props.type}
          isIconHidden={true}
          size="sm"
          title={'Close'}
          onClick={props.resolve}
        />
      </div>
    </Modal>
  );
};
LogsModalComponent.propTypes = {
  show: PropTypes.bool,
  resolve: PropTypes.func,
  reject: PropTypes.func,
  type: PropTypes.string,
  title: PropTypes.string,
  headData: PropTypes.array,
  data: PropTypes.array
};
LogsModalComponent.defaultProps = {
  type: 'primary',
  title: 'Logs',
  headData: [],
  data: []
};

export default LogsModalComponent;
