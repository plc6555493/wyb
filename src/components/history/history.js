import Taro, {Component} from '@tarojs/taro'
import {View, Text, Button, Image, OpenData} from '@tarojs/components'
import './history.css'
import orderBack from '../../asset/image/orderBack.png'
import pic1 from '../../asset/image/printOrder.png'
import pic2 from '../../asset/image/printPhoto.png'
import {AtSwipeAction} from "taro-ui";

const OPTIONS1 = [
	{
		text: '取消',

		style: {
			color: '#333',
			backgroundColor: '#F7F7F7'
		}
	},
];
const OPTIONS2 = [
	{
		text: '删除',
		style: {

			backgroundColor: '#E93B3D'
		},
	},
];

export default class History extends Taro.Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	onOrderLeftClick(k) {
		this.props.onOrderLeftClick && this.props.onOrderLeftClick(k)
	}
	onOrderRightClick(k) {
		this.props.onOrderRightClick && this.props.onOrderRightClick(k)
	}
	handleSwipeClick(v,k){
		this.props.handleSwipeClick&& this.props.handleSwipeClick(v,k)
	}

	render() {
		let {taskList, thisListDisplay, title_state} = this.props;
		return (
			<View className='back_big'>
				{taskList && taskList.map((v, k) => {
					if (k > 0) {
						thisListDisplay = 'display:none'
					}
					return (

						<View className='back'
									taroKey={k}
									dataOrderState={v['order_state']}
									style={v.filterOrder}
						>
							{v.order_state==='0'||v.order_state==='10'||v.order_state==='40'
								?<AtSwipeAction autoClose onClick={this.handleSwipeClick.bind(this,v,k)}
												options={v.order_state==='10'?OPTIONS1
													:(v.order_state==='0'||v.order_state==='40'?OPTIONS2:null)}>

									{/*订单*/}
									<Image className='orderBack' src={orderBack}/>
									<View className='left' onClick={this.onOrderLeftClick.bind(this, k)}>
										<Text className={v.order_state === '40' ? 'statusL1'
											: (v.order_state === '10' ? 'statusL2' : (v.order_state === '0' ? 'statusL3' : null))}/>
										<View className='radius'>
											<Image className='pic' src={v.print_type === '11'|| v.print_type === '12'? pic1 : pic2}/>
										</View>
									</View>

									<View className='right' onClick={this.onOrderRightClick.bind(this, k)}>
										<View>
											<Text>订单号: {v.order_sn}</Text>
											<Text className={v.order_state === '40' ? 'status1'
												: (v.order_state === '10' ? 'status2' : (v.order_state === '0' ? 'status3' : null))}>
												{title_state[v.order_state]}
											</Text>
										</View>
										<View>￥ {v.order_price_final}</View>
										<View>创建时间：{v.create_time}</View>
									</View>



								</AtSwipeAction>
								:
								<View>
									{/*订单*/}
									<Image className='orderBack' src={orderBack}/>
									<View className='left' onClick={this.onOrderLeftClick.bind(this, k)}>
										<Text className={v.order_state === '40' ? 'statusL1'
											: (v.order_state === '10' ? 'statusL2' : (v.order_state === '0' ? 'statusL3' : null))}/>
										<View className='radius'>
											<Image className='pic' src={v.print_type === '11'|| v.print_type === '12'? pic1 : pic2}/>
										</View>
									</View>

									<View className='right' onClick={this.onOrderRightClick.bind(this, k)}>
										<View>
											<Text>订单号: {v.order_sn}</Text>
											<Text className={v.order_state === '40' ? 'status1'
												: (v.order_state === '10' ? 'status2' : (v.order_state === '0' ? 'status3' : null))}>
												{title_state[v.order_state]}
											</Text>
										</View>
										<View>￥ {v.order_price_final}</View>
										<View>创建时间：{v.create_time}</View>
									</View>
								</View>
							}


						</View>
					)
				})}

			</View>
		)
	}
}