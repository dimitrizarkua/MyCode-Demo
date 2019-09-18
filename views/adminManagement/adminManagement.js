// @flow

import assert from 'assert';
import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flex-proto';
import { Page, Panel, Button } from 'react-blur-admin';
import {
  type GetAdminsParams,
  type GetAdminsState,
  type AddAdminParams,
  type AddAdminState,
  type EditAdminParams,
  type EditAdminState,
  type DeleteAdminParams,
  type DeleteAdminState,
  type DeleteAdminHashState,
  type Admin,

  deleteAdminHash
} from '../../redux/modules/adminManagement';
import {
  TableComponent,
  PromiseComponent,
  ConfirmModalComponent
} from '../../components';
import AddAdmin from './addAdmin';
import EditAdminModal from './editAdminModal';
import { validateEmail, validatePassword } from '../../services/validate';
import * as toastr from 'toastr';

type Props = {
  admins: Admin[],

  addAdminResult: AddAdminState,
  editAdminResult: EditAdminState,
  getAdminsResult: GetAdminsState,
  deleteAdminResults: DeleteAdminHashState,
  actions: {
    enterAdminManagement(): void,
    leaveAdminManagement(): void,

    addAdminIfNeeded(params: AddAdminParams): void,
    editAdminIfNeeded(params: EditAdminParams): void,
    getAdminsIfNeeded(params: GetAdminsParams): void,
    deleteAdminIfNeeded(params: DeleteAdminParams): void
  }
};

type State = {|
  searchQuery: string,
  pageNum: number,
  pageCount: number,
  adminToEdit: Admin | null
|};

