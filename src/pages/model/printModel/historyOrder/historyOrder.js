import Taro, {Component} from '@tarojs/taro'
import {View, Text, Button, Image, OpenData} from '@tarojs/components'
import './historyOrder.css'
import History from '../../../../components/history/history.js'
import {API_V1, ebGetLocalStorage, ebGetRouterParams, ebPay, ebRequest, ebScanCode, ebSetTitleAndReturnState, ebShowModal, ebShowToast, ebPrintTaskCreate, ebFilePreview} from "../../../../utils";
import emptyList from '../../../../asset/image/emptyList.png';
import {AtActivityIndicator,  AtSwipeAction,} from 'taro-ui'

let self = null;


export default class HistoryOrder extends Component {
	constructor(props) {
		super(props);
		self = this;
		this.state = {
			loading: true,
			taskList: [],
			title: [],
			chooseTitle: [],
			titleKey:null,
			thisListDisplay: 'display:none',

			limit: 11,//显示数据量
			list: '',
			page: 1,//当前页
			load: true,
			reachBottom_loading: false,//加载动画的显示
		}
	}

	componentDidMount() {

		ebSetTitleAndReturnState(self, '我的订单');
		self.filter(0)
		let token = ebGetLocalStorage('EB_TOKEN');
		let data = {};
		let option = {data, token, method: 'get'};
		ebRequest('/wxmin/' + API_V1 + 'order/', option, function (res) {
			if (res.status) {
				console.log('返回参数', res.data);
				let {title, list, title_state} = res.data;
				// list=list.splice(0,5)
				self.setState({
					loading: false,
					title: title,
					title_state: title_state,
					taskList: list
				})


			}

		})
	};




	filter(k) {
		console.log(k);
		//列表更新显示函数
		self.listShowUpdate=(osd)=>{
			let {taskList, title, chooseTitle, thisListDisplay,titleKey} = this.state;
			let thisList = 0;
			titleKey=k;
			self.setState({
				thisListDisplay: 'display:none',
				titleKey
			});
			for (let j = 0; j < chooseTitle.length; j++) {
				if (j === k) {
					chooseTitle[j].choose = 'choose';
				}
				else {
					chooseTitle[j].choose = '';
				}
			}
			for (let i = 0; i < taskList.length; i++) {
				if (taskList[i].order_state === osd) {
					thisList++;
					if (thisList > 0) {
						self.setState({
							thisListDisplay: 'display:none'
						})
					}
					else {
						self.setState({
							thisListDisplay: 'display:block'
						})
					}
					taskList[i].filterOrder = 'display:block';
					self.setState({
						taskList: taskList,
						chooseTitle,

					})
				}
				else {
					if (thisList === 0) {
						self.setState({
							thisListDisplay: 'display:block'
						})
					}
					else {
						self.setState({
							thisListDisplay: 'display:none'
						})
					}
					taskList[i].filterOrder = 'display:none';
					self.setState({
						taskList: taskList,
					})
				}
			}
		};
		if(k===0){
			let {taskList, title, chooseTitle, thisListDisplay,titleKey} = this.state;
			let thisList = 0;
			titleKey=k;
			self.setState({
				thisListDisplay: 'display:none',
				titleKey
			});
			for (let j = 0; j < chooseTitle.length; j++) {
				if (j === k) {
					chooseTitle[j].choose = 'choose';
				}
				else {
					chooseTitle[j].choose = '';
				}
			}
			for (let i = 0; i < taskList.length; i++) {
				if (taskList[i].order_state !== '60') {
					thisList++;
					if (thisList > 0) {
						self.setState({
							thisListDisplay: 'display:none'
						})
					}
					else {
						self.setState({
							thisListDisplay: 'display:block'
						})
					}
					taskList[i].filterOrder = 'display:block';
					self.setState({
						taskList: taskList,
						chooseTitle,

					})
				}
				else {
					if (thisList === 0) {
						self.setState({
							thisListDisplay: 'display:block'
						})
					}
					else {
						self.setState({
							thisListDisplay: 'display:none'
						})
					}
					taskList[i].filterOrder = 'display:none';
					self.setState({
						taskList: taskList,
					})
				}
			}
		}
		else if (k === 1) {
			self.listShowUpdate('40')
			}

		else if (k === 2) {
			self.listShowUpdate('10')
		}
		else if (k === 3) {
			self.listShowUpdate('20')
		}
		else if (k === 4) {
			self.listShowUpdate('0')
		}
	}
	handleOrderRightClick(k = '') {
		let title = '';
		let content = '';
		let optionsModel = {};

		let {taskList} = self.state;
		switch (taskList[k].order_state) {
			case "20":
				title = '是否扫码取件';
				content = "是，请扫描屏幕下方的二维码";
				optionsModel = {content, title};
				ebShowModal(optionsModel, () => {
					ebScanCode((res1) => {
						console.log('扫码成功');
						console.log(res1.result);
						let token = ebGetLocalStorage('EB_TOKEN');
						let data = {machine_code: res1.result};
						let option = {data, token, method: 'GET'};
						ebRequest('/wxmin/' + API_V1 + 'order/', option, function (res) {
							if (res.status) {
								//调用打印接口
								let token = ebGetLocalStorage('EB_TOKEN');
								let {order_id} = taskList[k];
								let data = {oid: order_id, machine_code: res1.result};
								let option = {data, token, method: 'POST'};
								ebPrintTaskCreate(option)
							}
						});
					})
				})
				break;
			case "10":
				let osn = taskList[k].order_sn
				let oid = taskList[k].order_id
				title = '是否确认支付该订单';
				content = "订单编号：" + osn + '\r\n 是，确认支付；否，取消支付';
				optionsModel = {content, title};
				ebShowModal(optionsModel, () => {
					ebPay(oid)
				})
				break;
		}
	}

