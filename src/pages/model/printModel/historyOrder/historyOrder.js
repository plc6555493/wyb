import { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './historyOrder.css'
import History from '../../../../components/history/history.js'
import { API_V1, ebGetLocalStorage, ebPay, ebRequest, ebScanCode, ebSetTitleAndReturnState, ebShowModal, ebShowToast, ebPrintTaskCreate, ebFilePreview, orderPrintUpdate, ebNavigateTo } from '../../../../utils'
import emptyList from '../../../../asset/image/emptyList.png'
import { AtActivityIndicator } from 'taro-ui'

let self = null

export default class HistoryOrder extends Component {
  constructor (props) {
    super(props)
    self = this
    this.state = {
      loading: true,
      taskList: [],
      title: [],
      chooseTitle: [],
      titleKey: null,
      thisListDisplay: 'display:none',
      OPTIONS1: [
        {
          text: '取消',
          style: {
            color: '#333',
            backgroundColor: '#F7F7F7'
          }
        }
      ],
      OPTIONS2: [
        {
          text: '删除',
          style: {

            backgroundColor: '#E93B3D'
          }
        }
      ]
    }
  }

  componentDidMount () {
    ebSetTitleAndReturnState(self, '我的订单')
    self.filter(0)
    let token = ebGetLocalStorage('EB_TOKEN')
    let data = {}
    let option = { data, token, method: 'get' }
    ebRequest('/wxmin/' + API_V1 + 'order/', option, function (res) {
      if (res.status) {
        console.log('返回参数', res.data)
        let { title, list, title_state: titleState } = res.data

        self.setState({
          loading: false,
          title: title,
          titleState,
          taskList: list
        })
      }
    })
  };

  /**
   *
   * @param k
   * @param osd
   */
  listShowUpdate = (k, osd) => {
    let { chooseTitle, taskList } = this.state
    let thisList = 0
    let titleKey = k
    self.setState({
      thisListDisplay: 'display:none',
      titleKey
    })
    for (let j = 0; j < chooseTitle.length; j++) {
      if (j === k) {
        chooseTitle[j].choose = 'choose'
      } else {
        chooseTitle[j].choose = ''
      }
    }
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].order_state === osd) {
        thisList++
        if (thisList > 0) {
          self.setState({
            thisListDisplay: 'display:none'
          })
        } else {
          self.setState({
            thisListDisplay: 'display:block'
          })
        }
        taskList[i].filterOrder = 'display:block'
        self.setState({
          taskList: taskList,
          chooseTitle

        })
      } else {
        if (thisList === 0) {
          self.setState({
            thisListDisplay: 'display:block'
          })
        } else {
          self.setState({
            thisListDisplay: 'display:none'
          })
        }
        taskList[i].filterOrder = 'display:none'
        self.setState({
          taskList: taskList
        })
      }
    }
  }

  /**
   *
   * @param k
   */
  filter (k) {
    console.log(k)
    // 列表更新显示函数
    if (k === 0) {
      let { taskList, chooseTitle, titleKey } = this.state
      let thisList = 0
      titleKey = k
      self.setState({
        thisListDisplay: 'display:none',
        titleKey
      })
      for (let j = 0; j < chooseTitle.length; j++) {
        if (j === k) {
          chooseTitle[j].choose = 'choose'
        } else {
          chooseTitle[j].choose = ''
        }
      }
      for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].order_state !== '60') {
          thisList++
          if (thisList > 0) {
            self.setState({
              thisListDisplay: 'display:none'
            })
          } else {
            self.setState({
              thisListDisplay: 'display:block'
            })
          }
          taskList[i].filterOrder = 'display:block'
          self.setState({
            taskList: taskList,
            chooseTitle

          })
        } else {
          if (thisList === 0) {
            self.setState({
              thisListDisplay: 'display:block'
            })
          } else {
            self.setState({
              thisListDisplay: 'display:none'
            })
          }
          taskList[i].filterOrder = 'display:none'
          self.setState({
            taskList: taskList
          })
        }
      }
    } else if (k === 1) {
      self.listShowUpdate(k, '40')
    } else if (k === 2) {
      self.listShowUpdate(k, '10')
    } else if (k === 3) {
      self.listShowUpdate(k, '20')
    } else if (k === 4) {
      self.listShowUpdate(k, '0')
    }
  }

  /**
   *
   * @param k
   */
  handleOrderRightClick (k = '') {
    let title = ''
    let content = ''
    let optionsModel = {}

    let { taskList } = self.state
    switch (taskList[k].order_state) {
      case '20':
        title = '是否扫码取件'
        content = '是，请扫描屏幕下方的二维码'
        optionsModel = { content, title }
        ebShowModal(optionsModel, () => {
          ebScanCode((res1) => {
            console.log('扫码成功')
            console.log(res1.result)
            let token = ebGetLocalStorage('EB_TOKEN')
            let data = { machine_code: res1.result }
            let option = { data, token, method: 'GET' }
            ebRequest('/wxmin/' + API_V1 + 'order/', option, function (res) {
              if (res.status) {
                // 调用打印接口
                let token = ebGetLocalStorage('EB_TOKEN')
                let { order_id: oid } = taskList[k]
                let data = { oid, machine_code: res1.result }
                let option = { data, token, method: 'POST' }
                ebPrintTaskCreate(option)
              }
            })
          })
        })
        break
      case '10':
        let osn = taskList[k].order_sn
        let oid = taskList[k].order_id
        title = '是否确认支付该订单'
        content = '订单编号：' + osn + '\r\n 是，确认支付；否，取消支付'
        optionsModel = { content, title }
        ebShowModal(optionsModel, () => {
          ebPay(oid)
        })
        break
    }
  }

  /**
   * 文件预览
   */
  handleOrderLeftClick (k = '') {
    let { taskList } = self.state
    switch (taskList[k].order_state) {
      case '20':
      case '10':
        let previewSrc = taskList[k]['file_url']
        let ext = taskList[k]['file_info_ext']
        ebFilePreview({ previewSrc, ext })
        break
      default:
        ebShowToast('订单状态不支持预览')
        break
    }
  }

  handleSwipeClick = (v, k) => {
    console.log('触发了点击', v, k)
    let { taskList, titleKey } = self.state
    let title = ''
    let content = ''
    let optionsModel = {}
    let osn = taskList[k].order_sn
    let { order_state: orderState, order_id: oid } = taskList[k]
    // this.showToast(`点击了${item.text}按钮`)
    switch (orderState) {
      case '10':
        title = '是否取消此订单？'
        content = '订单编号：' + osn + '\r\n 是，确认取消此订单'
        optionsModel = { content, title }
        ebShowModal(optionsModel, () => {
          let orderStateNew = '0'
          let options = { orderState: orderStateNew, oid }
          orderPrintUpdate(options, () => {
            taskList[k].order_state = orderStateNew
            self.setState({
              taskList
            })
            if (titleKey !== 0) {
              self.filter(2)
            } else {
              self.filter(0)
            }
          })
        })
        break
      case '0':
      case '40':
        title = '是否删除此订单？'
        content = '订单编号：' + osn + '\r\n 是，确认删除此订单'
        optionsModel = { content, title }
        ebShowModal(optionsModel, () => {
          let orderStateNew = '60'
          let options = { orderState: orderStateNew, oid }
          orderPrintUpdate(options, () => {
            taskList[k].order_state = orderStateNew
            self.setState({
              taskList
            })
            switch (titleKey) {
              case 0:
                self.filter(0)
                break
              case 1:
                self.filter(1)
                break
              case 4:
                self.filter(4)
                break
            }
          })
        })
        break
    }
  }
  onToIssues (k) {
    let { taskList } = self.state
    console.log(taskList[k])
    let sn = taskList[k].order_sn
    ebNavigateTo('/model/printModel/issues/issues?sn=' + sn)
  }
  onStopPropagation (e) {
    e.stopPropagation()
  }

  render () {
    let { taskList, date, title, chooseTitle, thisListDisplay, titleState, loading, OPTIONS1, OPTIONS2 } = self.state

    return (

      loading ? <AtActivityIndicator mode='center' content='Loading...' />

        : <View className='back'>
          <View className='title'>
            <View className='title_inner'>
              {
                title.map((v, k) => {
                  k === 0 ? chooseTitle.push({ choose: 'choose' }) : chooseTitle.push({ choose: '' })

                  return (
                    <Text taroKey={k} onClick={this.filter.bind(this, k)}
                      className={chooseTitle[k].choose}
                    >
                      {v}
                    </Text>
                  )
                })
              }
            </View>
          </View>
          <Image className='emptyList'
            src={emptyList}
            style={taskList.length > 0 ? thisListDisplay : { display: 'block' }}
          />
          <History taskList={taskList}
            titleState={titleState}
            date={date}
            OPTIONS1={OPTIONS1}
            OPTIONS2={OPTIONS2}
            onOrderRightClick={self.handleOrderRightClick.bind(self)}
            onOrderLeftClick={self.handleOrderLeftClick.bind(self)}
            handleSwipeClick={self.handleSwipeClick.bind(self)}
            onToIssues={self.onToIssues.bind(self)}
            onStopPropagation={self.onStopPropagation.bind(self)}
          />

        </View>
    )
  }
}
