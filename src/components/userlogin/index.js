import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { bindActionCreators } from 'redux'
import './index.scss'
import {
  API_V1,
  ebGetLocalStorage, ebRedirectTo,
  ebShowToast, ebGetUserInfo,
  ebSetLocalStorage, ebSetColorState, ebSetColorInit, ebRequest
} from '../../utils'

import { initAppUpdate } from '../../store/init'
import { authorizedUpdate } from '../../store/account'
import { globalShowAuthUpdate } from '../../store/global'

import Verification from '../../asset/image/verification.png'
import Phone from '../../asset/image/phone.png'
import Delete from '../../asset/image/delete.png'
import UserInfo from '../../components/userInfo'
import CopyRight from '../../components/copyRight'

let timer = null
let self = null

@connect(
  (store) => ({
    logged: store.account.logged,
    showAuth: store.global.showAuth,
    scene: store.global.scene
  }),
  (dispatch) => bindActionCreators({ initAppUpdate, authorizedUpdate, globalShowAuthUpdate }, dispatch)
)

class UserLogin extends Component {
  constructor (props) {
    super(props)
    self = this
    this.state = {
      mobile: '',
      code: '',
      countdown: 60,
      codeState: 0,
      disabled: true,
      hideModel: true,
      bgColor: '',
      fontColor: '',
      topInfo: { status: false, color: '#ffffff', bgcolor: '#ff0000' }
    }
  }

  componentWillMount () {
    let { bgColor, fontColor } = ebSetColorState(this, 8)
    console.log('usrLogin bgColor, fontColor', bgColor, fontColor)
  }

  /**
   * 1047    扫描小程序码
     1048    长按图片识别小程序码
     1049    手机相册选取小程序码
   * @param nextProps
   */
  componentWillReceiveProps (nextProps) {
    console.log('userLogin componentWillReceiveProps:', nextProps)
    self.setState({
      hideModel: !nextProps.showAuth && nextProps.scene !== '1047' && nextProps.scene !== '1048' && nextProps.scene !== '1049'
    })
  }

  getPhone (e) {
    console.log(e)
    if (e.currentTarget.encryptedData) {
      let sessionKey = ebGetLocalStorage('EB_SESSIONKEY')
      let openid = ebGetLocalStorage('EB_OPENID')
      let data = e.detail
      data['sessionKey'] = sessionKey
      data['openid'] = openid

      let option = { data, method: 'POST' }

      ebRequest('/wxmin/' + API_V1 + 'User/wxBindPhone', option, function (res) {
        ebShowToast(res.msg)
        if (res.status) {
          let token = res.data.token
          ebSetLocalStorage('EB_TOKEN', token)
          self.props.authorizedUpdate(true)
        }
      })
    }
  }

  getBindCode () {
    let { mobile } = this.state

    let vm = this.verifyMobile()
    if (vm) {
      let token = ebGetLocalStorage('EB_TOKEN')
      if (!token) {
        let data = []
        data['phoneNumber'] = mobile
        ebRequest('getBindCode', data, function (res) {
          self.verifyCodeUpdate()
          if (res.status) {
            self.setState({ disabled: false })
            ebShowToast(res.msg)
          }
        }, 2)
      } else {
        console.log('已登录，不需要授权绑定手机号')
      }
    }
  }

  bindPhone (phoneNumber, code = '') {
    let token = ebGetLocalStorage('EB_TOKEN')
    if (!token) {
      let data = []
      data['openid'] = ebGetLocalStorage('EB_OPENID')
      data['phoneNumber'] = phoneNumber
      data['code'] = code
      ebRequest('authBindPhone', data, function (res) {
        ebShowToast(res.msg)
        if (res.status) {
          self.handleRedirect(res)
        }
      }, 2)
    }
  }

  handleRedirect (res, callback = () => { }) {
    ebSetLocalStorage('EB_TOKEN', res['data']['token'])
    setTimeout(function () {
      let currentPages = Taro.getCurrentPages()

      let url = currentPages[currentPages.length - 1].route
      let options = currentPages[currentPages.length - 1].options
      for (var i in options) {
        if (url.indexOf('?') !== -1) {
          url += '&' + i + '=' + options[i]
        } else {
          url += '?' + i + '=' + options[i]
        }
      }
      ebGetUserInfo(self, { from: 'handleRedirect' }, callback)

      ebRedirectTo('/' + url)
    }, 1000)
  }

  verifyCodeUpdate = () => {
    timer = setInterval(() => {
      const { countdown } = this.state
      const nextCountdown = countdown - 1
      if (nextCountdown === 0) {
        clearInterval(timer)
        this.setState({
          codeState: 0,
          countdown: 60
        })
      } else {
        this.setState({
          countdown: nextCountdown,
          codeState: 2
        })
      }
    }, 1000)
  }

