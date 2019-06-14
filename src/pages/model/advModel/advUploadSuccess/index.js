import Taro, {Component} from '@tarojs/taro'
import {View, Button, Image, OpenData} from '@tarojs/components'
import './index.css'
import '../../../../app.scss'
import {ebNavigateTo, ebReLaunch, ebSetTitleAndReturnState} from "../../../../utils"
import "../../../../asset/image/msg.png"
import greenHook from "../../../../asset/image/greenHook.png";

let self

export default class UploadSuccess extends Component {
	constructor(props) {
		super(props);

	}

	componentDidMount() {
		ebSetTitleAndReturnState(this);
	}

	componentDidShow() {
	}

	componentDidHide() {
	}

	//用户点击右上角转发
	onShareAppMessage = () => {
		//console.log('小程序专有 用户点击右上角转发')
	}

	//页面上拉触底事件的处理函数
	onReachBottom = () => {
	}

	lookResult() {
		ebNavigateTo('/model/advModel/advManage/index?tabbar=2')
	}

	goIndex() {
		ebReLaunch()
	}

	render() {

		return (
			<View>
				{/*<View className="head">*/}
				{/*<OpenData className="head-left"*/}
				{/*type="userAvatarUrl"*/}
				{/*/>*/}
				{/*<Image className="head-right"*/}
				{/*src="../../../../asset/image/msg.png"*/}
				{/*/>*/}
				{/*</View>*/}
				<View className="body">
					<Image className="body1" src={greenHook}/>
					<View className="body2">上传成功，等待审核</View>
					<View className="body3">您所编辑的内容已成功提交审核，
						工作人员将会在24小时 内完成审核，
						并电话通知您，请注意接收消息。
						审核通过后，可在广告管理系统中修改广告内容。</View>
				</View>
				<View className="foot">
					<Button className="foot-left"
									onClick={this.goIndex}
					>返回首页</Button>
					<Button className="foot-right"
									onClick={this.lookResult}
					>查看审核进度</Button>


				</View>


			</View>
		)
	}
}
