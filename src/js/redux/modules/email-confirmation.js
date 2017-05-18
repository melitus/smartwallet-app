import Immutable from 'immutable'
import { makeActions } from './'

export const actions = module.exports = makeActions('email-confirmation', {
  confirm: {
    expectedParams: ['email', 'code'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        if (!params || !params.email || !params.code) {
          let action = {
            type: actions.confirm.id_fail
          }
          return dispatch(action)
        }
        dispatch(actions.confirm.buildAction(params, (backend) => {
          return services.auth.currentUser.wallet.finishConfirmEmail(params)
        }))
      }
    }
  }
})
const confirmSuccess = (state) => Immutable.fromJS(state).merge({
  success: true,
  loading: false
})
const confirmFail = (state) => Immutable.fromJS(state).merge({
  loading: false
})
const initialState = Immutable.fromJS({
  success: false,
  loading: true
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.confirm.id_success:
      return confirmSuccess(state)
    case actions.confirm.id_fail:
      return confirmFail(state)
    default:
      return state
  }
}
