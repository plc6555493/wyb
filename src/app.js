import Taro, { Component } from '@tarojs/taro'
import 'taro-ui/dist/style/index.scss'
import { Provider, connect } from '@tarojs/redux'
import '@tarojs/async-await'
import configStore from './store'
import { bindActionCreators } from 'redux'
import Index from './pages/index/index'
import 'moment/locale/zh-cn'
import { authorizedUpdate } from './store/account'
import { initAppUpdate } from './store/init'
import { globalChangeImageSrcUpdate, globalSceneUpdate, globalShowAuthUpdate } from './store/global'

import './app.scss'
import {
  ENV,
  ebGetRouterParams,
  ebShowShareMenu,
  // ebGetSystemInfo,
  ebGetUpdateManager,
  ebGetAuthState, SystemInfoUtil
} from './utils'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

@connect(
  (store) => ({
    srcImagePreview: store.global.srcImagePreview
  }),
  (dispatch) => bindActionCreators({ initAppUpdate, globalSceneUpdate, authorizedUpdate, globalShowAuthUpdate, globalChangeImageSrcUpdate }, dispatch)
)
class App extends Component {
  constructor (props) {
    super(props)
  }

  config = {
    pages: [
      'pages/index/index',
      'pages/model/advModel/advManage/index',
      'pages/model/advModel/advUploadSuccess/index',
      'pages/model/advModel/advSelectMap/index',
      'pages/model/advModel/advSelectConfirm/index',
      'pages/model/advModel/advSelectList/index',
      'pages/model/advModel/advConfireChoose/index',
      'pages/model/advModel/advPaySuccess/index',
      'pages/model/advModel/advSubmit/index',

      'pages/model/printModel/payFinish/payFinish',
      'pages/model/printModel/printOrderCreate/index',
      'pages/model/printModel/historyOrder/historyOrder',
      'pages/model/printModel/scanSuccess/scanSuccess',
      'pages/model/printModel/printScan/scan',
      'pages/model/printModel/printPhoto/index',
      'pages/model/printModel/printDocument/index',
      'pages/model/printModel/local/index',
      'pages/com/webView/index',
      'pages/model/printModel/imageCropper/cropper/cropper',
      'pages/model/printModel/issues/issues',
      'pages/model/printModel/issuesSubmitSuccess/issuesSubmitSuccess'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: 'white',
      navigationBarTextStyle: 'black'

    },
    navigateToMiniProgramAppIdList: [],
    permission: {
      'scope.userLocation': {
        'desc': '获取您与打印设备之间的距离'
      }
    }
  };

  globalData = {
    imgSrc: ''
  }

  componentDidMount = (options) => {
    // 获得地址栏参数
    let params = ebGetRouterParams(this)
    console.log('获得地址栏参数:', params)

    if (ENV === 'WEAPP') {
      SystemInfoUtil.init()
      ebShowShareMenu()
      // ebGetSystemInfo()
      ebGetUpdateManager()
      if (JSON.stringify(params) !== '{}') {
        let scene = params.scene ? decodeURIComponent(params.scene) : null

        this.props.globalSceneUpdate(scene)
        let authorized = ebGetAuthState()
        this.props.authorizedUpdate(authorized)

        // 1047扫描小程序码
        // 1048长按图片识别小程序码
        // 1049手机相册选取小程序码
        switch (scene) {
          case '1047':
          case '1048':
          case '1049':
            console.log('扫码进入小程序/长按图片识别小程序码/手机相册选取小程序码')
            this.props.globalShowAuthUpdate(!authorized)
            break
        }
      }
    }
  };

  componentDidCatchError (err) {
    console.info('componentDidCatchError Detail', err)
  }

  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
