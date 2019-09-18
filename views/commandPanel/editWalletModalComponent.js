// @flow weak

import assert from 'assert';

import React, {
  PureComponent
} from 'react';
import { Button, Input } from 'react-blur-admin';
import PropTypes from 'prop-types';
import {
  ModalComponent
} from '../../components';

function mapWalletToForm(wallet) {
  const form = {};
  if (wallet) {
    for (let field of EditWalletModalComponent.fieldsToEdit) {
      form[field] = wallet[field];
    }
  }
  return form;
}

export default class EditWalletModalComponent extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    resolve: PropTypes.func,
    reject: PropTypes.func,

    type: PropTypes.string,
    title: PropTypes.string,

    wallet: PropTypes.object
  }

  static defaultProps = {
    type: 'primary',
    title: 'Edit wallet'
  }

  static fieldsToEdit = [
    'balance'
  ]

  constructor(props) {
    super(props);

    this.state = {
      form: mapWalletToForm(props.wallet)
    };
  }

  componentWillReceiveProps(nextProps) {
    assert(!nextProps.show || nextProps.wallet, 'wallet is required');

    if (!nextProps.wallet) {
      return;
    }

    const { form } = this.state;
    for (let field of this.constructor.fieldsToEdit) {
      if (form[field] !== nextProps.wallet[field]) {
        this.setState({ form: mapWalletToForm(nextProps.wallet) });
        break;
      }
    }
  }

  handleChange(fieldname, value) {
    this.setState({ form: {
      ...this.state.form, // can't we get rid of this stupid copying without `polluting` main state object with form fields?
      [fieldname]: value
    }});
  }

  renderBalance(balance, onChange) {
    return (
      <Input
        label="Balance"
        value={balance}
        onChange={onChange}
      />
    );
  }

  render() {
    const props = this.props;
    // can't use PropTypes `required` validation, because
    //  of the way this component is passed into PromiseComponent
    //  on usage.
    assert(!props.show || props.wallet, 'wallet is required');

    const { form } = this.state;

    return (
      <ModalComponent
        title={props.title}
        type={props.type}
        isOpen={props.show}
      >
        {this.renderBalance(form.balance, e => this.handleChange('balance', e.target.value))}

        <div className="modal-footer">
          <Button
            type={props.type}
            isIconHidden={true}
            size="sm"
            title={'Save'}
            onClick={() => props.resolve(this.state.form)}
          />
          <Button
            isIconHidden={true}
            size="sm"
            title={'Cancel'}
            onClick={() => props.reject({ code: 'CANCELLED_BY_USER' })}
          />
        </div>
      </ModalComponent>
    );
  }
}
