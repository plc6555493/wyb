import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import './index.scss'
import {AtDrawer, AtButton, AtAvatar, AtSwipeAction, AtListItem} from 'taro-ui'
import {ebSetTitleAndReturnState, ebRequest, API_V1, ebNavigateTo, ebScanCode} from "../../utils"
import codPng from '../../asset/image/code.png'
import PrintAss from '../../components/homePage'
import UserLogin from '../../components/userlogin'
import {initAppUpdate} from "../../store/init";
import {globalShowAuthUpdate} from "../../store/global";
import {authorizedUpdate} from "../../store/account";
import ShowMore from "../../components/showMore";


let self

@connect(
	(store) => ({
		scene: store.global.scene,
		authState: store.account.authorized,
	}),
	(dispatch) => bindActionCreators({initAppUpdate, globalShowAuthUpdate, authorizedUpdate}, dispatch)
)
export default class Index extends Component {
	constructor(props) {
		super(props);
		self = this
		self.state = {
			leftDrawerShow: false,
			printEntrance: [],
			version: "V1.0.1"
		}
	}


	//页面跳转
	request1() {
		Taro.navigateTo({url: '/pages/adv5/index'});
	}

	componentDidMount() {
		ebSetTitleAndReturnState(self);

		let data = {};
		let option = {data, method: 'get'}

		// 发送请求
		ebRequest('/wxmin/' + API_V1 + 'index', option, function (res) {
			if (res.status) {
				let {index} = res.data
				let conf = index
				let {banner, entryAdv, entryPrint} = index.images
				self.setState({printEntrance: entryPrint, bannerList: banner, entryAdv, conf: conf, dataList: res.data})
			}
		})


	}

	componentWillReceiveProps(nextProps, nextContext) {
		console.log('index componentWillReceiveProps:', nextProps, nextContext)
	}

	code() {
		// 扫码方法
		ebScanCode((res) => {
			let codeData = res.result
			let data = {machine_code: codeData};
			let option = {data, token: true}
			// 在中控打印回调函数的参数
			ebRequest('/wxmin/' + API_V1 + 'order/', option, function (res) {
				if (res.status) {
					ebNavigateTo('/model/printModel/printScan/scan?machine_code=' + codeData);
				}
				else {
					console.log('失败')
				}
			})
		})
	}

	leftDrawerClick() {
		let {authState, leftDrawerShow} = self.state

		self.setState({
			leftDrawerShow: authState && !leftDrawerShow,
		})

		!authState && this.props.globalShowAuthUpdate(true)
	}


	onItemClick(index) {
		const ENV = Taro.getEnv()
		let content
		if (index == 0) {
			Taro.navigateTo({
				url: '/pages/model/printModel/historyOrder/historyOrder'
			})
		}
		if (index == 1) {
			content = ''
			Taro.navigateTo({
				url: '/pages/model/advModel/advManage/index?tabbar=' + '1'
			})
		}
		if (ENV !== 'WEB') content && Taro.showModal({content, showCancel: false})
		else content && alert(content)

	}

	onClose() {
		this.setState({
			leftDrawerShow: false,
			rightDrawerShow: false,
			childrenDrawerShow: false,
		})

	}

	//用户点击右上角转发
	onShareAppMessage = () => {
		//console.log('小程序专有 用户点击右上角转发')
	}

	//页面上拉触底事件的处理函数
	onReachBottom = () => {
	}


	handleOpened = () => {
		this.onClose()
	}

	handleClosed = () => {
	}

	showToast = name => {
		Taro.showToast({
			icon: 'none',
			title: name
		})
	}

	sel() {
		ebNavigateTo('/model/advModel/advSelectList/index');
	}


	render() {
		let {printEntrance, loginState, bannerList, entryAdv, conf, leftDrawerShow, version, dataList} = self.state
		let {authState, scene} = self.props
		let animShow = true
		let styleVersion = {
			textAlign: 'center',
			width: '100%',
			display: 'block',
			position: 'fixed',
			bottom: 0,
			height: '30px',
			zIndex: 999,
			fontSize: '10px',
			color: 'gray',
			opacity: animShow ? 1 : 0,
		}

		let items = ['我的订单'];

		conf && conf['config']['showEntryAdv'] && items.push('我的广告')

		return (
			<View className="index">
				<View className='head'>
					<AtButton className='dra' onClick={this.leftDrawerClick.bind(this)}>
						<AtAvatar className='use' openData={{type: 'userAvatarUrl'}}/>
					</AtButton>
					{/* 左边弹出抽屉 */}

					<AtDrawer
						show={leftDrawerShow}
						left
						mask
						onClose={this.onClose.bind(this)}
						width='250px'
					>
						<View>

							{
								items.length ? <AtList>
									{
										items.map((name, index) =>
											<AtListItem
												key={index}
												data-index={index}
												onClick={this.onItemClick.bind(this, index)}
												title={name}
												arrow='right'
											>
											</AtListItem>)
									}
								</AtList> : null
							}

							<AtSwipeAction
								onOpened={this.handleOpened}
								onClosed={this.handleClosed}
							>
								<View style={{height: '400px'}}></View>
							</AtSwipeAction>

							{
								leftDrawerShow ? <View style={styleVersion}>
									{
										"© Jiansu Quyin All Rights Reserved " + version
									}
								</View> : null
							}

						</View>
					</AtDrawer>

					<Image className='code' onClick={this.code} src={codPng}/>
				</View>

				<View className='neck'>
					<Swiper
						className='test-h'
						indicatorColor='#999999'
						indicatorActiveColor='#CCCCCC'
						circular
						indicatorDots
						displayMultipleItems
						autoplay>
						{
							bannerList && bannerList.map((src, k) => {
								return (
									<SwiperItem key={k}>
										<Image className='demo-text-1' src={src} mode='widthFix' style={{borderRadius: '24rpx', overFlow: "hidden"}}/>
									</SwiperItem>
								)
							})
						}
					</Swiper>
				</View>

				<PrintAss printEntranceAss={printEntrance} dataList={dataList}/>
				{
					conf['config']['showMorePrint'] &&
					<ShowMore/>
				}


				{/* 进入广告页面的跳转入口 */}
				{
					conf['config']['showEntryAdv'] &&
					<View className='gg'>
						<Image className='demo-text-8' onClick={this.sel} src={entryAdv[0]}/>
					</View>
				}

				{
					authState ? null : <UserLogin authState={authState} sceneState={scene}/>
				}

			</View>

		)
	}
}
