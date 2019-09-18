import { actionTypes } from './kycActionTypes';

const initialState = {
  documentUploadingResult: null,
  documentUploading: false,
  documentUploadingError: null,

  documentDeletingResult: null,
  documentDeleting: false,
  documentDeletingError: null,

  formSubmitting: false,
  formResult: null,
  formError: null,
  currentTitle : '',
  status: 'none',
  notification:'',
  notificationDescription:'',
  notificationFor:'',
  notificationButton:'',

  IDstatus: '',
  POAstatus: '',
  IDurl: '',
  POAurl: '',
  comment: '',
  existingDataID: {},
  existingDataPOA: {},

  verificationChecking:false,
  verificationResult:null,
  verificationError:null,

  poaLoaded: false,

  getDocuments:false,
  getDocumentsResult:null,
  getDocumentsError:null
};

export default function kycReducer(state = initialState, action) {
  if (!action) {
    return state;
  }

  switch (action.type) {
  case actionTypes.UPLOAD_DOCUMENT: {
    return Object.assign({}, state, {
      documentUploading: true
    });
  }

  case actionTypes.UPLOAD_DOCUMENT_SUCCESS: {
    return Object.assign({}, state, {
      /* eslint-disable eqeqeq */
      // TODO: check if `==` is needed
      existingDataID: action.docType == 'ID' ? {
        firstName: action.data.extractedData.Forename,
        lastName: action.data.extractedData.Surname,
        DOB: action.data.extractedData.DOB,
        nationality: action.data.extractedData.Nationality,
        gender: action.data.extractedData.Gender
      } : state.existingDataID,
      documentUploading: false,
      documentUploadingError: null,
      poaLoaded: state.poaLoaded || action.docType == 'POA'
      /* eslint-enable eqeqeq */
    });
  }

  case actionTypes.UPLOAD_DOCUMENT_ERROR: {
    return Object.assign({}, state, {
      supportedCurrenciesLoading: false,
      documentUploading: false,
      documentUploadingError: action.errorMsg
    });
  }

  case actionTypes.UPLOAD_DOCUMENT_CLEAR_ERROR: {
    return Object.assign({}, state, {
      documentUploading: false,
      documentUploadingError: null
    });
  }

  case actionTypes.DELETE_DOCUMENT: {
    return Object.assign({}, state, {
      documentDeleting: true
    });
  }

  case actionTypes.DELETE_DOCUMENT_SUCCESS: {
    return Object.assign({}, state, {
      documentDeletingResult: action.data,
      documentDeleting: false,
      documentDeletingError: null
    });
  }

  case actionTypes.DELETE_DOCUMENT_ERROR: {
    return Object.assign({}, state, {
      documentDeleting: false,
      documentDeletingError: action.errorMsg
    });
  }

  case actionTypes.GET_KYC_TITLE: {
    return Object.assign({}, state, {
      currentTitle: action.name
    });
  }

  case actionTypes.SEND_KYC_DATA: {
    return Object.assign({}, state, {
      formSubmitting: true
    });
  }

  case actionTypes.SEND_KYC_DATA_SUCCESS: {
    return Object.assign({}, state, {
      status: 'pending',
      formSubmitting: false,
      formError: null
    });
  }

  case actionTypes.SEND_KYC_DATA_ERROR: {
    return Object.assign({}, state, {
      formError: action.errorMsg
    });
  }

  case actionTypes.CHANGE_KYC_NOTIFICATION: {
    return Object.assign({}, state, {
      status:action.notification.status,
      notification:action.notification.message,
      notificationDescription:action.notification.description,
      notificationFor:action.notification.for,
      notificationButton: action.notification.button
    });
  }

  case actionTypes.VERIFICATION_CHECKING: {
    return Object.assign({}, state, {
      verificationChecking: true
    });
  }

  case actionTypes.VERIFICATION_CHECKING_SUCCESS: {
    if (action.data &&
                action.data.ID && action.data.ID.outcome &&
                action.data.POA && action.data.POA.outcome) {
      let status;
      if (action.data.ID.outcome === 'OK' && action.data.POA.outcome === 'OK') {
        status = 'success';
      } else if (action.data.ID.outcome === 'PENDING' && action.data.POA.outcome === 'PENDING') {
        status = 'pending';
      } else {
        status = 'failure';
      }

      return Object.assign({}, state, {
        verificationChecking: false,
        status,
        poaLoaded: true,
        IDstatus: action.data.ID.outcome,
        POAstatus: action.data.POA.outcome,
        existingDataID: action.data.ID.providedData,
        existingDataPOA: action.data.POA.providedData,
        IDurl: action.data.ID.url,
        POAurl: action.data.POA.url,
        comment: action.data.comment,
        verificationError: null
      });
    }

    return Object.assign({}, state, {
      verificationChecking: false,
      poaLoaded: false,
      status: 'none',
      verificationError: null
    });
  }

  case actionTypes.VERIFICATION_CHECKING_ERROR: {
    return Object.assign({}, state, {
      verificationChecking: false,
      verificationResult:null,
      verificationError:action.errorMsg
    });
  }

  case actionTypes.GET_DOCUMENTS: {
    return Object.assign({}, state, {
      getDocuments: true
    });
  }

  case actionTypes.GET_DOCUMENTS_SUCCESS: {
    return Object.assign({}, state, {
      getDocuments: false,
      getDocumentsResult:action.data,
      getDocumentsError:null
    });
  }

  case actionTypes.GET_DOCUMENTS_ERROR: {
    return Object.assign({}, state, {
      getDocuments: false,
      getDocumentsResult:null,
      getDocumentsError:action.errorMsg
    });
  }

  default: {
    return state;
  }
  }
}