export default class AdminManagement extends PureComponent<Props, State> {
  static propTypes = {
    admins: PropTypes.array.isRequired,
    addAdminResult: PropTypes.shape({
      isFetching: PropTypes.bool,
      time: PropTypes.string,
      payload: PropTypes.shape({}),
      error: PropTypes.string
    }).isRequired,
    editAdminResult: PropTypes.shape({
      isFetching: PropTypes.bool,
      time: PropTypes.string,
      payload: PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string
      }),
      error: PropTypes.string
    }).isRequired,
    getAdminsResult: PropTypes.shape({
      isFetching: PropTypes.bool,
      time: PropTypes.string,
      payload: PropTypes.shape({
        admins: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string,
          email: PropTypes.string
        })),
        pageNum: PropTypes.number,
        pageCount: PropTypes.number
      }),
      error: PropTypes.string
    }).isRequired,
    deleteAdminResults: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      enterAdminManagement: PropTypes.func.isRequired,
      leaveAdminManagement: PropTypes.func.isRequired,

      addAdminIfNeeded: PropTypes.func.isRequired,
      editAdminIfNeeded: PropTypes.func.isRequired,
      getAdminsIfNeeded: PropTypes.func.isRequired,
      deleteAdminIfNeeded: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
  }

  state: State = {
    searchQuery: '',
    pageNum: 0,
    pageCount: 1,
    adminToEdit: null
  }

  confirmModal: PromiseComponent | null = null

  // Protects unnecessary rerenders when state hasn't changed.
  // It probably isn't necessary in the PureComponent.
  safeSetState(partialState: $Shape<State>, callback?: () => mixed) {
    for (let propname in partialState) {
      if (this.state[propname] !== partialState[propname]) {
        this.setState(partialState, callback);
        break;
      }
    }
  }

  // lifecycle hooks
  componentWillMount() {
    const { actions: { enterAdminManagement } } = this.props;
    enterAdminManagement();

    this.getAdmins();
  }

  componentWillUnmount() {
    const { actions: { leaveAdminManagement } } = this.props;
    leaveAdminManagement();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.editAdminResult.isFetching === true) {
      if (nextProps.editAdminResult.isFetching === false) {
        const payload = nextProps.editAdminResult.payload;
        if (payload) {
          const message = 'Admin successfully edited';
          toastr.success(message);
          this.closeEditAdminModal();
        }
      }
    }

    Object.keys(this.props.deleteAdminResults).map(hash => this.watchPropsForDeleteActionState(
      this.props.deleteAdminResults[hash],
      nextProps.deleteAdminResults[hash]
    ));

    const { payload, error } = nextProps.getAdminsResult;

    if (payload !== null) {
      this.safeSetState({
        pageNum: payload.pageNum,
        pageCount: payload.pageCount
      });
    } else if (error === null) {
      // no need to do anything until we get some kind of response
    } else {
      this.safeSetState({ pageNum: 0, pageCount: 1 });
    }
  }

  watchPropsForDeleteActionState(oldResult: DeleteAdminState, newResult: ?DeleteAdminState) {
    if (!newResult) {
      return;
    }
    if (!oldResult.isFetching) {
      return;
    }
    if (newResult.isFetching) {
      return;
    }
    if (!newResult.params) {
      // impossible situation but makes flow to shut up
      return;
    }
    // old was fetching, and new is not fetching - so we got a result
    const payload = newResult.payload;
    if (payload) {
      const message = `Admin ${newResult.params.id} successfully deleted`;
      toastr.success(message);
    }
  }

  // functions
  getAdmins = (pageNum: number = this.state.pageNum) => {
    const { getAdminsIfNeeded } = this.props.actions;
    getAdminsIfNeeded({
      searchQuery: this.state.searchQuery,
      pageNum: pageNum
    });
  }

  deleteAdmin = async (admin: Admin) => {
    const { deleteAdminIfNeeded } = this.props.actions;

    assert(this.confirmModal, 'confirmModal is falsy');
    // Flow can't understand that assert is null guard
    if (this.confirmModal) {
      try {
        await this.confirmModal.start({ content: `Are you sure you want to delete admin ${admin.email}?` });
      } catch (err) {
        if (!err) {
          // nothing wrong if user doesn't confirm, so trivial handler
          return;
        }
        throw err;
      }

      deleteAdminIfNeeded({
        id: admin.id
      });
    }
  }

  isDeletingAdmin = (admin: Admin) => {
    const { deleteAdminResults } = this.props;

    const params: DeleteAdminParams = { id: admin.id };
    const deleteState = deleteAdminResults[deleteAdminHash(params)];
    if (!deleteState) {
      return false;
    }
    return deleteState.isFetching;
  }

  validateEditAdminForm = (key: string, form: *) => {
    switch(key) {
    case 'email': return validateEmail(form[key]);
    case 'password': return validatePassword(form[key]);
    case 'hasPermissionKycRead': return true;
    case 'hasPermissionKycWrite': return true;
    case 'hasPermissionUserInfoRead': return true;
    case 'hasPermissionUserInfoWrite': return true;
    case 'hasPermissionWithdrawRead': return true;
    case 'hasPermissionWithdrawWrite': return true;
    case 'hasPermissionReferralWrite': return true;
    case 'hasPermissionKycReportRead': return true;
    case 'hasPermissionPepRead': return true;
    case 'hasPermissionAdminManagementRead': return true;
    case 'hasPermissionAdminManagementWrite': return true;
    default:
      // eslint-disable-next-line no-console
      console.error('unknown form field for validation', key);
      return true;
    }
  }

  closeEditAdminModal = () =>{
    this.safeSetState({
      adminToEdit: null
    });
  }

  // event handlers
  onChangeSearchQuery = (e: Event) => {
    const target = ((e.target: any): window.HTMLInputElement);
    this.safeSetState({ searchQuery: target.value });
  }

  onSubmitSearch = (e: Event) => {
    e.preventDefault();
    this.getAdmins();
  }

  onClickPrevPage = () => {
    this.setState((prevState) => ({
      pageNum: Math.max(prevState.pageNum - 1, 0)
    }), this.getAdmins);
  }

  onClickNextPage = () => {
    this.setState((prevState, /* props */) => ({
      pageNum: Math.min(prevState.pageNum + 1, prevState.pageCount - 1)
    }), this.getAdmins);
  }

  onClickPage = (pageNum: number) => {
    this.safeSetState({
      pageNum
    }, this.getAdmins);
  }

  onCloseEditAdmin = () => {
    this.closeEditAdminModal();
  }

  onOpenEditAdmin = (admin: Admin) => {
    this.safeSetState({
      adminToEdit: admin
    });
  }

  // render functions
  render() {
    const {
      searchQuery,
      pageNum,
      pageCount,
      adminToEdit
    } = this.state;
    const {
      admins,
      addAdminResult,
      editAdminResult,
      getAdminsResult,
      actions: {
        addAdminIfNeeded,
        editAdminIfNeeded
      }
    } = this.props;

    const propsAddAdmin = {
      addAdminResult,
      actions: {
        addAdminIfNeeded
      }
    };

    return (
      <Page title="Admin Management">
        { adminToEdit !== null &&
          <EditAdminModal
            onClose={this.onCloseEditAdmin}
            onEditAdmin={editAdminIfNeeded}
            isFetching={editAdminResult.isFetching}
            isOpen={true}
            admin={adminToEdit}
            validate={this.validateEditAdminForm}
          />
        }
        <PromiseComponent ref={ref => (this.confirmModal = ref)}>
          <ConfirmModalComponent />
        </PromiseComponent>

        <Panel>
          <Row>
            <Col>
              <AddAdmin {...propsAddAdmin} />
            </Col>
            <form onSubmit={this.onSubmitSearch}>
              <Row>
                <Col grow={false}>
                  <input
                    type="text"
                    className="form-control"
                    value={searchQuery}
                    onChange={this.onChangeSearchQuery}
                  />
                </Col>
                <Col grow={false}>
                  <Button type="success" title="Search" />
                </Col>
              </Row>
            </form>
          </Row>
          {this.renderRowPagination(pageNum, pageCount)}
          <Row>
            <Col>
              {this.renderAdmins(admins, getAdminsResult.isFetching)}
            </Col>
          </Row>
        </Panel>
      </Page>
    );
  }

  renderAdmins(admins: Admin[], isFetching: boolean) {
    if (isFetching) {
      return 'Fetching...';
    } else if (admins.length === 0) {
      return 'No admins found.';
    } else {
      const schema = {
        'email': {
          display: 'Email',
          render: (admin) => admin.email
        },
        'actions': {
          display: 'Actions',
          render: (admin) => (
            <div>
              <Button
                type="success"
                title="Edit"
                size="sm"
                onClick={() => this.onOpenEditAdmin(admin)}
              />
              <Button
                type="danger"
                size="sm"
                title={this.isDeletingAdmin(admin) ? 'Deleting...' : 'Delete'}
                disabled={this.isDeletingAdmin(admin)}
                onClick={() => this.deleteAdmin(admin)}
              />
            </div>
          )
        }
      };

      const adminData = admins.map(a => Object.keys(schema).map(k => schema[k].render(a)));
      const adminHeadData = Object.keys(schema).map(k => schema[k].display);

      return (
        <TableComponent
          headData={adminHeadData}
          data={adminData}
        />
      );
    }
  }

  renderRowPagination(pageNum: number, pageCount: number) {
    if (pageCount <= 1) {
      return null;
    } else {
      const pageButtons = [];
      pageButtons.push(
        <Button
          key="prevPage"
          type="primary"
          disabled={pageNum <= 0}
          isIconHidden={true}
          title="<"
          onClick={this.onClickPrevPage} />
      );
      for (let i = 1; i <= pageCount; i = i + 1) {
        pageButtons.push(
          <Button
            key={i}
            type={ i === pageNum + 1 ? 'success' : 'primary' }
            disabled={ i === pageNum + 1 }
            isIconHidden={true}
            title={i.toString()}
            onClick={() => this.onClickPage(i-1)} />
        );
      }
      pageButtons.push(
        <Button
          key="nextBtn"
          type="primary"
          disabled={pageNum >= pageCount - 1}
          isIconHidden={true}
          title=">"
          onClick={this.onClickNextPage} />
      );

      return (
        <Row>
          <Col>
            {pageButtons}
          </Col>
        </Row>
      );
    }
  }
}
