import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.css'
import { AtDivider } from 'taro-ui'

let self = null
export default class Loading extends Taro.Component {
  constructor (props) {
    super(props)
    self = this
  }

  render () {
    let { showLoading, showLoadingTitle, haveNoMore } = this.props

    showLoadingTitle = showLoadingTitle || '加载中...'
    haveNoMore = haveNoMore || false

    return (
      <View>
        {
          haveNoMore && !showLoading && <AtDivider content='没有更多了' />
        }
        {
          showLoading &&
          <View>
            <View className='eb_loading'>
              <View className='loading' />
              <View className='noData'>{showLoadingTitle}</View>
            </View>
          </View>
        }
      </View>
    )
  }
}
