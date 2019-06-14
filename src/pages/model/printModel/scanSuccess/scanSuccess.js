import Taro, {Component} from '@tarojs/taro'
import {View, Button, Image, OpenData} from '@tarojs/components'
import './scanSuccess.css'
import {ebGetRouterParams, ebNavigateTo, ebReLaunch, ebSetTitleAndReturnState} from "../../../../utils"
import greenHook from "../../../../asset/image/greenHook.png"


export default class scanSuccess extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resCreate: {}
		}
	}

	componentDidMount() {
		ebSetTitleAndReturnState(this);
		let params = ebGetRouterParams(this);
		let {resCreate} = params;
		resCreate && this.setState({
			resCreate: JSON.parse(resCreate)
		})
	}

	componentDidShow() {
	}

	componentDidHide() {
	}

	goToOrder() {
		ebNavigateTo('/model/printModel/historyOrder/historyOrder', true)
	}

	goIndex() {
		ebReLaunch()
	}

	render() {

		let {status, msg} = this.state.resCreate

		return (
			<View>

				<View className="body">
					<Image className="body1" src={greenHook}/>
					<View className="body2">扫码取件{status == 1 ? '成功' : '失败'}！</View>
					<View className="body2">{msg}！</View>
					<View className="body3"> 感谢使用万印宝！可在历史订单查看订单信息～</View>
				</View>
				<View className="foot">
					<Button className="foot-left"
									onClick={this.goIndex}
					>返回首页</Button>

					<Button className="foot-right"
									onClick={this.goToOrder}
					>前往订单</Button>

				</View>
				{/*营销类活动*/}

			</View>
		)
	}
}
