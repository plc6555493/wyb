import Taro from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import './index.scss';
import {ebShowToast} from "../../utils";


let self = null;

class PrintAss extends Taro.Component {
	constructor(props) {
		super(props);
		self = this;
	}


	toPrint(i) {

		let url = '';

		let {dataList} = this.props

		let {document, photo} = dataList

		switch (i) {
			case 'photo':

				if (photo.config.open) {
					url = '/pages/model/printModel/printPhoto/index?data='+JSON.stringify(photo)
				} else {
					ebShowToast('暂未开放');
					return
				}

				break;
			case 'document':

				if (document.config.open) {
					url = '/pages/model/printModel/printDocument/index?data='+JSON.stringify(document)
				} else {
					ebShowToast('暂未开放');
					return
				}
				break;
		}
		url && Taro.navigateTo({
			url
		})

	}

	render() {
		let {printEntranceAss} = this.props

		return (
			<View className='middle'>

				{
					printEntranceAss && printEntranceAss.map((src, i) => {
						return (
							<View className='pic1' key={i}>
								<Image className='demo-text-4' onClick={this.toPrint.bind(this, i)} src={src.src}>
								</Image>
								<View className='title'>
									{src.title}
								</View>
								<View className='title_sub'>
									{src.title_sub}
								</View>

							</View>
						)
					})
				}

			</View>

		)
	}
}

export default PrintAss