import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image, OpenData } from '@tarojs/components'
import './issuesSubmitSuccess.css'
import { API_V1, ebGetLocalStorage, ebGetRouterParams, ebReLaunch, ebRequest, ebScanCode, ebSetTitleAndReturnState } from '../../../../utils'
import greenHook from '../../../../asset/image/greenHook.png'

export default class IssuesSubmitSuccess extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    ebSetTitleAndReturnState(this)
  }


  goIndex () {
    ebReLaunch()
  }

  render () {
    return (
      <View>
        {/* <View className="head"> */}
        {/* <OpenData className="head-left" */}
        {/* type="userAvatarUrl" */}
        {/* /> */}
        {/* <Image className="head-right" */}
        {/* src="../../../../asset/image/msg.png" */}
        {/* /> */}
        {/* </View> */}
        <View className='body'>
          <Image className='body1' src={greenHook} />
          <View className='body2'>提交成功</View>
          <View className='body3'> 您所反馈的问题已经提交，处理结果将会发送到留下的联系方式！</View>
        </View>
        <View className='foot'>
          <Button className='foot-inner'
            onClick={this.goIndex}
          >返回首页</Button>

        </View>
        {/* 营销类活动 */}

      </View>
    )
  }
}
