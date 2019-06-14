import './index.scss'
import Taro, {Component} from '@tarojs/taro'
import {View, Picker, Text} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import {ebSetTitleAndReturnState, ebRequest, ebGetRouterParams, ebGetLocalStorage,ebSetLocalStorage} from "../../../../utils"
import vip from '../../../../asset/image/vip.png'
import hoo from '../../../../asset/image/square_reduce-red.png'
import PointChoose from '../../../../components/pointChoose'
import UserLogin from '../../../../components/userlogin'
import {initAppUpdate} from "../../../../store/init";
import PageData from '../../../../components/pageData'
import { AtToast } from "taro-ui"
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
			pageData:false,
			ss:[]
		}
	}

	componentWillMount(){
		let listSelect_=ebGetLocalStorage('EB_LIST_SELECT');
		console.log(listSelect_)
		self.setState({listSelect:JSON.parse(listSelect_)})
	}


	componentDidMount() {
		ebSetTitleAndReturnState(self);
		self.state.listSelect.length !== 0 && self.setState({pageData:true})
		ebSetLocalStorage('EB_LIST_SELECT1',{})

	}

	componentDidShow() {
	}

	componentDidHide() {
	}

	componentWillReceiveProps(nextProps, nextContext) {
		console.log('advSelect componentWillReceiveProps:', nextProps, nextContext)
		self.setState({loginState: nextProps.authState})
	}

	toAdvConfireChoose() {
		Taro.navigateTo({
			url: '/pages/model/advModel/advConfireChoose/index'
		})
	}

	todemo4() {
		Taro.navigateTo({
			url: '/pages/model/advModel/demo-4/demo-4'
		})
	}
	erro(){
		self.setState({dis:true})
	}
	correct(){
		self.setState({dis:false})
	}

	render() {

		let {listSelect} = self.state
		let {authState, scene} = self.props

		return (
			<View className='index'>

				<PointChoose listSelect={listSelect} vip={vip} hoo={hoo} handleChange={(k) => {
					console.log(this);
					let {addnum, listSelect} = self.state;
					listSelect[k]['checked'] = !listSelect[k]['checked']
					// 将checked的值改为相反
					Taro.showModal({
						// title: 'xxx',
						content: '是否确认删除',
						success(res){
							let {ss} = self.state
							let  s=listSelect.filter((item)=>{ return item.checked===false})
							ss.push(s[0])
							// console.log('ss='+JSON.stringify(ss))
							ebSetLocalStorage('EB_LIST_SELECT1',JSON.stringify(ss));
							if(res.confirm){
								listSelect.splice(k,1)
								self.setState({
									listSelect,
								},()=>(
									listSelect.length===0&&
									self.setState({
										pageData:false
									})
								))
							}
						}
					  })
					  	
				}}/>

				{/* 块2开始 */}
				<View>
					<AtToast 
						isOpened= {self.state.dis}
						duration= '1200'
						text="未选择点位" 
						onClose={this.correct}
						></AtToast>
					<View className='float' onClick={self.state.pageData?this.toAdvConfireChoose:this.erro}>
						<Text className='next'>确认选择</Text>
					</View>
				</View>
				{/* 块2结束 */}
				{
					authState ? null : <UserLogin authState={authState} sceneState={scene} />
				}
				{
				pageData==false&&
				<PageData/>
				}
				
			</View>
		)
	}
}
