import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import './index.scss'
import {ebSetTitleAndReturnState, ebRequest, ebNavigateTo, ebGetRouterParams} from "../../../../utils"
import tabbar1_pic1 from '../../../../asset/image/tabbar1_pic1.png'
import tabbar1_pic2 from '../../../../asset/image/tabbar1_pic2.png'
import tabbar2_pic1 from '../../../../asset/image/tabbar2_pic1.png'
import tabbar2_pic2 from '../../../../asset/image/tabbar2_pic2.png'
import tabbar3_pic1 from '../../../../asset/image/tabbar3_pic1.png'
import tabbar3_pic2 from '../../../../asset/image/tabbar3_pic2.png'
import tabbar4_pic1 from '../../../../asset/image/tabbar4_pic1.png'
import tabbar4_pic2 from '../../../../asset/image/tabbar4_pic2.png'
import OrderList from '../../../../components/orderList'
import EmptyList from '../../../../components/emptyList/emptyList'
import {AtActivityIndicator} from 'taro-ui'

let self = null;

export default class Manage extends Component {
	constructor(props) {
		super(props);
		self = this;
		this.state = {
			loading: true,
			date: '',
			date1: '',
			tabBarColor1: "background-color: white",
			tabBarColor2: "",
			tabbar1Pic: tabbar1_pic1,
			tabbar2Pic: tabbar2_pic2,
			tabbar3Pic: tabbar3_pic2,
			tabbar4Pic: tabbar4_pic2,

			orderList: [],
			timeList: ['15', '30', '45', '60']
		}
	}

	//导航栏点击
	tabBar1() {
		let {orderList} = self.state;
		// self.state.emptyListDisplay=null;
		let thisList = 0;
		if (orderList == null) {
			self.state.emptyListDisplay = {display: 'block'};
			self.setState({
				emptyListDisplay: self.state.emptyListDisplay,
			})
		}
		else {
			for (let i = 0; i < orderList.length; i++) {
				if (orderList[i].order_state === '1') {
					orderList[i].order_display = {display: 'block'};
					thisList++;
					// console.log(thisList);
					if (thisList > 0) {
						console.log('1点击TB1不显示图片');
						self.state.emptyListDisplay = {display: 'none'};
						self.setState({
							emptyListDisplay: self.state.emptyListDisplay,
						})
					}
					else {
						console.log('2点击TB1显示图片');
						self.state.emptyListDisplay = {display: 'block'};
						self.setState({
							emptyListDisplay: self.state.emptyListDisplay,
						})
					}
				}
				else {
					orderList[i].order_display = {display: 'none'};
					// console.log(thisList);
					if (thisList > 0) {
						console.log('3点击TB1不显示图片');
						self.state.emptyListDisplay = {display: 'none'};
						self.setState({
							emptyListDisplay: self.state.emptyListDisplay,
						})
					}
					else {
						console.log('4点击TB1显示图片');
						self.state.emptyListDisplay = {display: 'block!important'};
						self.setState({
							emptyListDisplay: self.state.emptyListDisplay,
						})
					}
				}
			}
		}

		self.setState({
			tabBarColor1: "background-color: white",
			tabBarColor2: "",
			tabBarColor3: "",
			tabBarColor4: "",
			tabFont1: {color: 'black'},
			tabFont2: {},
			tabFont3: {},
			tabFont4: {},
			tabbar1Pic: tabbar1_pic1,
			tabbar2Pic: tabbar2_pic2,
			tabbar3Pic: tabbar3_pic2,
			tabbar4Pic: tabbar4_pic2,
			orderList,
		});
		// console.log(self.state);
	}

