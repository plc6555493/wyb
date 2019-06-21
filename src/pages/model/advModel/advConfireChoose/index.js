import Taro, {Component} from '@tarojs/taro'
import {View, Button} from '@tarojs/components'
import './index.scss'
import CopyRight from '../../../../components/copyRight';
import PointBase from '../../../../components/pointBase';
import {ebNavigateTo, ebSetTitleAndReturnState,ebRequest} from '../../../../utils';
import papers from '../../../../asset/image/papers.png';


let self

export default class Index extends Component {
	constructor(props) {
		super(props);
		self = this
		self.state = {
			// 设置为空

			pointListBase: [],
			pointListExtra: [],

			totalPrice: '8999.99',
		}
	}

	//页面跳转
	toadv7() {
		//使用totalPrice之前要先对数据进行解构，因为totalPrice是一个对象，此处取totalPrice中的值
		let {totalPrice}=self.state

		ebNavigateTo('/model/advModel/advPaySuccess/index?totalPrice=' + totalPrice);
	}

	componentDidMount() {
		ebSetTitleAndReturnState(self);

		//手动模拟数据
		// let pointListBase = [
		// 	{
		// 		'title': '香格里拉大酒店',
		// 		'price': '999.99',
		// 		'num': '1',
		// 	},
		// 	{
		// 		'title': '香格里拉大酒店',
		// 		'price': '999.99',
		// 		'num': '1',
		// 	},
		// 	{
		// 		'title': '香格里拉大酒店',
		// 		'price': '999.99',
		// 		'num': '1',
		// 	}
		// ]

		// let pointListExtra = [
		// 	{
		// 		'title': '香格里拉大酒店',
		// 		'price': '999.99',
		// 		'num': '2',
		// 	},
		// 	{
		// 		'title': '香格里拉大酒店',
		// 		'price': '999.99',
		// 		'num': '2',
		// 	}
		// ]
		// 将空的转换为包含上面参数的对象
		// self.setState({pointListBase,pointListExtra})
		//手动模拟数据

		//mock自动模拟数据
		//mockIndex:2为'../../../../utils'路径下mock_api选择第三个API_MOCK_ZC
		// ebRequest('/pointBase', {mock: true,mockIndex:2}, (res) => {
		// 	let pointListBase = res.data.list
		// 	// 将空的转换为包含上面参数的对象
		// 	self.setState(
		// 		{pointListBase}
		// 	)
		// }),
		// ebRequest('/pointExtra', {mock: true,mockIndex:2}, (res) => {
		// 	let pointListExtra = res.data.list
		// 	// 将空的转换为包含上面参数的对象
		// 	self.setState(
		// 		{pointListExtra}
		// 	)
		// })
		//mock自动模拟数据
		//mock自动模拟数据1
		ebRequest('/point', {mock: true,mockIndex:2}, (res) => {
			let pointListBase = res.data.list.filter((value, index, arr) => {
				if(value.sid <= 10)
				return value
			})
			let pointListExtra = res.data.list.filter((value, index, arr) => {
				if(value.sid > 10)
				return value
			})
			// 将空的转换为包含上面参数的对象
			self.setState(
				{pointListBase,pointListExtra}
			)
		})
		//mock自动模拟数据1
	}

	render() {
		// 申明变量，将已经转换的self赋值到申明的变量上，在render中使用
		let {pointListBase, pointListExtra} = self.state

		return (
			<View style={{backgroundColor: 'white'}} className='adv5'>
				{/* 订单信息 */}
				<View className='view2'>
					{/* 行：等待付款 */}
					<View className='view2h1'>
						<Image className='img1' src={papers}></Image>
						<Text className='txt1'>WYB20190010200</Text>
					</View>
					<View className='viewLine1'></View>
					{/* 行：基础点位 */}
					<View className='view2h2'>
						<View className='txt3'>基础点位</View>
						<View>
							<PointBase pointList={pointListBase} />
						</View>

					</View>
					<View className='viewLine1'></View>
					{/* 行：额外点位 */}
					<View className='view2h3'>
						<View className='txt4'>额外点位</View>
						<View>
							<PointBase pointList={pointListExtra} />
						</View>
					</View>
					<View className='viewLine2'></View>
					{/* 行：费用（基础费用、额外支付费用、合计） */}
					<View className='view2h4'>
						<View className='price1'>
							<Text className='txt5'>基础费用</Text>
							<Text className='txt6'>3000</Text>
							<Text className='txt8'>￥</Text>
						</View>
						<View className='price2'>
							<Text className='txt5'>额外点位费用</Text>
							<Text className='txt6'>999.99</Text>
							<Text className='txt8'>￥</Text>
						</View>
						<View><Text>\n</Text></View>
						<View className='priceAll'>
							<Text className='txt7'>合计</Text>
							<Text className='txt9'>{totalPrice}</Text>
							<Text className='txt10'>￥</Text>
						</View>
						<View><Text>\n</Text></View>
					</View>
				</View>
				{/* 确认无误，前往支付 */}
				<View>
					<Button className='btnPay' onClick={this.toadv7}>确认无误，前往支付</Button>
				</View>

			</View>
		)
	}
}
