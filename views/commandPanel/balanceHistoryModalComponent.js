// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-blur-admin';
import {
  TableComponent,
  ModalComponent
} from '../../components';

type Props = {
  show: boolean,
  resolve: () => void,

  type: 'primary',
  title: string,

  headData: Array<string>,
  data: Array<any>
};

const propTypes = {
  show: PropTypes.bool,
  resolve: PropTypes.func,

  type: PropTypes.string,
  title: PropTypes.string,

  headData: PropTypes.array,
  data: PropTypes.array
};

const defaultProps = {
  show: false,
  resolve: () => {},

  type: 'primary',
  title: 'BalanceHistory',

  headData: [],
  data: []
};

const BalanceHistoryModalComponent = (props: Props) => {
  return (
    <ModalComponent
      title={props.title}
      type={props.type}
      isOpen={props.show}
      size="lg"
    >
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
    </ModalComponent>
  );
};
BalanceHistoryModalComponent.propTypes = propTypes;
BalanceHistoryModalComponent.defaultProps = defaultProps;

export default BalanceHistoryModalComponent;
