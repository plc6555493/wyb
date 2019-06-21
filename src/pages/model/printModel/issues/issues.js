import { Component } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import './issues.css'
import { ebGetRouterParams, ebSetTitleAndReturnState,ebNavigateTo } from '../../../../utils'

let self = null

export default class Issues extends Component {
  constructor (props) {
    super(props)
    self = this
    this.state = {
      sn: '',
      contactInformationValue: '',
      placeholderStyle: 'color: #CCCCCC',
      pickerSelected: '',
      pickerArray: ['订单类型', '订单价格', '打印卡纸'],
      issuesDescribe: '',
      phoneNumber: ''
    }
  }
  componentDidMount () {
    ebSetTitleAndReturnState(self, '问题反馈')
    console.log('123', self.$router.params)
    let { sn } = self.$router.params
    self.setState({
      sn
    })
  }
  onPicker = e => {
    console.log('picker发送选择改变，携带值为', e)
    self.setState({
      pickerSelected: self.state.pickerArray[e.detail.value]
    })
  }
  submitIssuesDescribe=e => {
    console.log(e)
    self.setState({
      issuesDescribe: e.detail.value
    })
  }
  submitPhoneNumber= e => {
    console.log(e)
    self.setState({
      phoneNumber: e.detail.value
    })
  }
  onSubmit () {
    let { pickerSelected, sn, issuesDescribe, phoneNumber } = self.state
    let strLength = phoneNumber.length
    console.log(strLength)
    if (pickerSelected !== '' &&
      sn !== '' &&
     issuesDescribe !== '' &&
      strLength === 11) {
      console.log('提交', pickerSelected, sn, issuesDescribe, phoneNumber)
      ebNavigateTo('/model/printModel/issuesSubmitSuccess/issuesSubmitSuccess')
    } else {
      console.log('请填写完整')
      Taro.showToast({
        title: '请填写完整',
        icon: 'none'
      })
    }
  }
  render () {
    let { pickerArray, pickerSelected, sn, contactInformationValue, placeholderStyle } = self.state
    return (
      <View>
        <View className='head'>
          <Text>您好，欢迎给我们提出使用中遇到的问题或宝贵的建议！</Text>
        </View>
        <View className='body'>
          {/* 问题类型 */}
          <View className='issues-type'>
            <Text className='title'>问题类型：</Text>
            <Picker
              className='allInput'
              mode='selector'
              value={0}
              range={pickerArray}
              onChange={this.onPicker}
            >
              <View className='pickerInner'>
                <Text className='pickerContent'>
                  {pickerSelected}
                </Text>
                <Text className='arrow' />
              </View>
            </Picker>
            <Text className='star'>*</Text>
          </View>
          {/* 订单编号 */}
          <View className='order-id'>
            <Text className='title'>订单编号：</Text>
            <Input
              placeholder={sn}
              style='color:#DDDDDD'
              disabled
              className='allInput'
              type='text' />
            <Text className='star'>*</Text>
          </View>
          <View className='issues-describe'>
            <View>
              <Text className='title'>问题描述：</Text>
              <Text className='star'>*</Text>
            </View>
            <Textarea className='textarea'
              placeholder={'请描述您所遇到的问题……'}
              placeholderStyle={placeholderStyle}
              maxlength={-1}
              showConfirmBar
              onBlur={self.submitIssuesDescribe}
            />
          </View>
          <View className='contact-information'>
            <Text className='title'>联系方式：</Text>
            <Input
              className='allInput'
              type='number'
              value={contactInformationValue}
              maxLength={11}
              placeholder='请输入手机号码'
              placeholderStyle={placeholderStyle}
              onBlur={self.submitPhoneNumber}
            />
            <Text className='star'>*</Text>
          </View>
          <Button className='submit' onClick={this.onSubmit}>
            确认提交
          </Button>
        </View>
        <View className='tip'>
          <View className='a'>常见问题：</View>
          <View className='tip-content'>
            <View>
              <View>1. 订单状态显示“已完成”，实际任务并未完成。</View>
              <View>答：可通过为题反馈渠道，描述您所遇到的问题，过程中可能需要订单号，可在订单列表中查看您的订单号，提交后我们将会在1小时内处理完成。</View>
            </View>
            <View>
              <View> 2. 订单状态显示“已完成”，实际任务并未完成。</View>
              <View>答：可通过为题反馈渠道，描述您所遇到的问题，过程中可能需要订单号，可在订单列表中查看您的订单号，提交后我们将会在1小时内处理完成。</View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