	tabBar2() {
		let {orderList} = self.state;
		let thisList = 0;
		// self.state.emptyListDisplay=null;
		for (let i = 0; i < orderList.length; i++) {
			if (orderList[i].order_state === '2') {
				orderList[i].order_display = {display: 'block'};
				thisList++;
				// console.log(thisList);
				if (thisList > 0) {
					console.log('1点击TB1不显示图片');
					self.state.emptyListDisplay = {display: 'none'};
					self.setState({
						emptyListDisplay: self.state.emptyListDisplay,
					})
				}
				else {
					console.log('2点击TB1显示图片');
					self.state.emptyListDisplay = {display: 'block'};
					self.setState({
						emptyListDisplay: self.state.emptyListDisplay,
					})
				}
			}
			else {
				orderList[i].order_display = {display: 'none'};
				// console.log(thisList);
				if (thisList > 0) {
					console.log('3点击TB1不显示图片');
					self.state.emptyListDisplay = {display: 'none'};
					self.setState({
						emptyListDisplay: self.state.emptyListDisplay,
					})
				}
				else {
					console.log('4点击TB1显示图片');
					self.state.emptyListDisplay = {display: 'block!important'};
					self.setState({
						emptyListDisplay: self.state.emptyListDisplay,
					})
				}
			}
		}
		self.setState({
			tabBarColor1: "",
			tabBarColor2: "background-color: white",
			tabBarColor3: "",
			tabBarColor4: "",
			tabFont1: {},
			tabFont2: {color: 'black'},
			tabFont3: {},
			tabFont4: {},
			tabbar1Pic: tabbar1_pic2,
			tabbar2Pic: tabbar2_pic1,
			tabbar3Pic: tabbar3_pic2,
			tabbar4Pic: tabbar4_pic2,
			orderList,
		})
	}

	tabBar3() {
		let {orderList} = self.state;
		// self.state.emptyListDisplay=null;
		let thisList = 0;
		for (let i = 0; i < orderList.length; i++) {
			if (orderList[i].order_state === '3') {
				orderList[i].order_display = {display: 'block'};
				thisList++;
				// console.log(thisList);
				if (thisList > 0) {
					console.log('1点击TB1不显示图片');
					self.state.emptyListDisplay = {display: 'none'};
					self.setState({
						emptyListDisplay: self.state.emptyListDisplay,
					})
				}
				else {
					console.log('2点击TB1显示图片');
					self.state.emptyListDisplay = {display: 'block'};
					self.setState({
						emptyListDisplay: self.state.emptyListDisplay,
					})
				}
			}
			else {
				orderList[i].order_display = {display: 'none'};
				// console.log(thisList);
				if (thisList > 0) {
					console.log('3点击TB1不显示图片');
					self.state.emptyListDisplay = {display: 'none'};
					self.setState({
						emptyListDisplay: self.state.emptyListDisplay,
					})
				}
				else {
					console.log('4点击TB1显示图片');
					self.state.emptyListDisplay = {display: 'block!important'};
					self.setState({
						emptyListDisplay: self.state.emptyListDisplay,
					})
				}
			}
		}
		self.setState({
			tabBarColor1: "",
			tabBarColor2: "",
			tabBarColor3: "background-color: white",
			tabBarColor4: "",
			tabFont1: {},
			tabFont2: {},
			tabFont3: {color: 'black'},
			tabFont4: {},
			tabbar1Pic: tabbar1_pic2,
			tabbar2Pic: tabbar2_pic2,
			tabbar3Pic: tabbar3_pic1,
			tabbar4Pic: tabbar4_pic2,
			orderList,
		})
	}

