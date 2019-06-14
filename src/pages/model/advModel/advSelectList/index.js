import Taro, {Component} from '@tarojs/taro'
import {View, Picker, Text} from '@tarojs/components'
import './index.scss'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import {ebSetTitleAndReturnState, ebRequest, API_V1, ebSetLocalStorage,ebGetLocalStorage} from "../../../../utils"
import vip from '../../../../asset/image/vip.png'
import add from '../../../../asset/image/add.png'
import hoo from '../../../../asset/image/hook.png'
import sel from '../../../../asset/image/Selected.png'
import map from '../../../../asset/image/map.png'
import down from '../../../../asset/image/down.png'
import PointChoose from '../../../../components/pointChoose'
import UserLogin from '../../../../components/userlogin'
import {initAppUpdate} from "../../../../store/init";
import { AtToast } from "taro-ui"
import { timingSafeEqual } from 'crypto';
import PageData from '../../../../components/pageData'
import {authorizedUpdate} from "../../../../store/account";
import {globalShowAuthUpdate} from "../../../../store/global";


let self = null

@connect(
	(store) => ({
		scene: store.global.scene,
		authState: store.account.authorized,
	}),
	(dispatch) => bindActionCreators({initAppUpdate,globalShowAuthUpdate,authorizedUpdate}, dispatch)
)
export default class Select extends Component {
	constructor(props) {
		super(props);
		self = this;
		this.state = {
			top_info: {status: false, color: "#ffffff", bgcolor: "#ff0000"},
			addnum: 0,
			listSelect: [],
			loginState: self.props.authState,
			// selector1省份列表
			selector1: [],    
			selectorChecked1: '江苏省',
			// selectors2所有的城市列表
			selectors2:[],
			// selector2对应省份下的城市列表
			selector2: [],
			// selectorChecked2 显示的城市名称
			selectorChecked2: '常州',
			index1:0,
			// pageData页面内容是否为空
			pageData:false,
			dis:false
		}
	}
	
	componentDidMount() {

		let {addnum,} = self.state
		let data = {};
		let option = {data, method: 'get'}
		ebSetTitleAndReturnState(self);
		ebRequest('/select', {mock: true,mock_index:0}, (res) => {
			let tempList = res.list.filter((value, index, arr) => {
				return value.checked
				
			})
			if(res.list){
				
				self.setState({
					pageData : true
				},()=>{console.log('pageData='+self.state.pageData)})
			}
			console.log('status='+res.status)
			addnum = tempList.length
			self.setState({listSelect: res.list, addnum},()=>(
				console.log('list='+self.state.listSelect.length),
				ebSetLocalStorage('EB_LIST_SELECT2',self.state.listSelect)
			))
			
			
		}),
			// 获取城市
			ebRequest('/common/' + API_V1 + 'city',option, function (res) {
				if (res.status) {
					self.setState({
						// selectors2 所有的城市列表
						selectors2 : res.data['city'],
						// selector1 省份列表
						selector1 : res.data['province'],
						// 默认为江苏的城市列表
						selector2 : res.data['city'][9]
					})
				}
			})
	}

	componentDidShow() {
		let listSelect_1=ebGetLocalStorage('EB_LIST_SELECT1');
		let listSelect_1_string=JSON.stringify(listSelect_1)
		let listSelect_2=self.state.listSelect
		if (listSelect_1_string!='{}'){
			console.log('页面有内容')
			for(var i=0; i<listSelect_2.length; i++){
				for(var n=0; n<JSON.parse(listSelect_1).length;n++){
					if(JSON.parse(listSelect_1)[n]['id']==listSelect_2[i]['id']){
						console.log('进入'+i)
						listSelect_2[i]['checked']= false
					} 
						
				}
			}
		}
		let addnum = listSelect_2.filter((item)=>{ return item.checked===true}).length
		console.log('已选'+addnum)
		self.setState({listSelect:listSelect_2})
		self.setState({addnum:addnum})
	}

	componentDidHide() {
	}

