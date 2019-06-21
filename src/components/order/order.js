import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './order.css'
import orderBack from '../../asset/image/orderBack.png'
import hook from '../../asset/image/greenHook.png'
import pic1 from '../../asset/image/printPhoto.png'
import pic2 from '../../asset/image/printOrder.png'

export default class Order extends Taro.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  onSelect (k) {
    this.props.onSelect && this.props.onSelect(k)
  }

  render () {
    let { taskList } = this.props
    return (
      <View>
        {taskList && taskList.map((v, k) => {
          return (

            <View className='back' onClick={this.onSelect.bind(this, k)} taroKey={k}>
              <Image className='orderBack' src={orderBack} />

              <View className='left'>
                <View className='radius' style={v.backColor}>
                  <Image className='pic' src={v.print_type === '30' ? pic1 : pic2} />
                  <Image className='hook' src={hook} style={v.displayHook || 'display:none'} />
                </View>
              </View>

              <View className='right'>
                <View>
                  <Text>订单号: {v.order_sn}</Text>
                  <Text>{v.order_state === '20' ? '已付款' : null}</Text>
                </View>
                <View>￥ {v.order_price_final}</View>
                <View>创建时间：{v.create_time}</View>
              </View>
            </View>
          )
        })}

      </View>
    )
  }
}
