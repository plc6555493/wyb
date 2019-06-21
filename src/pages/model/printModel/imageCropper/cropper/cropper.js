import {ebNavigateTo, ebSetTitleAndReturnState, ebShowLoading, ebShowModal, ebShowToast, ebUploadFile, ebHideLoading} from '../../../../../utils'
var imageRotate = '/asset/image/rotate.png'
var imageRotate1 = '/asset/image/rotate1.png'
var t = getApp()

Page({
  data: {
    src: '',
    width: 250,
    height: 350,
    max_width: 300,
    max_height: 400,
    export_scale: 3,
    disable_rotate: true,
    limit_move: true,
    disable_ratio: true,
    hint: '7寸打印 使用7寸照片纸',
    imageRotate,
    imageRotate1
  },
  onLoad: function () {
    let self = this
    ebSetTitleAndReturnState(self)
    let { type } = self.options
    console.log('onLoad type:' + type)

    switch (type) {
      case '3':
        // this.setData({
        //   width: 250,
        //   height: 350,
        //   max_width: 300,
        //   max_height: 400
        // })
        // 7寸打印
        break
      case '4':
        // 1寸打印
        self.setData({
          width: 295 / 1.5,
          height: 413 / 1.5,
          max_width: 295,
          max_height: 413,
          hint: '1寸打印 使用7寸照片纸'
        })
        break
      case '5':
        // 2寸打印
        self.setData({
          width: 413 / 2,
          height: 626 / 2,
          max_width: 413 / 1.5,
          max_height: 626 / 1.5,
          hint: '2寸打印 使用7寸照片纸'
        })
        break
    }

    this.cropper = this.selectComponent('#image-cropper'); this.setData({
      src: t.props.srcImagePreview
    }); t.globalData.imgSrc = t.props.srcImagePreview
  },
  cropperload: function (t) {
    console.log('cropper加载完成')
  },
  loadimage: function (t) {
    console.log('图片加载，自动调整中')
    this.cropper.imgReset()
  },
  clickcut: function (t) {
    // console.log(t.detail); wx.previewImage({
    //   current: t.detail.url,
    //   urls: [t.detail.url]
    // })
  },
  setWidth: function (t) {
    this.setData({
      width: t.detail.value < 10 ? 10 : t.detail.value
    }); this.setData({
      cut_left: this.cropper.data.cut_left
    })
  },
  setHeight: function (t) {
    this.setData({
      height: t.detail.value < 10 ? 10 : t.detail.value
    }); this.setData({
      cut_top: this.cropper.data.cut_top
    })
  },
  switchChangeDisableRatio: function (t) {
    this.setData({
      disable_ratio: t.detail.value
    })
  },
  setCutTop: function (t) {
    this.setData({
      cut_top: t.detail.value
    }); this.setData({
      cut_top: this.cropper.data.cut_top
    })
  },
  setCutLeft: function (t) {
    this.setData({
      cut_left: t.detail.value
    }); this.setData({
      cut_left: this.cropper.data.cut_left
    })
  },
  switchChangeDisableRotate: function (t) {
    t.detail.value ? this.setData({
      disable_rotate: t.detail.value
    }) : this.setData({
      limit_move: !1,
      disable_rotate: t.detail.value
    })
  },
  switchChangeLimitMove: function (t) {
    t.detail.value && this.setData({
      disable_rotate: !0
    }); this.cropper.setLimitMove(t.detail.value)
  },
  submit: function () {
    var th = this
    this.cropper.getImg(function (e) {
      t.props.globalChangeImageSrcUpdate(e.url)
      t.globalData.imgSrc = e.url
      th.confirmToUpload(e.url)
    })
  },
  confirmToUpload (tempFilePaths) {
    var self = this
    if (tempFilePaths) {
      let { type } = self.options
      console.log('type:' + type)

      let content = '是确认上传,否取消上传'

      ebShowModal({ title: '是否确认上传该文件', content }, () => {
        ebShowLoading('处理中，请稍后')
        ebUploadFile({ filePath: tempFilePaths, outType: type }, function (res) {
          if (res.status) {
            ebHideLoading()
            let data1 = res.data
            let file = JSON.stringify(data1['file'])

            ebNavigateTo('/model/printModel/printOrderCreate/index?num=1' + '&print_type=' + type + 0 + '&file=' + file + '&price=0.01')
          }
        })
      })
    } else {
      ebShowToast('选择文件出错，请重试')
    }
  },

  rotate: function (a) {
    const type = a.target.dataset.type
    const angle = type === 'rotateInverted' ? this.cropper.data.angle -= 90 : this.cropper.data.angle += 90
    this.cropper.setAngle(angle)
  },
  top: function () {
    var t = this
    this.data.top = setInterval(function () {
      t.cropper.setTransform({
        y: -3
      })
    }, 1e3 / 60)
  },
  bottom: function () {
    var t = this
    this.data.bottom = setInterval(function () {
      t.cropper.setTransform({
        y: 3
      })
    }, 1e3 / 60)
  },
  left: function () {
    var t = this
    this.data.left = setInterval(function () {
      t.cropper.setTransform({
        x: -3
      })
    }, 1e3 / 60)
  },
  right: function () {
    var t = this
    this.data.right = setInterval(function () {
      t.cropper.setTransform({
        x: 3
      })
    }, 1e3 / 60)
  },
  narrow: function () {
    var t = this
    this.data.narrow = setInterval(function () {
      t.cropper.setTransform({
        scale: -0.02
      })
    }, 1e3 / 60)
  },
  enlarge: function () {
    var t = this
    this.data.enlarge = setInterval(function () {
      t.cropper.setTransform({
        scale: 0.02
      })
    }, 1e3 / 60)
  },
  end: function (t) {
    clearInterval(this.data[t.currentTarget.dataset.type])
  }
})
