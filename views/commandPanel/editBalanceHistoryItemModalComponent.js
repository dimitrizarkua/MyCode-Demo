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

function mapBalanceHistoryItemToForm(balanceHistoryItem) {
  const form = {};
  if (balanceHistoryItem) {
    for (let field of EditBalanceHistoryItemModalComponent.fieldsToEdit) {
      form[field] = balanceHistoryItem[field];
    }
  }
  return form;
}

export default class EditBalanceHistoryItemModalComponent extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    resolve: PropTypes.func,
    reject: PropTypes.func,

    type: PropTypes.string,
    title: PropTypes.string,

    balanceHistoryItem: PropTypes.object
  }

  static defaultProps = {
    type: 'primary',
    title: 'Edit Balance History Item'
  }

  static fieldsToEdit = [
    'newBalance'
  ]

  constructor(props) {
    super(props);

    this.state = {
      form: mapBalanceHistoryItemToForm(props.balanceHistoryItem)
    };
  }

  componentWillReceiveProps(nextProps) {
    // can't use PropTypes `required` validation, because
    //  of the way this component is passed into PromiseComponent
    //  on usage.
    assert(!nextProps.show || nextProps.balanceHistoryItem, 'balanceHistoryItem is required');

    if (!nextProps.balanceHistoryItem) {
      return;
    }

    const { form } = this.state;
    for (let field of this.constructor.fieldsToEdit) {
      if (form[field] !== nextProps.balanceHistoryItem[field]) {
        this.setState({ form: mapBalanceHistoryItemToForm(nextProps.balanceHistoryItem) });
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

  renderNewBalance(newBalance, onChange) {
    return (
      <Input
        label="New Balance"
        value={newBalance}
        onChange={onChange}
      />
    );
  }

  render() {
    const props = this.props;

    const { form } = this.state;

    return (
      <ModalComponent
        title={props.title}
        type={props.type}
        isOpen={props.show}
      >
        {this.renderNewBalance(form.newBalance, e => this.handleChange('newBalance', e.target.value))}

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
