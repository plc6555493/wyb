import {handleActions} from 'redux-actions'
import {accountInit} from './account'

const initialState = {
	scene: '',
	showAuth:false
};

export default handleActions({

	GLOBAL_UPDATE_SCENE(state, action) {
		return Object.assign({}, state, action.payload, {
			scene: action.payload.scene
		})
	},

	GLOBAL_UPDATE_SHOWAUTH(state, action) {
		return Object.assign({}, state, action.payload, {
			showAuth: action.payload.showAuth
		})
	},


}, initialState)

const globalSceneUpdate = (scene) => async (dispatch, getState) => {

	dispatch({
		type: 'GLOBAL_UPDATE_SCENE',
		payload: {
			scene
		}
	})

}

const globalShowAuthUpdate = (showAuth) => async (dispatch, getState) => {

	dispatch({
		type: 'GLOBAL_UPDATE_SHOWAUTH',
		payload: {
			showAuth
		}
	})

}


export {
	globalSceneUpdate,
	globalShowAuthUpdate,
}

