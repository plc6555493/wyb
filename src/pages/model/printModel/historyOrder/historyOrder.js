import { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './historyOrder.css'
import History from '../../../../components/history/history.js'
import { API_V1, ebGetLocalStorage, ebPay, ebRequest, ebScanCode, ebSetTitleAndReturnState, ebShowModal, ebShowToast, ebPrintTaskCreate, ebFilePreview, orderPrintUpdate, ebNavigateTo, ebShowNavigationBarLoading, ebHideNavigationBarLoading, ebStopPullDownRefresh, ebShowLoading, ebHideLoading } from '../../../../utils'
import emptyList from '../../../../asset/image/emptyList.png'
import { AtActivityIndicator } from 'taro-ui'

let self = null

export default class HistoryOrder extends Component {
  config = {
    enablePullDownRefresh: true
  };

  constructor (props) {
    super(props)
    self = this
    this.state = {
      orderState: '',
      curPage: 1,
      pageSize: 5,
      haveNoMore: false,
      isPullDown: false,
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

  componentWillMount () {
    ebSetTitleAndReturnState(self, '我的订单')
    self.filter(0)
    self.getList()
  };

  /**
   */
  getList (refresh = false, options = {}) {
    console.log('refresh', refresh)

    let {} = options

    ebShowNavigationBarLoading()

    let token = ebGetLocalStorage('EB_TOKEN')
    let { curPage, pageSize, taskList, orderState } = this.state
    curPage = refresh ? 1 : curPage

    let data = {}
    data['curPage'] = curPage
    data['pageSize'] = pageSize
    data['title'] = 1

    if (orderState !== '' && orderState !== undefined) {
      data['order_state'] = orderState
    }

    let option = { data, token, method: 'get' }
    ebRequest('/wxmin/' + API_V1 + 'order/', option, function (res) {
      if (res.status) {
        ebStopPullDownRefresh()
        ebHideNavigationBarLoading()
        ebHideLoading()
        console.log('返回参数', res.data)
        let { title, list, title_state: titleState, title_state_key: titleStateKey } = res.data
        taskList = refresh ? list : taskList.concat(list)
        self.setState({
          curPage: ++curPage,
          isPullDown: false,
          loading: false,
          showLoading: false,
          title: title,
          titleState,
          titleStateKey,
          taskList,
          haveNoMore: pageSize > list.length && taskList.length > 0
        })
        console.log('taskList length: ' + taskList.length)
      }
    })
  }

  // 页面上拉触底事件的处理函数
  // 可以在app.json的window选项中或页面配置中设置触发距离onReachBottomDistance。
  // 在触发距离内滑动期间，本事件只会被触发一次。
  // 小程序的 onReachBottom 事件不能在350ms之内频繁触发 也就是说它有350ms的频率限制
  onReachBottom = () => {
    const { showLoading, haveNoMore } = this.state
    setTimeout(function () {
      console.log('onReachBottom showLoading ', showLoading)
      if (!showLoading && !haveNoMore) {
        ebShowLoading('加载中...', true)
        self.setState({ showLoading: true }, () => {
          self.getList()
        })
      }
    }, 500)
  }

  onPullDownRefresh () {
    console.log('小程序专有 监听用户下拉动作')

    const { isPullDown } = this.state
    console.log('onPullDownRefresh isPullDown ', isPullDown)
    if (!isPullDown) {
      self.setState({ isPullDown: true }, () => {
        this.getList(true)
      })
    }
  }

  componentDidShow () {
    this.getList(true)
  }

  /**
   *
   * @param k
   * @param osd
   */
  listShowUpdate = (k, osd) => {
    let { chooseTitle } = this.state

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

    self.setState({
      orderState: osd
    }, () => {
      self.getList(true)
    })
  }

  /**
   *
   * @param k
   */
  filter (k) {
    console.log(k)
    // 列表更新显示函数
    if (k === 0) {
      self.listShowUpdate(k, '')
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
    let {
      taskList, title, chooseTitle, thisListDisplay,
      titleState, loading, OPTIONS1, OPTIONS2, showLoading, curPage, haveNoMore
    } = self.state

    console.log('curPage', curPage)
    console.log('haveNoMore', haveNoMore)
    console.log('showLoading', showLoading)

    return (

      loading ? <AtActivityIndicator mode='center' content='Loading...' />

        : <View className='back'>
          <View className='title'>
            <View className='title_inner'>
              {
                title && title.map((v, k) => {
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

          <History taskList={taskList}
            titleState={titleState}
            OPTIONS1={OPTIONS1}
            OPTIONS2={OPTIONS2}
            onOrderRightClick={self.handleOrderRightClick.bind(self)}
            onOrderLeftClick={self.handleOrderLeftClick.bind(self)}
            handleSwipeClick={self.handleSwipeClick.bind(self)}
            onToIssues={self.onToIssues.bind(self)}
            onStopPropagation={self.onStopPropagation.bind(self)}
            showIssues={false}
            showLoading={showLoading}
            haveNoMore={haveNoMore}
          />

          <Image className='emptyList'
            src={emptyList}
            style={taskList.length > 0 ? thisListDisplay : { display: 'block' }} />
        </View>
    )
  }
}