	componentWillReceiveProps(nextProps, nextContext) {
		console.log('advSelect componentWillReceiveProps:', nextProps, nextContext)
		self.setState({loginState: nextProps.authState})
	}

	toAdvSelectConfirm() {
		let{listSelect}=self.state;
		let  s=listSelect.filter((item)=>{ return item.checked==true  })
		ebSetLocalStorage('EB_LIST_SELECT',JSON.stringify(s));
		console.log('plc',ebSetLocalStorage('EB_LIST_SELECT',JSON.stringify(s)));
		Taro.navigateTo({
			url: '/pages/model/advModel/advSelectConfirm/index'
		})

	}

	toadvSelectMap() {
		let{listSelect}=self.state;
		//
		let  s=listSelect.filter((item)=>{ return item.checked==true  })
		ebSetLocalStorage('EB_LIST_SELECT',s);
		Taro.navigateTo({
			url: '/pages/model/advModel/advSelectMap/index'
		})
	}

	erro(){
		self.setState({dis:true})
	}
	correct(){
		self.setState({dis:false})
	}

	
	// 省份点击方法
	onChange1 = e => {
		let {index1,selector2,selectors2,selectorChecked2} = self.state
		this.setState({
			// e.detail.value是点击的元素的下标
			// 将省份的名称改为点击的省份名称
		  selectorChecked1: this.state.selector1[e.detail.value],

		  selector2: this.state.selectors2[e.detail.value],
		// 点击省份之后，城市默认为城市列表的第一个元素
		  selectorChecked2: this.state.selectors2[e.detail.value][0]
		})
	}

	// 城市点击方法
	onChange2 = e => {
		// 提交城市名称，发送请求，获取当前城市的点位信息
		ebRequest('/select', {mock: true,mock_index:0},function (res) {
			console.log(res.status)
			if (res.status===true) {
				console.log('成功')
			}
		})
		this.setState({
		  selectorChecked2: this.state.selector2[e.detail.value]
		})
	}


	

	render() {

		let {listSelect, addnum,loginState,} = self.state
		let {authState, scene} = self.props
		return (
			<View className='index'>
				
				<View className='head'>
					{/* 省份选择 */}
					<Picker mode='selector' range={this.state.selector1} onChange={this.onChange1} >
						<View className='province'>
							{this.state.selectorChecked1}
						</View>
						<Image className='down1' src={down} />
					</Picker>
					
					{/* 城市选择 */}
					<Picker mode='selector' range={this.state.selector2} onChange={this.onChange2}>
						<View className='city'>
							{this.state.selectorChecked2}
						</View>
						<Image className='down2' src={down} />
					</Picker>
				</View>

				<PointChoose listSelect={listSelect} vip={vip} hoo={hoo} add={add} handleChange={(k) => {
					console.log(this);

					let {addnum, listSelect} = self.state;

					listSelect[k]['checked'] = !listSelect[k]['checked']

					let tempList = listSelect.filter((value, index, arr) => {
						// console.log('lzz:' + value, index, arr)
						return value.checked
					})

					addnum = tempList.length

					self.setState({
						listSelect,
						addnum
					})

				}}/>

				{/* 块2开始 */}
				<View>
					{/* 轻提示 */}
					<AtToast 
					isOpened= {self.state.dis}
					duration= '1200'
					text="未选择点位" 
					onClose={this.correct}
					></AtToast>
					<Image className='sel' src={sel} onClick={this.toAdvSelectConfirm}></Image>
					<View className='float' onClick={addnum? this.toAdvSelectConfirm:this.erro}>
						<Text className='next'>下一步</Text>
					</View>
					<Image className='map' src={map} onClick={this.toadvSelectMap}></Image>
					<View className='snum'>
						{addnum == null ? 0 : addnum}
					</View>
				</View>
				{/* 块2结束 */}
				{
					authState ? null : <UserLogin authState={authState} sceneState={scene} />
				}
				{
					pageData == false &&
					<PageData/>
				}
			</View>
		)
	}
}
