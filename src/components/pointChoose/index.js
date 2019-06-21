import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

let self = null

class PointChoose extends Taro.Component {
  constructor (props) {
    super(props)
    self = this
  }

  handleChange (k) {
    self.props.handleChange && this.props.handleChange(k)
  }

  render () {
    let { listSelect, vip, hoo, add } = this.props
    return (
      <View className='index'>
        {
          listSelect.map((v, k) => {
            return (
              <View className='block' TaroKey={k}>
                <Image className='hotel' src={v.image} />
                <View className='name'>{v.title}</View>
                {v.vip ? <Image className='vip' src={vip} /> : null}
                <View className='adr'>{v.address}</View>
                <View className='num'>
                  <View className='data'>剩余绑定名额99</View>
                </View>
                <View className='rmb'>¥ 999.99</View>
                <Image className='add' onClick={this.handleChange.bind(this, k)} src={v.checked ? hoo : add} />
              </View>
            )
          })
        }
      </View>
    )
  }
}

export default PointChoose