  handleHideModel () {
    let { hideModel } = self.state

    self.setState({
      hideModel: !hideModel
    })

    this.props.globalShowAuthUpdate(false)
  }

  // 监听输入框
  handleMobile (that) {
    const mobile = that.target.value
    this.setState({
      mobile: mobile
    })
  };

  // 监听输入框
  handleCode (that) {
    const code = that.target.value
    this.setState({
      code: code
    })
  };

  handleOnFocus (e) {
    // 验证码输入框 点击 先校验手机号
    if (e.target.id === 'code') {
      this.verifyMobile()
    }
  }

  // 统一验证手机号
  verifyMobile () {
    let { mobile } = this.state
    let mobileLength = mobile.length

    if (mobile === '') {
      ebShowToast('手机号不能为空')
      return false
    } else if (mobileLength !== 11) {
      ebShowToast('手机号必须为11位')
      return false
    }

    return true
  }

  verifyCode () {
    let { code } = this.state
    let codeLength = code.length

    if (code === '') {
      ebShowToast('验证码不能为空')
      return false
    } else if (codeLength !== 6) {
      ebShowToast('验证码必须为6位')
      return false
    }

    return true
  }

  /**
   * 短信验证码登录
   */
  handleVerifySms () {
    let { mobile, code } = self.state
    let vm = self.verifyMobile()
    let vc = self.verifyCode()
    if (vm && vc) {
      self.bindPhone(mobile, code)
    }
  }

  // 删除
  onClearClick () {
    this.setState({ mobile: '' })
  }

  render () {
    let { mobile, code, codeState, countdown, disabled, bgColor, topInfo, hideModel } = this.state
    let { authState, sceneState, showAuth } = this.props

    let showManBind = false

    // 解决 h5 web 编译后  placeholder 被 encode
    let placeholderPhone = '请输入手机号码'

    let title = showManBind ? '请授权本人手机号' : '请授权微信绑定的手机号'

    let { style, color } = ebSetColorInit(topInfo, 1)

    console.log('bgColor,title', bgColor, title)

    let em = ((sceneState !== '1001' || hideModel) && !showAuth) || authState

    return (
      em ? null : showManBind ? <View className='body'>

        <UserInfo />

        <View className='panel'>
          <View className='panel__content'>
            <View className='form'>
              <View className='view-main'>

                <View className='entrance'>
                  <Image className='bussiness' src={Phone} />
                </View>
                <View className='entrance-input'>
                  <Input
                    type='text'
                    placeholder={placeholderPhone}
                    value={mobile}
                    onInput={self.handleMobile.bind(this)}
                    maxlength='11' style={{ color: color, background: bgColor }} />
                </View>
                {
                  mobile ? <View className='entrance-clear'><Image src={Delete} className='bussiness' onClick={self.onClearClick.bind(this)} /></View> : null
                }
              </View>
              <View className='view-main'>
                <View className='pull_left'>
                  <View className='entrance'><Image className='bussiness' src={Verification} /></View>
                  <View className='entrance-input-code'>
                    <Input id='code'
                      disabled={disabled}
                      value={code}
                      type='text'
                      placeholder={disabled ? '请先点击获取验证码' : '请输入短信验证码'}
                      handleOnFocus={self.handleOnFocus.bind(this)}
                      onInput={self.handleCode.bind(this)}
                      className={disabled ? 'disabled_input' : ''}
                      maxlength='6' style={{ color: color, background: bgColor }} />

                  </View>
                </View>

                <View className='view-code pull_right'>
                  {codeState === 2 ? <Text className='show'>{countdown}秒后重新获取</Text> : <View><Button className='show' onClick={self.getBindCode.bind(this)} style={style}>获取验证码</Button></View>}
                </View>

              </View>
              <View className='clear' />
              <View className='view-btn-bind'>
                <Button className='at-button--primary' onClick={this.handleVerifySms} style={style}>绑定</Button>
              </View>
            </View>
            <View className='person-careful'>提示：当前用户未授权手机号，为了更好的体验，请输入手机号，</View>
            <View className='person-careful'>并点击获取验证码，收到验证码后及时输入验证码，并点击绑定</View>
          </View>
          <CopyRight />
        </View>
      </View> : <View className='user_getphone'>
        <View className='user_getphone_mask' />
        <View className='user_getphone_view'>
          <View className='user_getphone_view_title' style={{ color: color, background: bgColor }}>
            快速登录
          </View>
          <View className='user_getphone_view_desc'>
            使用微信登录，获取您的信息！
          </View>
          <View style='width:100%'>
            <Button openType='getPhoneNumber' onGetPhoneNumber={this.getPhone} className='user_getphone_view_button pull-left' style={{ color: color, background: bgColor }}>登录</Button>
            <Button onClick={this.handleHideModel} className='user_getphone_view_button pull-right'>取消</Button>
          </View>
        </View>
      </View>
    )
  }
}

export default UserLogin
