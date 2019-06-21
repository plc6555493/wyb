import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'
import { ebGetLocalStorageInit } from '../../utils'

let self = null

class CopyRight extends Taro.Component {
  constructor (props) {
    super(props)
    self = this
  }

  componentWillMount () {
    let init = ebGetLocalStorageInit()
    console.log(init)
  }

  render () {
    let { tabbar } = self.props
    return (
      <View className={tabbar ? 'copyright-tabbar' : 'copyright'} style={{ textAlign: 'center' }} />
    )
  }
}

export default CopyRight
