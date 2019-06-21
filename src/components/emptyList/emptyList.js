import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './emptyList.css'
import emptyList from '../../asset/image/emptyList.png'

export default class EmptyList extends Taro.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { orderList } = this.props
    // console.log('12',this.props.emptyListDisplay);==undefined
    let a = 0
    if (orderList) {
      for (let i = 0; i < orderList.length; i++) {
        // console.log('order_state:'+orderList[i].order_state)
        if (orderList[i].order_state === '1') {
          a++
        }
      }
    }
    // (emptyListDisplay===undefined ? a===0:emptyListDisplay) ?emptyListDisplay:{display:'none'}

    return (
      <View>
        <Image
          className='emptyList'
          src={emptyList}
          style={
            this.props.emptyListDisplay === undefined ? (a > 0 ? { display: 'none' } : { display: 'block' }) : this.props.emptyListDisplay
          }
        />
      </View>

    )
  }
}
