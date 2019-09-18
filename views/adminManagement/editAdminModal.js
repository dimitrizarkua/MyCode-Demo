// @flow

import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'react-blur-admin';
import { type EditAdminParams, type Admin } from '../../redux/modules/adminManagement';
import {
  ModalComponent
} from '../../components';

type FormValues = {
  email: string,
  password?: string,
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

type ValidateResult = boolean
type FormValid = {
  [$Keys<FormValues>]: ?ValidateResult
}

type Props = {
  onClose(): void,
  onEditAdmin(params: EditAdminParams): void,
  validate(field: string, obj: FormValues): ValidateResult,
  isFetching: boolean,
  isOpen: boolean,
  admin: Admin,
}

type State = {|
  form: FormValues,
  formValid: FormValid
|}

export default class EditAdminModal extends PureComponent<Props, State> {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onEditAdmin: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    admin: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    }).isRequired
  }

  static defaultProps = {
  }

  state: State = this.initialState(this.props)

  initialState(props: Props): State {
    const { admin } = props;

    return {
      form: this.mapAdminToFormValues(admin),
      formValid: {}
    };
  }


  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.isOpen && nextProps.isOpen) {
      this.setState(this.initialState(nextProps));
    } else if (this.props.admin !== nextProps.admin || this.props.validate !== nextProps.validate) {
      const form = this.mapAdminToFormValues(nextProps.admin);
      this.setState({
        form,
        formValid: this.validate(form, nextProps)
      });
    }
  }


  mapToEditAdminParams(state: State, props: Props): EditAdminParams {
    const {
      form: {
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
      }
    } = state;
    const {
      admin: {
        id
      }
    } = props;

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

    const res: EditAdminParams = {
      id,
      email,
      permissions
    };
    if (password) {
      // don't send empty password
      res.password = password;
    }

    return res;
  }

  mapAdminToFormValues(admin: Admin): FormValues {
    const {
      email,
      permissions
    } = admin;

    return {
      email,
      hasPermissionKycRead: !!~permissions.indexOf('kyc-read'),
      hasPermissionKycWrite: !!~permissions.indexOf('kyc-write'),
      hasPermissionUserInfoRead: !!~permissions.indexOf('userinfo-read'),
      hasPermissionUserInfoWrite: !!~permissions.indexOf('userinfo-write'),
      hasPermissionWithdrawRead: !!~permissions.indexOf('withdraw-read'),
      hasPermissionWithdrawWrite: !!~permissions.indexOf('withdraw-write'),
      hasPermissionReferralWrite: !!~permissions.indexOf('referral-write'),
      hasPermissionKycReportRead: !!~permissions.indexOf('kycreport-read'),
      hasPermissionPepRead: !!~permissions.indexOf('pep-read'),
      hasPermissionAdminManagementRead: !!~permissions.indexOf('admin-management-read'),
      hasPermissionAdminManagementWrite: !!~permissions.indexOf('admin-management-write')
    };
  }

  validate(form: FormValues, props: Props): FormValid {
    const { validate } = props;

    const res = {};
    for (let key in form) {
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        res[key] = validate(key, form);
      }
    }

    return res;
  }

  isValid(state: State): boolean | null {
    const { formValid } = state;

    for (let key in formValid) {
      if (Object.prototype.hasOwnProperty.call(formValid, key)) {
        // $FlowIgnore obviously accessing `key` is valid here
        if (formValid[key] === null || typeof formValid[key] === 'undefined') {
          return null;
        }
        if (formValid[key] === false) {
          return false;
        }
      }
    }
    return true;
  }


  factoryForOnChange(fieldname: 'email' | 'password') {
    return (e: SyntheticEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;

      this.setState(({ form, formValid }) => {
        const { validate } = this.props;

        const newForm: FormValues = {
          ...form,
          [fieldname]: value
        };
        return {
          form: newForm,
          formValid: {
            ...formValid,
            [fieldname]: validate(fieldname, newForm)
          }
        };
      });
    };
  }

  factoryForOnChangePermission = (fieldname: $Keys<$Diff<FormValues, { email: string, password: ?string }>>) => {
    return (value: boolean) => {
      this.setState(({ form }) => ({ form: {
        ...form,
        [fieldname]: value
      }}));
    };
  }

  factoryForOnValidate(fieldname: $Keys<FormValues>) {
    return () => this.state.formValid[fieldname];
  }


  onClickSave = () => {
    this.setState(({ form }) => ({ formValid: this.validate(form, this.props) }), () => {
      const {
        onEditAdmin
      } = this.props;

      if (this.isValid(this.state)) {
        onEditAdmin(this.mapToEditAdminParams(this.state, this.props));
      }
    });
  }


  render() {
    const {
      form: {
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
      }
    } = this.state;
    const {
      onClose,
      isFetching,
      isOpen
    } = this.props;

    return (
      <ModalComponent
        type="success"
        title="Edit Admin"
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
          onChange={this.factoryForOnChangePermission('hasPermissionKycRead')}
        />

        <Input
          label='Permission "kyc-write"'
          value={hasPermissionKycWrite}
          type="checkbox"
          onChange={this.factoryForOnChangePermission('hasPermissionKycWrite')}
        />

        <Input
          label='Permission "userinfo-read"'
          value={hasPermissionUserInfoRead}
          type="checkbox"
          onChange={this.factoryForOnChangePermission('hasPermissionUserInfoRead')}
        />

        <Input
          label='Permission "userinfo-write"'
          value={hasPermissionUserInfoWrite}
          type="checkbox"
          onChange={this.factoryForOnChangePermission('hasPermissionUserInfoWrite')}
        />

        <Input
          label='Permission "withdraw-read"'
          value={hasPermissionWithdrawRead}
          type="checkbox"
          onChange={this.factoryForOnChangePermission('hasPermissionWithdrawRead')}
        />

        <Input
          label='Permission "withdraw-write"'
          value={hasPermissionWithdrawWrite}
          type="checkbox"
          onChange={this.factoryForOnChangePermission('hasPermissionWithdrawWrite')}
        />

        <Input
          label='Permission "referral-write"'
          value={hasPermissionReferralWrite}
          type="checkbox"
          onChange={this.factoryForOnChangePermission('hasPermissionReferralWrite')}
        />

        <Input
          label='Permission "kycreport-read"'
          value={hasPermissionKycReportRead}
          type="checkbox"
          onChange={this.factoryForOnChangePermission('hasPermissionKycReportRead')}
        />

        <Input
          label='Permission "pep-read"'
          value={hasPermissionPepRead}
          type="checkbox"
          onChange={this.factoryForOnChangePermission('hasPermissionPepRead')}
        />

        <Input
          label='Permission "admin-management-read"'
          value={hasPermissionAdminManagementRead}
          type="checkbox"
          onChange={this.factoryForOnChangePermission('hasPermissionAdminManagementRead')}
        />

        <Input
          label='Permission "admin-management-write"'
          value={hasPermissionAdminManagementWrite}
          type="checkbox"
          onChange={this.factoryForOnChangePermission('hasPermissionAdminManagementWrite')}
        />

        <div className="modal-footer">
          <Button
            type="success"
            isIconHidden={true}
            size="sm"
            title={isFetching ? 'Saving...' : 'Save'}
            disabled={isFetching || this.isValid(this.state) === false}
            onClick={this.onClickSave}
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
