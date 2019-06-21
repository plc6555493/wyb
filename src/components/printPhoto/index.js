import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { bindActionCreators } from 'redux'
import './index.scss'
import { ebNavigateTo } from '../../utils'
import { AtActionSheet, AtActionSheetItem } from 'taro-ui'
import ShowMore from '../showMore'
import { initAppUpdate } from '../../store/init'
import { authorizedUpdate } from '../../store/account'
import { globalShowAuthUpdate, globalShowImagePreviewUpdate, globalChangeImageSrcUpdate } from '../../store/global'

let self = null

@connect(
  (store) => ({
    authorized: store.account.authorized
  }),
  (dispatch) => bindActionCreators({ initAppUpdate, authorizedUpdate, globalShowAuthUpdate, globalShowImagePreviewUpdate, globalChangeImageSrcUpdate }, dispatch)
)
class PicAss extends Taro.Component {
  constructor (props) {
    super(props)
    self = this
    self.state = {
      showPreview: false,
      srcPreview: null,
      isActionSheetOpened: false
    }
  }

  read (type) {
    let { authorized } = self.props
    if (!authorized) {
      self.props.globalShowAuthUpdate(true)
    } else {
      this.setState({
        type: type,
        [`isActionSheetOpened`]: true
      })
    }
  }

  toggleChangePreview (tempFilePaths) {
    let src = tempFilePaths[0]['path'] || tempFilePaths[0]
    let { showPreview } = self.state
    self.setState({
      isActionSheetOpened: false,
      showPreview: src !== undefined ? !showPreview : false,
      srcPreview: src !== undefined ? src : null
    }, () => {
      let { srcPreview, type } = self.state
      Taro.getApp().globalData.imgSrc = srcPreview
      self.props.globalChangeImageSrcUpdate(srcPreview)
      ebNavigateTo('/model/printModel/imageCropper/cropper/cropper?type=' + type)
    })
  }

  // 打开本地相册
  picClick () {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success (res) {
        // 确认上传弹窗
        self.toggleChangePreview(res.tempFilePaths)
      }
    })
  }

  // 打开相机
  cameraClick () {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        self.toggleChangePreview(res.tempFilePaths)
      }
    })
  }

  /**
   *
   */
  wechatClick () {
    Taro.chooseMessageFile({
      count: 1,
      type: 'image',
      success (res) {
        self.toggleChangePreview(res.tempFiles)
      }
    })
  }

  render () {
    let images = {}
    let config = {}

    let { dataComponent } = self.props
    if (dataComponent) {
      images = dataComponent.images
      config = dataComponent.config
    } else {
      images = { entryImage: [] }
      config = { showMore: false }
    }

    let { isActionSheetOpened } = self.state

    return (

      <View>

        <View>
          {
            images.entryImage && images.entryImage.map((v, i) => {
              return (
                v.show
                  ? <View className='pic0' key={i}>
                    <Image className='pic' onClick={this.read.bind(this, i)} src={v.src} />
                    <View className='data0'>
                      {v.title}
                    </View>
                    <View className='data1'>
                      {v.title_sub}
                    </View>
                  </View>
                  : null
              )
            })
          }

          {
            config.showMore &&
            <ShowMore />
          }

          <AtActionSheet
            isOpened={isActionSheetOpened}
            cancelText='取消'
            onCancel={this.handleCancel}
            onClose={this.handleClose}>
            <AtActionSheetItem onClick={this.picClick}>本地相册</AtActionSheetItem>
            <AtActionSheetItem onClick={this.cameraClick}>相机拍照</AtActionSheetItem>
            <AtActionSheetItem onClick={this.wechatClick}>微信照片</AtActionSheetItem>
          </AtActionSheet>
        </View>

      </View>

    )
  }
}

export default PicAss
