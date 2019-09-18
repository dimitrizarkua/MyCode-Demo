// @flow

import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-blur-admin';
import { type AddAdminParams, type AddAdminState } from '../../redux/modules/adminManagement';
import AddAdminModal from './addAdminModal';

import * as toastr from 'toastr';

type Props = {
  addAdminResult: AddAdminState,
  actions: {
    addAdminIfNeeded(params: AddAdminParams): void
  }
};

type State = {|
  showModal: boolean
|};

export default class AddAdmin extends PureComponent<Props, State> {
  static propTypes = {
    addAdminResult: PropTypes.shape({
      isFetching: PropTypes.bool,
      time: PropTypes.string,
      payload: PropTypes.shape({
        result: PropTypes.bool
      }),
      error: PropTypes.string
    }).isRequired,
    actions: PropTypes.shape({
      addAdminIfNeeded: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
  }

  state: State = {
    showModal: false
  }


  componentWillReceiveProps(nextProps: Props) {
    if (this.props.addAdminResult.isFetching === true) {
      if (nextProps.addAdminResult.isFetching === false) {
        const payload = nextProps.addAdminResult.payload;
        if (payload) {
          const message = 'Admin successfully added';
          toastr.success(message);
          this.setState({ showModal: false });
        }
        // no need to show error message on error, it is shown automatically
      }
    }
  }


  onCloseModal = () => {
    this.setState({ showModal: false });
  }

  onAddAdminModal = (params: AddAdminParams) => {
    const {
      actions: {
        addAdminIfNeeded
      }
    } = this.props;

    addAdminIfNeeded(params);
  }

  onClickAddAdmin = () => {
    this.setState({ showModal: true });
  }


  render() {
    const {
      showModal
    } = this.state;
    const {
      addAdminResult: {
        isFetching
      }
    } = this.props;

    return (
      <div>
        <AddAdminModal
          onClose={this.onCloseModal}
          onAddAdmin={this.onAddAdminModal}
          isFetching={isFetching}
          isOpen={showModal}
        />
        <Button type="success" title="Add admin" onClick={this.onClickAddAdmin} />
      </div>
    );
  }
}
