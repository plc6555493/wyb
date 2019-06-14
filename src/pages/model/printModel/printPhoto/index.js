import Taro, {Component} from '@tarojs/taro'
import {View, Button} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import {ebGetRouterParams, ebSetTitleAndReturnState} from "../../../../utils"
import './index.scss'
import PicAss from '../../../../components/printPhoto'
import UserLogin from '../../../../components/userlogin'
import {initAppUpdate} from "../../../../store/init";
import {globalShowAuthUpdate} from "../../../../store/global";
import {authorizedUpdate} from "../../../../store/account";

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
		super(props)
		self = this
		self.state = {
			data:{},
		}
	}


	componentWillMount() {
		let params = ebGetRouterParams(this);
		let data = JSON.parse(params.data);
		self.setState({data})
	}

	componentDidMount() {
		ebSetTitleAndReturnState(self);
		let {authState} = self.state
		this.props.globalShowAuthUpdate(authState ? false : true)
	}


	render() {

		let {data} = self.state
		let {config,readme} = data
		let {authState, scene} = self.props

		return (
			<View className='index'>
				<View className='data0'>选择照片尺寸</View>
				<PicAss className='pic' dataComponent={data}/>

				<View className="clean-fix"/>

				{config.readme && <View className='title'>使用说明</View>}
				<View className='data2' style={{whiteSpace: 'pre-wrap'}}>

					{
						config.readme && readme && readme.map((v, i) => {
							return (
								<View className='pic1' key={i}>
									{i}. {v}
								</View>
							)
						})
					}
				</View>


				{
					authState ? null : <UserLogin authState={authState} sceneState={scene}/>
				}

			</View>
		)
	}
}

