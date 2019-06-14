import {handleActions} from 'redux-actions'
import {API, ebGetLocalStorage, ebToAuthMobile} from '../utils'
import {pushPing, startIM} from '../store/ws'

const initialState = {
	logged: false,
	authorized: false,
	token: null,
	session_id: null,
	isUserinfoGotAtLeastOnce: false,
	userinfo: {},
};

export default handleActions({

	ACCOUNT_LOGIN(state, action) {
		return Object.assign({}, state, action.payload, {
			isUserinfoGotAtLeastOnce: true,
			logged: true,
			userinfo: action.payload.userinfo
		})
	},

	ACCOUNT_INIT(state, action) {
		return Object.assign({}, state, action.payload, {
			isUserinfoGotAtLeastOnce: true,
			logged: true,
			userinfo: action.payload.userinfo
		})
	},

	ACCOUNT_AUTH_UPDATE(state, action) {
		return Object.assign({}, state, action.payload, {
			authorized: action.payload.authorized
		})
	}

}, initialState)


/**
 * 账号登录统一处理
 */
const handleSuccess = (result, token, type = 'login') => async (dispatch, getState) => {

	let isUserinfoGotAtLeastOnce = result != undefined

	if (type == 'init') {
		type = 'ACCOUNT_INIT'
	} else if (type == 'login') {
		type = 'ACCOUNT_LOGIN'
	}

	dispatch({
		type: type,
		payload: {
			token,
			session_id: result.session_id,
			userinfo: result,
			isUserinfoGotAtLeastOnce,
		}
	})

	dispatch(startIM());

	//com e
};

/**
 * 账号初始化 检测是否已经登录
 */
export const accountInit = (result, type = 'login') => async (dispatch, getState) => {

	//console.log('accountInit:', result)

	if (result.hasOwnProperty('uid') > 0) {
		//已登录
		try {
			let token = ebGetLocalStorage('EB_TOKEN');
			return dispatch(handleSuccess(result, token, type))
		} catch (e) {
			console.error(e);
		}
	} else {
		//未登录
		console.log('未登录');
		ebToAuthMobile()
	}
};


/**
 * 账号初始化
 * only for development
 * @param username
 * @param password
 */
export const login = (username, password) => async (dispatch, getState) => {

	const {sdk} = getState();

	const platform = 'weapp'; //ios 、android、 chrome 、ie、 firefox and soon

	try {
		const result = await POSTUrlencodeJSON(`${API}/login`, {
			username,
			password,
			platform,
			origin: sdk.origin,
			//strict: '1',//开启后app退出登录
			// strict: '2',//开启后web退出登录

		});

		if (result.status == '-1' || result.status == '0') {
			return console.log(result.msg);
		} else {
			//登录逻辑
		}
	} catch (e) {
		console.error(e)
	}
};

/**
 * 退出登录
 *
 */
export const logout = () => async (dispatch, getState) => {
	try {
		const {token} = getState().account;

		//请求服务端 ，清空 token
		if (token != undefined) {
			const result = await POSTUrlencodeJSON(`${API}/logout`, {
				token,
			});
			console.log('请求服务端 ，清空 token', token, result);
		}

		dispatch(handleLogout());

	} catch (e) {
		console.log(e);
	}
};

export const handleLogout = () => async (dispatch, getState) => {
	//更新登录状态
	dispatch(storeReset());
}

/**
 * 清空 store 退出用户登录使用
 */
export const storeReset = () => async (dispatch, getState) => {
	dispatch({
		type: 'RESET',
	});
}


/**
 * 授权更新
 * @param scene
 * @returns {function(*, *)}
 */
export const authorizedUpdate = (authorized) => async (dispatch, getState) => {

	dispatch({
		type: 'ACCOUNT_AUTH_UPDATE',
		payload: {
			authorized:authorized
		}
	})

}
