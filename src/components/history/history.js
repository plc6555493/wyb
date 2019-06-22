import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './history.css'
import orderBack from '../../asset/image/orderBack.png'
import pic1 from '../../asset/image/printOrder.png'
import pic2 from '../../asset/image/printPhoto.png'
import issues from '../../asset/image/issues.png'
import { AtSwipeAction } from 'taro-ui'
import Loading from '../loading'

let self = null
export default class History extends Taro.Component {
  constructor (props) {
    super(props)
    self = this
    self.state = {
      showOrderBack: false
    }
  }

  onOrderLeftClick (k) {
    this.props.onOrderLeftClick && this.props.onOrderLeftClick(k)
  }
  onOrderRightClick (k) {
    this.props.onOrderRightClick && this.props.onOrderRightClick(k)
  }
  handleSwipeClick (v, k) {
    this.props.handleSwipeClick && this.props.handleSwipeClick(v, k)
  }
  onToIssues (k) {
    this.props.onToIssues && this.props.onToIssues(k)
  }
  onStopPropagation () {
    this.props.onStopPropagation()
  }
  onLoadOrderBack (a, b) {
    self.setState(
      {
        showOrderBack: true
      }
    )
  }
  render () {
    let showLoadingTitle = '加载中...'

    let { showOrderBack } = self.state
    let { taskList, thisListDisplay, titleState, OPTIONS1, OPTIONS2, showIssues, showLoading, haveNoMore } = this.props

    return (
      <View className='back_big'>
        {taskList && taskList.map((v, k) => {
          thisListDisplay = k > 0 ? 'display:none' : thisListDisplay
          return (

            <View className='back'
              taroKey={k}
              dataOrderState={v['order_state']}
              style={v.filterOrder}
            >
              {v.order_state === '0' || v.order_state === '10' || v.order_state === '40'
                ? <AtSwipeAction autoClose onClick={this.handleSwipeClick.bind(this, v, k)}
                  options={v.order_state === '10' ? OPTIONS1
                    : (v.order_state === '0' || v.order_state === '40' ? OPTIONS2 : null)}>

                  {/* 订单 */}
                  <Image className='orderBack' src={orderBack}
                    onLoad={this.onLoadOrderBack.bind(this)}
                    style={{ backgroundColor: showOrderBack ? 'rgba(0,0,0,.07)' : '#fff' }} />
                  <View className='left' onClick={this.onOrderLeftClick.bind(this, k)}>
                    <Text className={v.order_state === '40' ? 'statusL1'
                      : (v.order_state === '10' ? 'statusL2' : (v.order_state === '0' ? 'statusL3' : null))} />
                    <View className='radius'>
                      <Image className='pic' src={v.print_type === '11' || v.print_type === '12' ? pic1 : pic2} />
                    </View>
                  </View>

                  <View className='right' onClick={this.onOrderRightClick.bind(this, k)}>
                    <View className='right-first'>
                      <Text>订单号: {v.order_sn}</Text>
                      <Text className={v.order_state === '40' ? 'status1'
                        : (v.order_state === '10' ? 'status2' : (v.order_state === '0' ? 'status3' : null))}>
                        {titleState[v.order_state]}
                      </Text>
                    </View>
                    <View className='right-second'>￥ {v.order_price_final}</View>
                    <View className='right-third'>
                      <View className='time'>创建时间：{v.create_time}</View>
                    </View>
                  </View>
                  {
                    showIssues &&
                    <View className='issues-outer' onClick={this.onToIssues.bind(this, k)}>
                      <Image className='issues' src={issues} />
                    </View>
                  }
                </AtSwipeAction>
                : <View>
                  {/* 订单 */}
                  <Image className='orderBack' src={orderBack}
                    onLoad={this.onLoadOrderBack.bind(this)}
                    style={{ backgroundColor: showOrderBack ? 'rgba(0,0,0,.07)' : '#fff' }} />

                  <View className='left' onClick={this.onOrderLeftClick.bind(this, k)}>
                    <Text className={v.order_state === '40' ? 'statusL1'
                      : (v.order_state === '10' ? 'statusL2' : (v.order_state === '0' ? 'statusL3' : null))} />
                    <View className='radius'>
                      <Image className='pic' src={v.print_type === '11' || v.print_type === '12' ? pic1 : pic2} />
                    </View>
                  </View>

                  <View className='right' onClick={this.onOrderRightClick.bind(this, k)}>
                    <View className='right-first'>
                      <Text>订单号: {v.order_sn}</Text>
                      <Text className={v.order_state === '40' ? 'status1'
                        : (v.order_state === '10' ? 'status2' : (v.order_state === '0' ? 'status3' : null))}>
                        {titleState[v.order_state]}
                      </Text>
                    </View>
                    <View className='right-second'>￥ {v.order_price_final}</View>
                    <View className='right-third'>
                      <View className='time'>创建时间：{v.create_time}</View>
                    </View>
                  </View>
                  {
                    showIssues &&
                    <View className='issues-outer' onClick={this.onToIssues.bind(this, k)}>
                      <Image className='issues' src={issues} />
                    </View>
                  }
                </View>
              }
            </View>
          )
        })}
        <Loading
          showLoading={showLoading}
          showLoadingTitle={showLoadingTitle}
          haveNoMore={haveNoMore}
        />
      </View>
    )
  }
}
