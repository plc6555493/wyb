import Taro, {Component} from '@tarojs/taro'
import {View, Text, Button, Image, OpenData, Input} from '@tarojs/components'
import './index.css'
import {API_V1, ebGetLocalStorage, ebRequest, ebSetTitleAndReturnState, ebGetRouterParams, ebPay, ebShowToast, ebFilePreview} from "../../../../utils"
import pic1 from '../../../../asset/image/printPhoto.png'
import pic2 from '../../../../asset/image/printOrder.png'
import plus from '../../../../asset/image/square_plus.png'
import reduce from '../../../../asset/image/square_reduce.png'
import backImg from '../../../../asset/image/back.png'

let self = null;

export default class PrintOrderCreate extends Component {
	constructor(props) {
		super(props);
		self = this;
		this.state = {
			params: {},
			file_pages: 0,
			previewSrc: ""
		}
	}

	componentDidMount() {
		ebSetTitleAndReturnState(this);
		//获得地址栏参数
		let params = ebGetRouterParams(this);
		console.log('获得地址栏参数:', params);

		let {file, num, price, print_type} = params;
		let fileObj = JSON.parse(file);
		let {file_url, file_pages, file_id, ext} = fileObj;

		self.setState({
			params,
			file_pages,
			previewSrc: file_url,
			ext
		})

	}

	onReduce() {
		let {params} = self.state;
		let num = parseInt(params.num);
		if (num > 1) {
			num -= 1;
			params.num = num;
			self.setState({
				params
			})
		} else {
			return ebShowToast("打印份数，不能再少啦！")
		}
	};

	onPlus() {

		let {params} = self.state;
		let num = parseInt(params.num);
		if (num < 99) {
			num += 1;
			params.num = num;
			self.setState({
				params
			})
		} else {
			return ebShowToast("打印份数，不能再多啦！")
		}
	}

	toPay() {
		//获取参数
		let params = ebGetRouterParams(this);
		console.log('params', params);
		let {file, num, price, print_type} = params;
		console.log('file', file);
		let fileObj = JSON.parse(file);
		let {file_url, file_pages, file_id} = fileObj;
		self.setState({
			params
		});
		//创建订单
		let token = ebGetLocalStorage('EB_TOKEN');
		let data = {file_id, file_num: num, print_type,};
		let option = {data, token, method: 'POST'};
		ebRequest('/wxmin/' + API_V1 + 'order/create', option, function (res) {
			if (res.status) {
				console.log('创建订单成功');
				console.log(res.data);
				let {oid} = res.data;
				ebPay(oid)
			}
		})


	}

	inputNum(e) {
		let {params} = self.state;
		if (e.detail.value == 0 || e.detail.value == "") {
			return ebShowToast("打印份数格式错误");
		}
		params.num = e.detail.value;
		self.setState({
			params,
		})
	}

	/**
	 * 文件预览
	 */
	onPreview() {
		ebFilePreview(self.state)
	}

	render() {
		let {params, file_pages} = this.state;

		// 消费金额，优惠价格。订单价格

		let priceAll = parseFloat(params.num * params.price).toFixed(2) * file_pages;
		let priceDiscount = (priceAll - 0.01).toFixed(2)
		let priceFinal = 0.01

		return (

			<View className="back">

				<Image src={backImg} className="backImg"/>

				<View className="order">
					<View className="title">
						<Image src={params.print_type === '30' ? pic1 : pic2} className="pic"/>
						<Text style={{float:"left"}}>{params.print_type === '30'|| params.print_type === '40'|| params.print_type === '50' ? '照片打印':'文档打印'}</Text>
						<View className="preview" onClick={this.onPreview}>点此预览</View>
					</View>
					<View className="middle">
						<View className="point">
							<Text className="pointL">打印内容</Text>
							<Text className="pointR">{params.print_type === '30' ? '7寸彩色照片' :
								(params.print_type === '11' || params.print_type === '21' ? '黑白打印' :
									(params.print_type === '40' ? '1寸彩色照片' :
										(params.print_type === '50' ? '2寸彩色照片' :
											(params.print_type === '12' ? '彩色打印' :
							null))))}</Text>
						</View>
						<View className="type">
							<Text className="typeL">打印规格</Text>
							<Text className="typeR">{params.print_type === '30'|| params.print_type === '40'|| params.print_type === '50' ? '高清7寸照片纸' :
								(params.print_type === '11' || params.print_type === '12' ? 'A4' :
									(params.print_type === '21' ? 'A3' : null))}</Text>
						</View>

						<View className="pages">

							<Text className="pagesL">打印页数</Text>
							<Text className="pagesR">{file_pages}</Text>

						</View>

						<View className="copies">
							<Text className="copiesL">打印份数</Text>
							<View>
								<Image src={reduce} className="change1" onClick={this.onReduce}/>
								<View className="copiesR">
									{/*1~99*/}
									<Input className='inputNum'
												 value={params.num}
												 type='number'
												 placeholder=''
												 maxLength={2}
												 onInput={this.inputNum}/>
								</View>
								<Image src={plus} className="change2" onClick={this.onPlus}/>
							</View>
						</View>

						<View className="money">
							<Text className="moneyL">消费金额</Text>
							<Text className="moneyR">￥{priceAll}</Text>
						</View>
						{/*<View className="coupon">*/}
						{/*<Text className="couponL">优惠券</Text>*/}
						{/*<Text className="couponR">纸巾机3元代金券<Text className='more'>〉</Text></Text>*/}
						{/*</View>*/}
					</View>
					<View className="footer">
						<View className="couponPrice">
							<Text className="couponPriceL">优惠价格：</Text>
							<Text className="couponPriceR">￥{priceDiscount}</Text>
						</View>
						<View className="orderPrice">
							<Text className="orderPriceL">还需支付：</Text>
							<Text className="orderPriceR">￥{priceFinal}</Text>
						</View>
					</View>
				</View>

				<View className="toPay" onClick={this.toPay}>
					确认无误，前往支付
				</View>

			</View>

		)
	}
}