	tabBar4() {
		let {orderList} = self.state;
		let thisList = 0;
		// self.state.emptyListDisplay=null;
		for (let i = 0; i < orderList.length; i++) {
			if (orderList[i].order_state === '4') {
				orderList[i].order_display = {display: 'block'};
				thisList++;
				// console.log(thisList);
				if (thisList > 0) {
					console.log('1点击TB1不显示图片');
					self.state.emptyListDisplay = {display: 'none'};
					self.setState({
						emptyListDisplay: self.state.emptyListDisplay,
					})
				}
				else {
					console.log('2点击TB1显示图片');
					self.state.emptyListDisplay = {display: 'block'};
					self.setState({
						emptyListDisplay: self.state.emptyListDisplay,
					})
				}
			}
			else {
				orderList[i].order_display = {display: 'none'};
				// console.log(thisList);
				if (thisList > 0) {
					console.log('3点击TB1不显示图片');
					self.state.emptyListDisplay = {display: 'none'};
					self.setState({
						emptyListDisplay: self.state.emptyListDisplay,
					})
				}
				else {
					console.log('4点击TB1显示图片');
					self.state.emptyListDisplay = {display: 'block!important'};
					self.setState({
						emptyListDisplay: self.state.emptyListDisplay,
					})
				}
			}
		}
		self.setState({
			tabBarColor1: "",
			tabBarColor2: "",
			tabBarColor3: "",
			tabBarColor4: "background-color: white",
			tabFont1: {},
			tabFont2: {},
			tabFont3: {},
			tabFont4: {color: 'black'},
			tabbar1Pic: tabbar1_pic2,
			tabbar2Pic: tabbar2_pic2,
			tabbar3Pic: tabbar3_pic2,
			tabbar4Pic: tabbar4_pic1,
			orderList,
		})
	}

	componentDidMount() {
		ebSetTitleAndReturnState(this);
		//跳转此网页的默认TABBAR
		let params = ebGetRouterParams(this);
		console.log(params);
		if (params.tabbar === '1') {
			this.tabBar1();
		}
		else {
			this.tabBar2();
		}

		//时间戳
		let myDate = new Date();
		let date = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()
			+ " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
		console.log(date);
		let date1 = myDate.getFullYear() + "-" + (myDate.getMonth() + 2) + "-" + myDate.getDate()
			+ " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
		this.setState({
			date: date,
			date1: date1
		});
		let {orderList} = self.state;
		// orderList=[
		//     {
		//         order_sn:'12315WFFF',
		//         create_time:'2019-6-4 15:00',
		//         equipment:['WYB123141','WYB4365478','WYB89797979'],
		//         order_state:'1',
		//         order_placeholder:'暂无路径',
		//         chooseId:3,
		//     },
		//     {
		//         order_sn:'77715W233F',
		//         create_time:'2019-6-2 15:00',
		//         equipment:['WYB123141','WYB4365478','WYB89797979'],
		//         order_state:'2',
		//         order_placeholder:'暂无路径',
		//         chooseId:2,
		//     },
		//     {
		//         order_sn:'77715W233F',
		//         create_time:'2019-6-2 15:00',
		//         equipment:['WYB123141','WYB4365478','WYB89797979'],
		//         order_state:'3',
		//         order_placeholder:'暂无路径',
		//         chooseId:1,
		//     },
		//     {
		//         order_sn:'77715W233F',
		//         create_time:'2019-6-2 15:00',
		//         equipment:['WYB123141','WYB4365478','WYB89797979'],
		//         order_state:'4',
		//         order_placeholder:'暂无路径',
		//         chooseId:0,
		//     },
		// ];
		// for (let i=0;i<orderList.length;i++){
		//                 orderList[i].chooseTimeList=[]
		//             }
		// self.setState({
		//                 orderList:orderList
		//             })

		//mock数据
		let data = {};
		let option = {data, method: 'get'}
		ebRequest('/advManage', {mock: true, mock_index: 1}, (res) => {
			if (res.status) {
				console.log(res);
				orderList = res.data.orderList
				// console.log(orderList);
				for (let i = 0; i < orderList.length; i++) {
					orderList[i].chooseTimeList = []
				}
				self.setState({
					loading:false,
					orderList: orderList
				})
				// console.log(orderList);
			}

		});

	}

	componentDidShow() {

	}

	componentDidHide() {
	}

