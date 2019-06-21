import Taro from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
import './index.scss'
import { ebGetRouterParams, ebSetTitleAndReturnState } from '../../../utils'

let self

export class Index extends Taro.Component {
  constructor (props) {
    super(props)
    self = this
    self.state = {
      params: {
        ebsrc: null
      }
    }
  }

  componentWillMount () {
    let params = ebGetRouterParams(this)
    self.setState({ params })
    console.log('page webview will mount')
  }

  componentDidMount () {
    ebSetTitleAndReturnState(self)
  }

  render () {
    let { ebsrc } = self.state.params

    return (
      <View>
        <WebView src={ebsrc} />
      </View>
    )
  }
}
