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

function mapPaymentToForm(payment) {
  const form = {};
  if (payment) {
    for (let field of EditPaymentModalComponent.fieldsToEdit) {
      form[field] = payment[field];
    }
  }
  return form;
}

export default class EditPaymentModalComponent extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    resolve: PropTypes.func,
    reject: PropTypes.func,

    type: PropTypes.string,
    title: PropTypes.string,

    payment: PropTypes.object
  }

  static defaultProps = {
    type: 'primary',
    title: 'Edit payment'
  }

  static fieldsToEdit = [
    'amountCredited',
    'address',
    'txHash',
    'debited',
    'credited'
  ]

  constructor(props) {
    super(props);

    this.state = {
      form: mapPaymentToForm(props.payment)
    };
  }

  componentWillReceiveProps(nextProps) {
    assert(!nextProps.show || nextProps.payment, 'payment is required');

    if (!nextProps.payment) {
      return;
    }

    const { form } = this.state;
    for (let field of this.constructor.fieldsToEdit) {
      if (form[field] !== nextProps.payment[field]) {
        this.setState({ form: mapPaymentToForm(nextProps.payment) });
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

  renderAmountCredited(amountCredited, onChange) {
    return (
      <Input
        label="Amount Credited"
        value={amountCredited}
        onChange={onChange}
      />
    );
  }

  renderAddress(address, onChange) {
    return (
      <Input
        label="Address"
        value={address}
        onChange={onChange}
      />
    );
  }

  renderTxHash(txHash, onChange) {
    return (
      <Input
        label="txHash"
        value={txHash}
        onChange={onChange}
      />
    );
  }

  renderDebited(debited, onChange) {
    return (
      <Input
        type="checkbox"
        label="Debited"
        value={debited}
        onChange={onChange}
      />
    );
  }

  renderCredited(credited, onChange) {
    return (
      <Input
        type="checkbox"
        label="Credited"
        value={credited}
        onChange={onChange}
      />
    );
  }

  render() {
    const props = this.props;
    // can't use PropTypes `required` validation, because
    //  of the way this component is passed into PromiseComponent
    //  on usage.
    assert(!props.show || props.payment, 'payment is required');

    const { form } = this.state;

    return (
      <ModalComponent
        title={props.title}
        type={props.type}
        isOpen={props.show}
      >
        {this.renderAmountCredited(form.amountCredited, e => this.handleChange('amountCredited', e.target.value))}
        {this.renderAddress(form.address, e => this.handleChange('address', e.target.value))}
        {this.renderTxHash(form.txHash, e => this.handleChange('txHash', e.target.value))}
        {this.renderDebited(form.debited, () => this.handleChange('debited', !form.debited))}
        {this.renderCredited(form.credited, () => this.handleChange('credited', !form.credited))}

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
