import Taro from '@tarojs/taro';
import {View} from '@tarojs/components';
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import './index.scss';
import {ebUploadFile, ebGetLocalStorage, ebShowToast, ebShowModal} from "../../utils";
import {AtActionSheet, AtActionSheetItem} from "taro-ui"
import ShowMore from "../showMore";
import {initAppUpdate} from "../../store/init";
import {authorizedUpdate} from "../../store/account";
import {globalShowAuthUpdate} from "../../store/global";

let self = null;

@connect(
	(store) => ({
		authorized: store.account.authorized,
	}),
	(dispatch) => bindActionCreators({initAppUpdate, authorizedUpdate, globalShowAuthUpdate}, dispatch)
)
class TextAss extends Taro.Component {
	constructor(props) {
		super(props);
		self = this;
		self.state = {
			isActionSheetOpened: false,
		}
	}


	read(type) {

		let {authorized} = self.props

		if (!authorized) {
			self.props.globalShowAuthUpdate(true)
		} else {
			this.setState({
				type: type,
				[`isActionSheetOpened`]: true
			})
		}

	}

	// 打开本地文件
	textClick() {
		let {type} = self.state
		let token = ebGetLocalStorage('EB_TOKEN');

		Taro.navigateTo({
			url: '/pages/model/printModel/local/index?type=' + type + '&token=' + token,
			success() {
				self.setState({
					[`isActionSheetOpened`]: false,
				})
			}
		})

	}


	// 打开微信客户端
	wechatClick() {
		Taro.chooseMessageFile({
			count: 1,
			type: 'file',
			extension: ['xlsx', 'docx'],
			success(result) {
				// tempFilePath可以作为img标签的src属性显示图片
				const tempFilePaths = result.tempFiles

				if (tempFilePaths.length > 0) {
					// 确认上传弹窗
					ebShowModal({title: '是否确认上传该文件', content: '文件名：' + tempFilePaths[0]['name']}, () => {
						ebUploadFile({filePath: tempFilePaths[0]['path']}, function (res) {
							if (res.status) {
								let {type} = self.state
								let data1 = res.data
								var file = JSON.stringify(data1['file']);
								Taro.navigateTo({url: '/pages/model/printModel/printOrderCreate/index?num=1' + '&print_type=' + 1 + type + '&file=' + file + '&price=0.01'});
							}
						})
					})

				} else {
					ebShowToast("选择文件出错，请重试")
				}


				self.setState({
					[`isActionSheetOpened`]: false,
				})

			}
		})

	}

	render() {

		let images = {}
		let config = {}

		let {dataComponent} = self.props;
		if (dataComponent) {
			images = dataComponent.images;
			config = dataComponent.config;
		} else {
			images = {entryImage: []}
			config = {showMore: false}
		}

		return (

			<View>

				{
					images.entryImage && images.entryImage.map((v, i) => {
						return (
							<View className='pic0' key={i}>
								<Image className='pic' onClick={this.read.bind(this, i)} src={v.src}>
								</Image>
								<View className='data0'>
									{v.title}
								</View>
								<View className='data1'>
									{v.title_sub}
								</View>

							</View>
						)
					})
				}

				{
					config.showMore &&
					<ShowMore/>
				}


				<AtActionSheet
					isOpened={this.state.isActionSheetOpened}
					cancelText='取消'
					onCancel={this.handleCancel}
					onClose={this.handleClose}>
					<AtActionSheetItem onClick={this.textClick}>
						本地文件
					</AtActionSheetItem>
					<AtActionSheetItem onClick={this.wechatClick}>
						微信文件
					</AtActionSheetItem>
				</AtActionSheet>
			</View>


		)
	}
}

export default TextAss