import Taro, { Component } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
import './index.scss'
import { ebGetRouterParams } from '../../../../utils'

let self

class Index extends Component {
  constructor (props) {
    super(props)
    self = this
    self.state = {
      params: {
        type: null,
        token: null
      }
    }
  }

  componentWillMount () {
    let params = ebGetRouterParams(this)
    console.log('获得地址栏参数:', params)
    self.setState({ params })
  }

  render () {
    let { params } = self.state
    let { token } = params
    let { type } = params

    let src = 'https://web.ewyb.cn/upload?type=' + type + '&token=' + token

    return (
      <View>
        <WebView src={src} />
      </View>
    )
  }
}
