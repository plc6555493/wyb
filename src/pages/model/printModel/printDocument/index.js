import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { bindActionCreators } from 'redux'
import './index.scss'
import { ebGetRouterParams, ebSetTitleAndReturnState } from '../../../../utils'
import TextAss from '../../../../components/printDocument'
import { initAppUpdate } from '../../../../store/init'
import UserLogin from '../../../../components/userlogin'
import { globalShowAuthUpdate } from '../../../../store/global'
import { authorizedUpdate } from '../../../../store/account'

let self

@connect(
  (store) => ({
    scene: store.global.scene,
    authState: store.account.authorized
  }),
  (dispatch) => bindActionCreators({ initAppUpdate, globalShowAuthUpdate, authorizedUpdate }, dispatch)
)

export default class Index extends Component {
  constructor (props) {
    super(props)
    self = this
    self.state = {
      data: {}
    }
  }

  componentWillMount () {
    let params = ebGetRouterParams(this)
    let data = JSON.parse(params.data)
    self.setState({ data })
  }

  componentDidMount () {
    ebSetTitleAndReturnState(self)
    let { authState } = self.state
    this.props.globalShowAuthUpdate(!authState)
  }

  render () {
    let { data } = self.state
    let { config, readme } = data
    let { authState, scene } = self.props

    return (
      <View>
        <Text className='data0'>选择文档类型</Text>
        <TextAss dataComponent={data} className='pic' />
        <View className='clean-fix' />

        {config.readme && <View className='title'>使用说明</View>}

        <View className='data2' style={{ whiteSpace: 'pre-wrap' }}>

          {
            config.readme && readme && readme.map((v, i) => {
              return (
                <View className='pic1' key={i}>
                  {i}. {v}
                </View>
              )
            })
          }

        </View>

        {
          authState ? null : <UserLogin authState={authState} sceneState={scene} />
        }

      </View>
    )
  }
}
