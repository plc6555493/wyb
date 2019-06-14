import Taro from '@tarojs/taro';
import {View} from '@tarojs/components';
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import './index.scss';
import {ebUploadFile, ebShowModal, ebShowToast, ebNavigateTo} from "../../utils";
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
class PicAss extends Taro.Component {
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

	confirmToUpload(tempFilePaths) {

		if (tempFilePaths.length > 0) {

			let content = tempFilePaths[0]['name'] == undefined ? "是确认上传,否取消上传" : '文件名：' + tempFilePaths[0]['name']

			ebShowModal({title: '是否确认上传该文件', content}, () => {
				ebUploadFile({filePath: tempFilePaths[0]['path'] || tempFilePaths[0]}, function (res) {
					if (res.status) {
						let data1 = res.data
						let file = JSON.stringify(data1['file']);
						let {type} = self.state;
						console.log('type=' + type)
						ebNavigateTo('/model/printModel/printOrderCreate/index?num=1' + '&print_type=' + type + 0 + '&file=' + file + '&price=0.01');
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

	// 打开本地相册
	picClick() {
		Taro.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album'],
			success(res) {
				// 确认上传弹窗
				self.confirmToUpload(res.tempFilePaths)
			}
		})
	}

	// 打开相机
	cameraClick() {
		Taro.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['camera'],
			success(res) {
				// tempFilePath可以作为img标签的src属性显示图片
				self.confirmToUpload(res.tempFilePaths)
			}
		})
	}


	wechatClick() {
		Taro.chooseMessageFile({
			count: 1,
			type: 'image',
			success(res) {
				self.confirmToUpload(res.tempFiles)
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
					<AtActionSheetItem onClick={this.picClick}>
						本地相册
					</AtActionSheetItem>
					<AtActionSheetItem onClick={this.cameraClick}>
						相机拍照
					</AtActionSheetItem>
					<AtActionSheetItem onClick={this.wechatClick}>
						微信照片
					</AtActionSheetItem>
				</AtActionSheet>

			</View>


		)
	}
}

export default PicAss