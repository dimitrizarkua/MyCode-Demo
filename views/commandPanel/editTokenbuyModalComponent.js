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

function mapTokenbuyToForm(tokenbuy) {
  const form = {};
  if (tokenbuy) {
    for (let field of EditTokenbuyModalComponent.fieldsToEdit) {
      form[field] = tokenbuy[field];
    }
  }
  return form;
}

export default class EditTokenbuyModalComponent extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    resolve: PropTypes.func,
    reject: PropTypes.func,

    type: PropTypes.string,
    title: PropTypes.string,

    tokenbuy: PropTypes.object
  }

  static defaultProps = {
    type: 'primary',
    title: 'Edit tokenbuy'
  }

  static fieldsToEdit = [
    'purchaseAmount',
    'creditPrice',
    'creditAmount',
    'withdrawAddress'
  ]

  constructor(props) {
    super(props);

    this.state = {
      form: mapTokenbuyToForm(props.tokenbuy)
    };
  }

  componentWillReceiveProps(nextProps) {
    assert(!nextProps.show || nextProps.tokenbuy, 'tokenbuy is required');

    if (!nextProps.tokenbuy) {
      return;
    }

    const { form } = this.state;
    for (let field of this.constructor.fieldsToEdit) {
      if (form[field] !== nextProps.tokenbuy[field]) {
        this.setState({ form: mapTokenbuyToForm(nextProps.tokenbuy) });
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

  renderPurchaseAmount(purchaseAmount, onChange) {
    return (
      <Input
        label="Purchase Amount"
        value={purchaseAmount}
        onChange={onChange}
      />
    );
  }

  renderCreditPrice(creditPrice, onChange) {
    return (
      <Input
        label="Credit Price"
        value={creditPrice}
        onChange={onChange}
      />
    );
  }

  renderCreditAmount(creditAmount, onChange) {
    return (
      <Input
        label="Credit Amount"
        value={creditAmount}
        onChange={onChange}
      />
    );
  }

  renderWithdrawAddress(withdrawAddress, onChange) {
    return (
      <Input
        label="Withdraw Address"
        value={withdrawAddress}
        onChange={onChange}
      />
    );
  }

  render() {
    const props = this.props;
    // can't use PropTypes `required` validation, because
    //  of the way this component is passed into PromiseComponent
    //  on usage.
    assert(!props.show || props.tokenbuy, 'tokenbuy is required');

    const { form } = this.state;

    return (
      <ModalComponent
        title={props.title}
        type={props.type}
        isOpen={props.show}
      >
        {this.renderPurchaseAmount(form.purchaseAmount, e => this.handleChange('purchaseAmount', e.target.value))}
        {this.renderCreditPrice(form.creditPrice, e => this.handleChange('creditPrice', e.target.value))}
        {this.renderCreditAmount(form.creditAmount, e => this.handleChange('creditAmount', e.target.value))}
        {this.renderWithdrawAddress(form.withdrawAddress, e => this.handleChange('withdrawAddress', e.target.value))}

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
