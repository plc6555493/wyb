import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

/**
 * 营销类活动
 */
class ActivityMarketing extends Taro.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { text } = this.props
    return (
      <View className='bottom'>{text || '营销类活动'}</View>
    )
  }
}

export default ActivityMarketing
