import Taro from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import './index.scss';
import {ebGetLocalStorageInit} from "../../utils";

let self = null;

class PointBase extends Taro.Component {
	constructor(props) {
		super(props);
		self = this;
	}

	componentWillMount() {

	}

	render() {
		let {pointList}=this.props
		return (
			<View>
			{
				pointList.map((v,k)=> {
					return (
						<View className='pointBase1'>
							<Text className='txt1'>{v.title}</Text>
							<Text className='txt2'>{v.price}</Text>
							<Text className='txt3'>￥</Text>

							{/* 编号1：用于区分 基础点位、额外点位 */}
							{/* 手动模拟数据 */}
							{/* <Text className='txt4'>{v.num}</Text> */}
							{/* 手动模拟数据 */}

							{/* 自动模拟数据 */}
							<Text className='txt4'>{v.sid}</Text>
							{/* 自动模拟数据 */}
						</View>
					)
				})
			}

			</View>
		)
	}
}

export default PointBase