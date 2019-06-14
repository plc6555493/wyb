import {handleActions} from 'redux-actions'
import {accountInit} from './account'

const initialState = {
};

export default handleActions({

}, initialState)

/**
 * 注意：accountInit(userInfo, 'init') init 区别于 login ，login 通过 授权，init,代表从本地 token 请求
 * ??? accountInit toggleOpenManage 调用者是否需要引入？？
 * 初步结论 被调者（即类似本文件的文件） 需要 import   accountInit toggleOpenManage
 */
const initAppUpdate = (result, that) => async () => {

	const {detail, userInfo} = result;

	// 更新用户账户信息
	that.props.dispatch(accountInit(userInfo, 'init'))

};

export {
	initAppUpdate,
}

