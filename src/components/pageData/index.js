import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'
import emptyList from '../../asset/image/emptyList.png'

class PageData extends Taro.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <View>
        <Image className='defaultPage' src={emptyList} />
      </View>
    )
  }
}
export default PageData
