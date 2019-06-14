import {createStore, applyMiddleware, combineReducers, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import reduxReset from 'redux-reset'
import {ENV} from '../utils';

import init from './init'
import global from './global'
import account from './account'
import ws from './ws'

if (process.env.TARO_ENV !== 'alipay') {
	require('@tarojs/async-await')
}

const rootReducer = combineReducers({
	init,
	global,
	account,
	ws,
});


const configure = function (initialState) {

	const composeEnhancers = ENV === 'WEAPP' ? compose : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const enHanceCreateStore = composeEnhancers(
		applyMiddleware(
			thunkMiddleware,//Redux 处理异步  允许 dispatch() 函数
			// createLogger()
		),
		reduxReset(),  // Will use 'RESET' as default action.type to trigger reset
	)(createStore)

	const store = enHanceCreateStore(rootReducer, initialState)

	return store
};

export default configure
