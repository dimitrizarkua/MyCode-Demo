// @flow weak

import moment from 'moment';

const ENTER_LOGIN_VIEW  = 'ENTER_LOGIN_VIEW';
const LEAVE_LOGIN_VIEW  = 'LEAVE_LOGIN_VIEW';

const ENTER_HOME_VIEW  = 'ENTER_HOME_VIEW';
const LEAVE_HOME_VIEW  = 'LEAVE_HOME_VIEW';
const ENTER_COMMAND_PANEL_VIEW = 'ENTER_COMMAND_PANEL_VIEW';
const LEAVE_COMMAND_PANEL_VIEW = 'LEAVE_COMMAND_PANEL_VIEW';
const ENTER_AMBASSADOR_VIEW = 'ENTER_AMBASSADOR_VIEW';
const LEAVE_AMBASSADOR_VIEW = 'LEAVE_AMBASSADOR_VIEW';
const ENTER_ADMIN_MANAGEMENT_VIEW = 'ENTER_ADMIN_MANAGEMENT_VIEW';
const LEAVE_ADMIN_MANAGEMENT_VIEW = 'LEAVE_ADMIN_MANAGEMENT_VIEW';
const ENTER_CALCULATOR_PANEL_VIEW = 'ENTER_CALCULATOR_PANEL_VIEW';
const LEAVE_CALCULATOR_PANEL_VIEW = 'LEAVE_CALCULATOR_PANEL_VIEW';
const ENTER_KYC_VIEW = 'ENTER_KYC_VIEW';
const LEAVE_KYC_VIEW = 'LEAVE_KYC_VIEW';
const ENTER_KYC_REPORTS_VIEW = 'ENTER_KYC_REPORTS_VIEW';
const LEAVE_KYC_REPORTS_VIEW = 'LEAVE_KYC_REPORTS_VIEW';
const ENTER_PEP_CHECK_VIEW = 'ENTER_PEP_CHECK_VIEW';
const LEAVE_PEP_CHECK_VIEW = 'LEAVE_PEP_CHECK_VIEW';

const initialState = {
  currentView:  'Dashboard',
  enterTime:    null,
  leaveTime:    null
};

export default function views(state = initialState, action) {
  switch (action.type) {
  case ENTER_HOME_VIEW:
  case ENTER_COMMAND_PANEL_VIEW:
  case ENTER_AMBASSADOR_VIEW:
  case ENTER_ADMIN_MANAGEMENT_VIEW:
  case ENTER_CALCULATOR_PANEL_VIEW:
  case ENTER_KYC_VIEW:
  case ENTER_KYC_REPORTS_VIEW:
  case ENTER_PEP_CHECK_VIEW:
  case ENTER_LOGIN_VIEW:
    // can't enter if you are already inside
    if (state.currentView !== action.currentView) {
      return {
        ...state,
        currentView:  action.currentView,
        enterTime:    action.enterTime,
        leaveTime:    action.leaveTime
      };
    }
    return state;

  case LEAVE_HOME_VIEW:
  case LEAVE_LOGIN_VIEW:
  case LEAVE_COMMAND_PANEL_VIEW:
  case LEAVE_AMBASSADOR_VIEW:
  case LEAVE_ADMIN_MANAGEMENT_VIEW:
  case LEAVE_CALCULATOR_PANEL_VIEW:
  case LEAVE_KYC_VIEW:
  case LEAVE_KYC_REPORTS_VIEW:
  case LEAVE_PEP_CHECK_VIEW:
    // can't leave if you aren't already inside
    if (state.currentView === action.currentView) {
      return {
        ...state,
        currentView:  action.currentView,
        enterTime:    action.enterTime,
        leaveTime:    action.leaveTime
      };
    }
    return state;

  default:
    return state;
  }
}


export function enterHome(time = moment().format()) {
  return {
    type:         ENTER_HOME_VIEW,
    currentView:  'Dashboard',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leaveHome(time = moment().format()) {
  return {
    type:         LEAVE_HOME_VIEW,
    currentView:  'Dashboard',
    enterTime:    null,
    leaveTime:    time
  };
}

export function enterCommandPanel(time = moment().format()) {
  return {
    type:         ENTER_COMMAND_PANEL_VIEW,
    currentView:  'Command Panel',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leaveCommandPanel(time = moment().format()) {
  return {
    type:         LEAVE_COMMAND_PANEL_VIEW,
    currentView:  'Command Panel',
    enterTime:    null,
    leaveTime:    time
  };
}

export function enterAmbassador(time = moment().format()) {
  return {
    type:         ENTER_AMBASSADOR_VIEW,
    currentView:  'Ambassador',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leaveAmbassador(time = moment().format()) {
  return {
    type:         LEAVE_AMBASSADOR_VIEW,
    currentView:  'Ambassador',
    enterTime:    null,
    leaveTime:    time
  };
}

export function enterAdminManagement(time = moment().format()) {
  return {
    type:         ENTER_ADMIN_MANAGEMENT_VIEW,
    currentView:  'Admin Management',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leaveAdminManagement(time = moment().format()) {
  return {
    type:         LEAVE_ADMIN_MANAGEMENT_VIEW,
    currentView:  'Admin Management',
    enterTime:    null,
    leaveTime:    time
  };
}

export function enterCalculatorPanel(time = moment().format()) {
  return {
    type:         ENTER_CALCULATOR_PANEL_VIEW,
    currentView:  'Currency Calculator',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leaveCalculatorPanel(time = moment().format()) {
  return {
    type:         LEAVE_CALCULATOR_PANEL_VIEW,
    currentView:  'Currency Calculator',
    enterTime:    null,
    leaveTime:    time
  };
}

export function enterKyc(time = moment().format()) {
  return {
    type:         ENTER_KYC_VIEW,
    currentView:  'Kyc',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leaveKyc(time = moment().format()) {
  return {
    type:         LEAVE_KYC_VIEW,
    currentView:  'Kyc',
    enterTime:    null,
    leaveTime:    time
  };
}

export function enterKycReports(time = moment().format()) {
  return {
    type:         ENTER_KYC_REPORTS_VIEW,
    currentView:  'Kyc Reports',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leaveKycReports(time = moment().format()) {
  return {
    type:         LEAVE_KYC_REPORTS_VIEW,
    currentView:  'Kyc Reports',
    enterTime:    null,
    leaveTime:    time
  };
}

export function enterPepCheck(time = moment().format()) {
  return {
    type:         ENTER_PEP_CHECK_VIEW,
    currentView:  'PEP Check',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leavePepCheck(time = moment().format()) {
  return {
    type:         LEAVE_PEP_CHECK_VIEW,
    currentView:  'PEP Check',
    enterTime:    null,
    leaveTime:    time
  };
}

export function enterLogin(time = moment().format()) {
  return {
    type:         ENTER_LOGIN_VIEW,
    currentView:  'Login',
    enterTime:    time,
    leaveTime:    null
  };
}

export function leaveLogin(time = moment().format()) {
  return {
    type:         LEAVE_LOGIN_VIEW,
    currentView:  'Login',
    enterTime:    null,
    leaveTime:    time
  };
}
