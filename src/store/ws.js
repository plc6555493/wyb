import Taro from '@tarojs/taro'
import { handleActions } from 'redux-actions'
import { API_WS, ebRequest, ebLogout } from '../utils'

let socketTaskId = null
let pingTimer = null
const initialState = {
  ws_state: 0, // 0没有连接， 1，正在连接，2是已连接 ,3 非系统主动关闭，即异常退出
  started: false
}

export default handleActions({

  WS_STATE_CHANGE (state, action) {
    return Object.assign({}, state, {
      ws_state: action.payload.ws_state
    })
  },

  WS_START () {
    return {
      ws_state: 2
    }
  },

  // 主动关闭
  WS_STOP_SYSTEM () {
    return {
      ws_state: 1
    }
  },

  // 异常关闭
  WS_STOP_EXCEPTION () {
    return {
      ws_state: 3
    }
  }

}, initialState)

export const startIM = () => (dispatch, getState) => {
  const { account } = getState()

  if (account.logged) {
    if (socketTaskId === null) {
      dispatch({
        type: 'WS_STATE_CHANGE',
        payload: {
          ws_state: 1
        }
      })

      Taro.connectSocket({
        url: API_WS,
        success: function (res) {
          // console.log('Socket:', ' connect success')
          socketTaskId = res.socketTaskId
          // console.log('Socket: socketTaskId ', socketTaskId)
        }
      })

      Taro.onSocketOpen(function (res) {
        console.log('Socket:', ' onSocketOpen success', res)

        dispatch({
          type: 'WS_START'
        })

        // ebSendSocketMessage(JSON.stringify({type: 'init'}))

        if (account.logged) {
          dispatch(ping())
        }
      })
    }

    Taro.onSocketMessage((event) => {
      const msg = JSON.parse(event.data)
      try {
        switch (msg.message_type) {
          case 'init':
            let options = { client_id: msg.client_id }
            ebRequest('socketBind', options, () => {
            })
            break

          case 'chatMessage':
            break

          case 'offline':// 退出
            break

          case 'online':// 上线
            break

          case 'pong':// 相应ping
            break

          case 'push':// 聊天内推送
            try {
              switch (msg.pushType) {
                case 'apply':
                  break
                case 'ping':// 心跳
                  break
                case 'agree':// 同意好友申请
                  break
                case 'refuse':// 拒绝好友申请
                  break
                default:
                  console.error('未知push类型[1]')
                  break
              }
            } catch (e) {
              console.error(e)
            }
            break

          case 'pushMessage':// 聊天外推送
            try {
              let { pushType, pushContent } = msg
              switch (pushType) {
                case 'pay_success':
                  break
                case 'logout_web':
                  break
                case 'logout_wx_min':
                  dispatch(handleLogoutWxMin(pushContent))
                  break
                case 'logout_app':
                  break
                case 'min_program':
                  // dispatch(pushMessage(msg, true));
                  break
                default:
                  console.error('未知push类型[2]')
                  break
              }
            } catch (e) {
              console.error(e)
            }
            break
          default:
            console.error('未知消息类型')
            break
        }
      } catch (s) {
        console.error(s)
      }
    })

    Taro.onSocketError = (e) => {
      // an error occurred
      console.error(e.message)
    }

    Taro.onSocketClose = (e) => {
      const { ws } = getState()
      // connection closed
      if (ws.ws_state === 3) {
        // 不是系统主动关闭的
        console.error(Date())
        console.error(e.code)
        dispatch(startIM())
      }
    }
  }
}

const stopIM = () => (dispatch, getState) => {
  const { ws } = getState()

  // connection closed
  if (ws.ws_state === 2) {
    Taro.closeSocket()
    dispatch({
      type: 'WS_STOP_SYSTEM'
    })
    console.log('WebSocket 关闭成功！')
    return true
  } else {
    console.log('WebSocket 已关闭！')
    return false
  }
}

/**
 * 下线通知
 * @param pushContent
 * @returns {Function}
 */
const handleLogoutWxMin = (pushContent) => (dispatch, getState) => {
  console.log('handleLogoutWxMin pushContent', pushContent)
  console.log('handleLogoutWxMin getState', getState())

  dispatch(stopIM())

  //
  // let {account} = getState()

  // if (pushContent.token != account.token) {
  //   let content = '您已在:' + pushContent.detail.address_login + ' 使用另一设备登录，本设备已自动下线。 ';
  //   ebShowModal({title: pushContent.detail.title, content: content, showCancel: false, confirmText: '我知道了'}, () => {
  //     logoutWxMin()
  //   })
  // }
}

export const logoutWxMin = () => {
  ebLogout()
}

export const stopImException = () => {
  console.log('stopImException')
}
/**
 * 客户端检测心跳
 * 两分钟 120000 发送1次心跳数据，告知服务器自己还在
 * @param id
 */
const ping = () => (dispatch, getState) => {
  const { ws } = getState()

  clearInterval(pingTimer)
  pingTimer = setInterval(() => {
    try {
      if (ws.ws_state === 2) {
        // ebSendSocketMessage(JSON.stringify({type: 'ping'}));
      } else {
        console.log(ws.ws_state)
        console.log('WebSocket 已关闭！重新连接')
        dispatch(startIM())
      }
    } catch (e) {
      console.error(e.stack || e)
    }
  }, 120000)
}

/**
 *  推送消息给其他用户，通过服务端
 * @param message_type
 * @param id
 * @param content 消息详情
 */
export const pushNotice = (type, id, pushType) => async (dispatch, getState) => {
  console.log('handleLogoutWxMin type, id, pushType', type, id, pushType)
  console.log('handleLogoutWxMin getState', getState())

  try {
    // ebSendSocketMessage(JSON.stringify({type, id, pushType})); // push a message
  } catch (e) {
    console.error(e.stack || e)
    // alert(e + 'pushNotice ')
  }
}
