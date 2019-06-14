import Taro, {Component} from '@tarojs/taro';
import 'taro-ui/dist/style/index.scss'
import {Provider, connect} from '@tarojs/redux';
import '@tarojs/async-await'
import configStore from "./store";
import {bindActionCreators} from 'redux'
import Index from './pages/index/index';
import 'moment/locale/zh-cn';
import {authorizedUpdate} from "./store/account";
import {initAppUpdate} from "./store/init";
import {globalSceneUpdate, globalShowAuthUpdate} from "./store/global";

import './app.scss';
import {
	ENV,
	ebGetRouterParams,
	ebSetLocalStorage,
	ebShowShareMenu,
	ebGetSystemInfo,
	ebSetNavigationBarColor, ebReLaunch,
	ebGetUpdateManager, ebGetLocalStorage,
	ebGetAuthState, SystemInfoUtil
} from "./utils";


// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

@connect(
	() => ({}),
	(dispatch) => bindActionCreators({initAppUpdate, globalSceneUpdate, authorizedUpdate, globalShowAuthUpdate}, dispatch)
)
class App extends Component {

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

			// "pages/test/index/index",
			// "pages/test/cropper/cropper"
		],
		window: {
			backgroundTextStyle: 'light',
			navigationBarBackgroundColor: 'white',
			navigationBarTextStyle: 'black',

		},
		navigateToMiniProgramAppIdList: [],
		permission: {
			"scope.userLocation": {
				"desc": "获取您与打印设备之间的距离"
			}
		}
	};

	globalData= {
		imgSrc:""
	}

	componentDidMount = (options) => {

		//获得地址栏参数
		let params = ebGetRouterParams(this);
		console.log('获得地址栏参数:', params)

		if (ENV == 'WEAPP') {
			SystemInfoUtil.init()
			ebShowShareMenu();
			ebGetSystemInfo()
			ebGetUpdateManager()
			if (JSON.stringify(params) !== "{}") {
				let scene = params.scene ? decodeURIComponent(params.scene) : null

				this.props.globalSceneUpdate(scene)
				let authorized = ebGetAuthState()
				this.props.authorizedUpdate(authorized)

				switch (scene) {
					case '1047':
						console.log('扫码进入小程序')
						// 扫码进入小程序

						this.props.globalShowAuthUpdate(!authorized)
						break;
				}

			}
		}

	};

	componentDidShow() {
	}

	componentDidHide = () => {
	}

	componentDidCatchError(err) {
		console.info('componentDidCatchError Detail', err)
	}

	// 请勿修改此函数
	render() {
		return (
			<Provider store={store}>
				<Index/>
			</Provider>
		)
	}
}

Taro.render(<App/>, document.getElementById('app'));
