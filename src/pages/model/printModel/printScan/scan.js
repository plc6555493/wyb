import Taro, {Component} from '@tarojs/taro'
import {View, Text, Button, Image, OpenData} from '@tarojs/components'
import './scan.css'
import Order from '../../../../components/order/order.js'
import {API_V1, ebGetLocalStorage, ebGetRouterParams, ebNavigateTo, ebRequest,
	ebSetTitleAndReturnState,ebPrintTaskCreate} from '../../../../utils';
import emptyList from '../../../../asset/image/emptyList.png';
import scanSuccess from "../scanSuccess/scanSuccess";


let self = null;

export default class Scan extends Component {
	constructor(props) {
		super(props);
		self = this;
		this.state = {
			taskList: [],
			date: '',
			arr: [],
		}
	}

	componentDidMount() {
		ebSetTitleAndReturnState(this);


		let {taskList} = self.state;
		let token = ebGetLocalStorage('EB_TOKEN');
		let data = {order_state: '20'};
		let option = {data, token, method: 'GET'};
		ebRequest('/wxmin/' + API_V1 + 'order/', option, function (res) {
			if (res.status) {
				console.log(res.data.list);

				self.setState({
					taskList: res.data.list||[]
				})


			}

		});


		let myDate = new Date();
		let date = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()
			+ " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
		this.setState({
			date: date
		});
	}

	toScanSuccess() {
		//获得地址栏参数
		let params = ebGetRouterParams(this);
		console.log('获得地址栏参数:', params);
		//获取机器码
		let {machine_code} = params
		//OID数组变字符串
		let {arr} = this.state;
		console.log('数组是：', arr);
		let arrToString = arr.join(',');
		console.log('数组变成字符串：', arrToString);
		console.log('类型：', typeof (arrToString));
		let token = ebGetLocalStorage('EB_TOKEN');
		let data = {oid: arrToString, machine_code: machine_code};
		let option = {data, token, method: 'POST'};
		ebPrintTaskCreate(option)
	}


	render() {
		let {taskList, date, arr, picType} = this.state;

		return (
			<View className='back'>
				{
					taskList.length > 0 ? <View>
						<View className='chooseTask'>请选择打印任务：</View>

						<View className='resolve'
									style={arr.length === 0 ? {backgroundColor:'#ADC3E6'} : {backgroundColor:'#3176E7'}}
									onClick={arr.length === 0 ?null:this.toScanSuccess}>
							确认打印
						</View>



						<Order taskList={taskList}
									 date={date}
									 onSelect={(k) => {
										 let {taskList} = self.state;
										 if (JSON.stringify(taskList[k].backColor)
											 !== JSON.stringify({backgroundColor: '#000000'})) {
											 taskList[k].backColor = {backgroundColor: '#000000'};
											 taskList[k].displayHook = {display: 'block'};
											 self.setState({
												 taskList: taskList
											 })
											 console.log(taskList[k].order_id);
											 arr.push(taskList[k].order_id);
											 console.log(arr);
										 }
										 else {
											 console.log('再次点击=取消', k);
											 taskList[k].backColor = {backgroundColor: '#EEEEEE'};
											 taskList[k].displayHook = {display: 'none'};
											 self.setState({
												 taskList: taskList
											 });
											 let index = arr.indexOf(taskList[k].order_id);
											 arr.splice(index, 1)
											 console.log(arr);
										 }
										 self.setState({arr})
									 }}
						/>
					</View> : <View>
						<Image className='emptyList'
									 src={emptyList}
						/>
					</View>
				}

			</View>
		)
	}
}