	/**
	 * 文件预览
	 */
	handleOrderLeftClick(k = '') {
		let {taskList} = self.state;
		switch (taskList[k].order_state) {
			case "20": case "10":
				let previewSrc = taskList[k]['file_url'];
				let ext = taskList[k]['file_info_ext'];
				ebFilePreview({previewSrc, ext});
				break;
			default:
				ebShowToast("订单状态不支持预览");
				break;
		}
	}
	handleSwipeClick=(v,k)=>{
		console.log('触发了点击', v,k)
		let {taskList,titleKey}=self.state;
		let title = '';
		let content = '';
		let optionsModel = {};
		let osn = taskList[k].order_sn
		let {order_state,order_id}=taskList[k]
		// this.showToast(`点击了${item.text}按钮`)
		switch (taskList[k].order_state) {
			case '10':
				title = '是否取消此订单？';
				content = "订单编号：" + osn + '\r\n 是，确认取消此订单';
				optionsModel = {content, title};
				ebShowModal(optionsModel, () => {
					order_state =taskList[k].order_state= '0';
					self.setState({
						taskList
					})
					if(titleKey!=0){
						self.filter(2)
					}
					else{
						self.filter(0)
					}
					console.log(order_state,order_id);
					let token = ebGetLocalStorage('EB_TOKEN');
					let data = {order_state,oid:order_id};
					let option = {data, token, method: 'POST'};
					ebRequest('/wxmin/' + API_V1 + 'order/update', option, function (res) {
						if (res.status) {
							console.log('返回参数', res.data);

						}
					})
				});
				break;
			case '0':case '40':
				title = '是否删除此订单？';
				content = "订单编号：" + osn + '\r\n 是，确认删除此订单';
				optionsModel = {content, title};
				ebShowModal(optionsModel, () => {
					order_state =taskList[k].order_state= '60';
					self.setState({
						taskList
					})
					switch(titleKey){
						case 0:
							self.filter(0)
							break;
						case 1:
							self.filter(1)
							break;
						case 4:
							self.filter(4)
							break;
					}

					console.log(order_state,order_id);
					let token = ebGetLocalStorage('EB_TOKEN');
					let data = {order_state,oid:order_id};
					let option = {data, token, method: 'POST'};
					ebRequest('/wxmin/' + API_V1 + 'order/update', option, function (res) {
						if (res.status) {
							console.log('返回参数', res.data);
						}
					})
				});
				break;
			}
		}
	// onReachBottom(){
	// 	Taro.showLoading({
	// 		title: '正在加载',
	// 	})
	// 	self.setState({
	// 		page:self.state.page+1
	// 	})
	// 	let token = ebGetLocalStorage('EB_TOKEN');
	// 	let data = {};
	// 	let option = {data, token, method: 'get'};
	// 	ebRequest('/wxmin/' + API_V1 + 'order/', option, function (res) {
	// 		if (res.status) {
	// 			console.log('返回参数', res.data);
	// 			let {title, list, title_state} = res.data;
	// 			self.setState({
	// 				loading: false,
	// 				title: title,
	// 				title_state: title_state,
	// 				taskList: list
	// 			});
	// 			Taro.hideLoading({
	// 				success(){
	// 					console.log('加载完成');
	// 					Taro.showToast({
	// 						title: '加载成功',
	// 						duration:1000
	// 					})
	// 				}
	// 			})
    //
	// 		}
    //
	// 	})
    //
	// }


	render() {
		let {taskList, date, title, chooseTitle, thisListDisplay, title_state, loading} = self.state;

		return (

			loading ? <AtActivityIndicator mode='center' content='Loading...'/> :

				<View className='back'>
					<View className='title'>
						<View className='title_inner'>
						{
							title.map((v, k) => {
								{
									k === 0 ? chooseTitle.push({choose: 'choose'}) : chooseTitle.push({choose: ''})
								}

								return (
									<Text taroKey={k} onClick={this.filter.bind(this, k)}
												className={chooseTitle[k].choose}
									>
										{v}
									</Text>
								)
							})
						}
						</View>
					</View>
					<Image className='emptyList'
								 src={emptyList}
								 style={taskList.length > 0 ? thisListDisplay : {display: 'block'}}
					/>
					<History taskList={taskList}
							 title_state={title_state}
							 date={date}
							 onOrderRightClick={self.handleOrderRightClick.bind(self)}
							 onOrderLeftClick={self.handleOrderLeftClick.bind(self)}
							 handleSwipeClick={self.handleSwipeClick.bind(self)}
					/>

				</View>
		)
	}
}