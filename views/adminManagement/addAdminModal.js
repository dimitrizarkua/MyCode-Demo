// @flow

import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'react-blur-admin';
import { type AddAdminParams } from '../../redux/modules/adminManagement';
import {
  ModalComponent
} from '../../components';
import { validateEmail, validatePassword } from '../../services/validate';

type Props = {
  onClose(): void,
  onAddAdmin(params: AddAdminParams): void,
  isFetching: boolean,
  isOpen: boolean
};

type FormValues = {
  email: string,
  password: string,
  hasPermissionKycRead: boolean,
  hasPermissionKycWrite: boolean,
  hasPermissionUserInfoRead: boolean,
  hasPermissionUserInfoWrite: boolean,
  hasPermissionWithdrawRead: boolean,
  hasPermissionWithdrawWrite: boolean,
  hasPermissionReferralWrite: boolean,
  hasPermissionKycReportRead: boolean,
  hasPermissionPepRead: boolean,
  hasPermissionAdminManagementRead: boolean,
  hasPermissionAdminManagementWrite: boolean
}

type State = FormValues & {
  emailValid: boolean | null,
  passwordValid: boolean | null
};

export default class AddAdminModal extends PureComponent<Props, State> {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onAddAdmin: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired
  }

  static defaultProps = {
  }

  state: State = this.initialState()

  initialState() {
    return {
      email: '',
      emailValid: null,
      password: '',
      passwordValid: null,
      hasPermissionKycRead: false,
      hasPermissionKycWrite: false,
      hasPermissionUserInfoRead: false,
      hasPermissionUserInfoWrite: false,
      hasPermissionWithdrawRead: false,
      hasPermissionWithdrawWrite: false,
      hasPermissionReferralWrite: false,
      hasPermissionKycReportRead: false,
      hasPermissionPepRead: false,
      hasPermissionAdminManagementRead: false,
      hasPermissionAdminManagementWrite: false
    };
  }


  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.isOpen) {
      this.setState(this.initialState());
    }
  }


  mapStateToAddAdminParams(state: State): AddAdminParams {
    const {
      email,
      password,
      hasPermissionKycRead,
      hasPermissionKycWrite,
      hasPermissionUserInfoRead,
      hasPermissionUserInfoWrite,
      hasPermissionWithdrawRead,
      hasPermissionWithdrawWrite,
      hasPermissionReferralWrite,
      hasPermissionKycReportRead,
      hasPermissionPepRead,
      hasPermissionAdminManagementRead,
      hasPermissionAdminManagementWrite
    } = state;

    const permissions = [];
    if (hasPermissionKycRead) {
      permissions.push('kyc-read');
    }
    if (hasPermissionKycWrite) {
      permissions.push('kyc-write');
    }
    if (hasPermissionUserInfoRead) {
      permissions.push('userinfo-read');
    }
    if (hasPermissionUserInfoWrite) {
      permissions.push('userinfo-write');
    }
    if (hasPermissionWithdrawRead) {
      permissions.push('withdraw-read');
    }
    if (hasPermissionWithdrawWrite) {
      permissions.push('withdraw-write');
    }
    if (hasPermissionReferralWrite) {
      permissions.push('referral-write');
    }
    if (hasPermissionKycReportRead) {
      permissions.push('kycreport-read');
    }
    if (hasPermissionPepRead) {
      permissions.push('pep-read');
    }
    if (hasPermissionAdminManagementRead) {
      permissions.push('admin-management-read');
    }
    if (hasPermissionAdminManagementWrite) {
      permissions.push('admin-management-write');
    }

    return {
      email,
      password,
      permissions
    };
  }

  validate(state: State) {
    return {
      emailValid: validateEmail(state.email),
      passwordValid: validatePassword(state.password)
    };
  }

  isValid(state: State) {
    for (let key in state) {
      if (!key.endsWith('Valid')) {
        continue;
      }
      if (state[key] === null) {
        return null;
      }
      if (state[key] === false) {
        return false;
      }
    }
    return true;
  }


  factoryForOnChange(fieldname: $Keys<FormValues>) {
    if (fieldname === 'email') {
      return (e: SyntheticEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;

        this.setState({
          email: value,
          emailValid: validateEmail(value)
        });
      };
    } else if (fieldname === 'password') {
      return (e: SyntheticEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;

        this.setState({
          password: value,
          passwordValid: validatePassword(value)
        });
      };
    } else {
      return (e: SyntheticEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        this.setState({
          // $FlowIgnore all non-string values handled above
          [fieldname]: value
        });
      };
    }
  }

  factoryForOnValidate(fieldname: $Keys<FormValues>) {
    return () => this.state[fieldname+'Valid'];
  }


  onClickAdd = () => {
    const {
      onAddAdmin
    } = this.props;

    this.setState(state => this.validate(state), () => {
      if (this.isValid(this.state)) {
        onAddAdmin(this.mapStateToAddAdminParams(this.state));
      }
    });
  }


  render() {
    const {
      email,
      password,
      hasPermissionKycRead,
      hasPermissionKycWrite,
      hasPermissionUserInfoRead,
      hasPermissionUserInfoWrite,
      hasPermissionWithdrawRead,
      hasPermissionWithdrawWrite,
      hasPermissionReferralWrite,
      hasPermissionKycReportRead,
      hasPermissionPepRead,
      hasPermissionAdminManagementRead,
      hasPermissionAdminManagementWrite
    } = this.state;
    const {
      onClose,
      isFetching,
      isOpen
    } = this.props;

    return (
      <ModalComponent
        type="success"
        title="Add Admin"
        isOpen={isOpen}
      >
        <Input
          label="Email"
          value={email}
          onChange={this.factoryForOnChange('email')}
          onValidate={this.factoryForOnValidate('email')}
        />

        <Input
          label="Password"
          value={password}
          onChange={this.factoryForOnChange('password')}
          onValidate={this.factoryForOnValidate('password')}
        />

        <Input
          label='Permission "kyc-read"'
          value={hasPermissionKycRead}
          type="checkbox"
          onChange={(val: boolean) => this.setState({ hasPermissionKycRead: val })}
        />

        <Input
          label='Permission "kyc-write"'
          value={hasPermissionKycWrite}
          type="checkbox"
          onChange={(val: boolean) => this.setState({ hasPermissionKycWrite: val })}
        />

        <Input
          label='Permission "userinfo-read"'
          value={hasPermissionUserInfoRead}
          type="checkbox"
          onChange={(val: boolean) => this.setState({ hasPermissionUserInfoRead: val })}
        />

        <Input
          label='Permission "userinfo-write"'
          value={hasPermissionUserInfoWrite}
          type="checkbox"
          onChange={(val: boolean) => this.setState({ hasPermissionUserInfoWrite: val })}
        />

        <Input
          label='Permission "withdraw-read"'
          value={hasPermissionWithdrawRead}
          type="checkbox"
          onChange={(val: boolean) => this.setState({ hasPermissionWithdrawRead: val })}
        />

        <Input
          label='Permission "withdraw-write"'
          value={hasPermissionWithdrawWrite}
          type="checkbox"
          onChange={(val: boolean) => this.setState({ hasPermissionWithdrawWrite: val })}
        />

        <Input
          label='Permission "referral-write"'
          value={hasPermissionReferralWrite}
          type="checkbox"
          onChange={(val: boolean) => this.setState({ hasPermissionReferralWrite: val })}
        />

        <Input
          label='Permission "kycreport-read"'
          value={hasPermissionKycReportRead}
          type="checkbox"
          onChange={(val: boolean) => this.setState({ hasPermissionKycReportRead: val })}
        />

        <Input
          label='Permission "pep-read"'
          value={hasPermissionPepRead}
          type="checkbox"
          onChange={(val: boolean) => this.setState({ hasPermissionPepRead: val })}
        />

        <Input
          label='Permission "admin-management-read"'
          value={hasPermissionAdminManagementRead}
          type="checkbox"
          onChange={(val: boolean) => this.setState({ hasPermissionAdminManagementRead: val })}
        />

        <Input
          label='Permission "admin-management-write"'
          value={hasPermissionAdminManagementWrite}
          type="checkbox"
          onChange={(val: boolean) => this.setState({ hasPermissionAdminManagementWrite: val })}
        />

        <div className="modal-footer">
          <Button
            type="success"
            isIconHidden={true}
            size="sm"
            title={isFetching ? 'Adding...' : 'Add'}
            disabled={isFetching || this.isValid(this.state) === false}
            onClick={this.onClickAdd}
          />
          <Button
            isIconHidden={true}
            size="sm"
            title="Close"
            disabled={isFetching}
            onClick={onClose}
          />
        </div>
      </ModalComponent>
    );
  }
}