	render() {
		let {orderList, date, date1, display, timeList, emptyListDisplay,loading} = self.state;

		return (
			<View className="demo11">
				{/*左边选项栏*/}
				<View className="tabBar">
					<View className="tabBarBig"
								onClick={this.tabBar1}
								style={this.state.tabBarColor1}>
						<Image className="tabBar1"
									 src={this.state.tabbar1Pic}
									 style={this.state.tabBarColor1}
						/>
						<Text className='tabFont'
									style={this.state.tabFont1}
						>
							投放中
						</Text>
					</View>
					<View className="tabBarBig"
								onClick={this.tabBar2}
								style={this.state.tabBarColor2}>
						<Image className="tabBar1"
									 src={this.state.tabbar2Pic}
									 style={this.state.tabBarColor2}
						/>
						<Text className='tabFont'
									style={this.state.tabFont2}
						>
							等待审核
						</Text>
					</View>
					<View className="tabBarBig"
								onClick={this.tabBar3}
								style={this.state.tabBarColor3}>
						<Image className="tabBar1"
									 src={this.state.tabbar3Pic}
									 style={this.state.tabBarColor3}
						/>
						<Text className='tabFont'
									style={this.state.tabFont3}
						>
							审核中
						</Text>
					</View>
					<View className="tabBarBig"
								onClick={this.tabBar4}
								style={this.state.tabBarColor4}>
						<Image className="tabBar1"
									 src={this.state.tabbar4Pic}
									 style={this.state.tabBarColor4}
						/>
						<Text className='tabFont'
									style={this.state.tabFont4}
						>
							未通过
						</Text>
					</View>
				</View>
				{/*右边订单栏*/}
				{
					loading ? <AtActivityIndicator mode='center' content='Loading...'/> :
						<View className="back">
							<EmptyList emptyListDisplay={emptyListDisplay} orderList={orderList}/>

							<OrderList orderList={orderList} date={date} date1={date1}
												 timeList={timeList}
												 display={display}

								//上传
												 upload={(k) => {
													 Taro.showActionSheet({
														 itemList: ["选择图片", "选择视频"],
														 success(res) {
															 // console.log(res.tapIndex);
															 // console.log(orderList)
															 if (res.tapIndex === 0) {
																 Taro.chooseImage({
																	 success(res1) {
																		 orderList[k].placeholder = res1.tempFilePaths;
																		 self.setState({
																			 orderList: orderList
																		 })
																	 }
																 })
															 }
															 else {
																 Taro.chooseVideo({
																	 success(res2) {
																		 orderList[k].placeholder = res2.tempFilePaths;
																		 self.setState({
																			 orderList: orderList
																		 })
																	 }
																 })
															 }
														 }
													 })
												 }}
								//预览
												 preview={(k) => {
													 let {orderList} = self.state;
													 Taro.previewImage({
														 current: orderList[k].placeholder[0],
														 urls: orderList[k].placeholder
													 })
												 }}
												 bottom={(k) => {
													 Taro.navigateTo({
														 url: "../advUploadSuccess/index"
													 });
													 console.log(orderList[k])
												 }}
								//选择时长
												 chooseTime={(q, k) => {

													 for (let i = 0; i < orderList[k].chooseTimeList.length; i++) {
														 if (i === q) {
															 orderList[k].chooseTimeList[i].choose = {
																 border: '2px solid #3176E7',
																 backgroundColor: '#3176E7', color: 'white'
															 };
															 self.setState({
																 orderList
															 })
														 }
														 else {
															 orderList[k].chooseTimeList[i].choose = {
																 border: '1px solid #AAAAAA',
																 backgroundColor: 'white', color: 'black'
															 };
															 self.setState({
																 orderList
															 })
														 }
													 }

													 console.log(orderList[k].chooseTimeList);
												 }}
												 toSelectList={(k) => {
													 ebNavigateTo('/model/advModel/advSelectList/index')
												 }}

							/>

						</View>
				}


			</View>
		)
	}
}
