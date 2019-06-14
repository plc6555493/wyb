import Taro from '@tarojs/taro'

const API = 'https://api.ewyb.cn';
const API_V1 = 'v1/';
const API_HOST = API + '/wxmin';
const API_MOCK = API + '/mock';
const API_MOCK_LP = 'http://localhost:3006';
const API_MOCK_PLC = 'http://localhost:3010';
const API_MOCK_ZC = 'http://localhost:3007';
// const API_MOCK_select = API

const API_UPLOAD = 'https://upload.ewyb.cn';
const API_LOCATION = API + '/location';
const API_WS = 'wss://socket.ewyb.cn';
const ENV = Taro.getEnv() == 'WEB' ? 'H5' : Taro.getEnv();

/**
 *
 * @param act
 * @param option
 * @param callBackSuccess
 * @param callbackFail
 * @returns {boolean}
 */
const ebRequest = (act, option, callBackSuccess, callbackFail) => {
	let {token, param, data, method, mock, mock_index, showLoading} = option

	token = token || false
	param = param || ''
	data = data || {}
	method = method || 'GET'
	mock = mock || false
	showLoading = showLoading || false

	callBackSuccess = callBackSuccess || (() => {
	})

	try {

		let mock_api = [
			API_MOCK_LP,
			API_MOCK_PLC,
			API_MOCK_ZC,
			API_MOCK
		]

		let url = (!mock ? API : mock_api[mock_index]) + act + param;

		let tokenStorage = ebGetLocalStorage('EB_TOKEN');

		token && tokenStorage ? data.token = tokenStorage : null;

		if (token && !tokenStorage) {
			return false;
		}

		if (showLoading) {
			ebShowLoading('加载中')
		}

		console.log('dataTaro_url: ' + url + ' 请求数据 ', data)

		let request = {
			url,
			method,
			data,
			header: {'content-type': 'application/x-www-form-urlencoded'}
		}

		Taro.request(request)
			.then(res => (middle(res.data, callBackSuccess, url, showLoading, callbackFail)), fail => {
				ebRequestFail(fail)
			})

	} catch (e) {
		console.log(e)
	}
};


const ebRequestFail = (fail) => {
	ebHideLoading();
	let b = fail.errMsg === 'request:fail ';
	if (b) {
		console.log('noneNetWork');
		return false;
	}
}

/**
 *
 * @param res
 * @param callBackSuccess
 * @param url
 * @param showLoading
 * @param callbackFail
 */
const middle = (res, callBackSuccess, url, showLoading, callbackFail) => {

	showLoading && ebHideLoading()

	let {status} = res

	//console.log('[eb] ===========\n ', res.data, status, '======== \n')

	if (status == 1) {
		console.log('dataTaro_url: ' + url + ' 返回数据 ', res)
		callBackSuccess(res)
	} else {

		if (res.msg === 'token invalid' || res.msg === 'token empty') {

			ebShowModal({title: '提示信息', content: '登录已失效，请重新登录', showCancel: false, confirmText: '我知道了'}, () => {
				ebLogout()
			})

		} else {
			// callbackFail 处理
			if (callbackFail != undefined) {
				console.log('[eb] ===========\n ', ' 接口返回错误信息：url: ' + url + ' callbackFail: ' + res.msg, '======== \n')
				callbackFail(res)
			} else {

				// 没有处理错误回调的 打印错误日志
				console.log('[eb] ===========\n ', ' 接口返回错误信息：url: ' + url + ' msg: ' + res.msg, '======== \n')

				if (status == -1) {
					ebShowToast('操作失败', 5000)
				} else if (status == 0) {
					ebShowToast('系统忙，请稍后重试', 5000)
				} else if (status == -100) {
					ebShowToast('系统忙，请稍后重试', 5000)
				}
			}
		}
	}
}

/**
 * 同步
 * @param item
 * @returns {boolean|any|string}
 */
const ebGetLocalStorage = (item) => {
	return (ENV === 'WEAPP' && Taro.getStorageSync(item)) || (localStorage != undefined && localStorage.getItem(item))
}

/**
 * 同步
 * @param item
 * @param value
 * @returns {boolean|void}
 */
const ebSetLocalStorage = (item, value) => {
	return (ENV === 'WEAPP' && Taro.setStorageSync(item, value)) || (localStorage != undefined && localStorage.setItem(item, value))
}

/**
 * 同步
 * @returns {boolean|void}
 */
const ebClearStorage = () => {
	// 清空前缓存主题颜色
	console.log('清空前缓存主题颜色')
	let topBag = ebGetLocalStorage('EB_TOPBG')
	let init = ebGetLocalStorage('EB_INIT');
	(ENV === 'WEAPP' && Taro.clearStorageSync()) || (localStorage != undefined && localStorage.clear());
	ebSetLocalStorage('EB_TOPBG', topBag);
	ebSetLocalStorage('EB_INIT', init);
}


/**
 * 同步
 * @param key
 * @returns {boolean|void}
 */
const ebRemoveLocalStorage = (key) => {
	return (ENV === 'WEAPP' && Taro.removeStorageSync(key)) || (localStorage != undefined && localStorage.removeStorage(key))
}

/**
 *
 * @param options
 * @param callback
 */
const ebChooseImage = (options = {}, callback = {}) => {

	let {count, sizeType, sourceType} = options;

	count = count || 6;
	sizeType = sizeType || ['original', 'compressed'];
	sourceType = sourceType || ['album', 'camera'];

	ENV === 'WEAPP' ? Taro.chooseImage({
		count, // 默认9
		sizeType, // 可以指定是原图还是压缩图，默认二者都有
		sourceType, // 可以指定来源是相册还是相机，默认二者都有
	}).then(res => callback(res)) : console.log('todo h5 have no api')

}

/**
 *
 * @param options
 * @param callback
 */
const ebPreviewImage = (options, callback = {}) => {

	let {current, urls} = options;

	current = current || '';

	if (urls == undefined || urls == '') {
		ebShowToast('预览图片链接不能为空');
		return;
	}

	Taro.previewImage({
		current: current, // 当前显示图片的http链接,不填则默认为 urls 的第一张
		urls: urls.split(',') // 需要预览的图片链接列表
	}).then(res => callback(res))

}

/**
 *
 * @param src
 * @param callback
 */
const ebGetImageInfo = (src, callback) => {
	Taro.getImageInfo({
		src,
	}).then(res => callback(res))
}

/**
 *
 * @param OBJECT
 * @param callback
 */
const ebSaveImageToPhotosAlbum = (OBJECT, callback) => {
	Taro.saveImageToPhotosAlbum(OBJECT).then(res => callback(res))
}

/**
 * 上传图片
 * @param options
 * @param callback
 */
const ebUploadFile = (options, callback) => {

	let token = ebGetLocalStorage('EB_TOKEN');
	if (token != null && token != false && token != '') {

		let {filePath, formData, name, uptype} = options;
		name = name || 'file'
		formData = formData || {};

		formData['token'] = token;
		formData['uptype'] = uptype || '1';

		let url = `${API_UPLOAD}`;
		let option = {filePath, formData, name, url}


		ENV === 'WEAPP' ? _uploadImageWxMin(option, callback, token) : _uploadImageH5(option, callback, token);
	}

}

/**
 *
 * @param options
 * @param callback
 * @private
 */
const _uploadImageWxMin = (options, callback) => {
	console.log(options);
	let {filePath, formData, name, url} = options;
	const uploadTask = Taro.uploadFile({
		url,
		filePath,
		name,
		formData,
	}).then(res => _ebUploadFileHandle(res.data, callback))

	// uploadTask.onProgressUpdate((res) => {
	//   console.log('上传进度', res.progress)
	//   console.log('已经上传的数据长度', res.totalBytesSent)
	//   console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
	// })

	//uploadTask.abort() // 取消上传任务
}


/**
 *
 * @param options
 * @param callback
 * @returns {Function}
 * @private
 */
export const _uploadImageH5 = (options, callback, token) => async (dispatch, getState) => {

	try {
		let {filePath, formData, name, url} = options;

		// formData
		const result = await (await fetch(url, {method: 'POST', body: formData})).json();
		console.log(result);
		// filePath
		if (result.status == 1) {
			//更新上传状态为失败
		}

		if (callback != undefined) {
			//更新上传状态为成功
		}

	} catch (e) {
		console.log(e);
	}
};

const _ebUploadFileHandle = (res, callback) => {
	// console.log('[EB] ===========\n ', res.data, '======== \n')

	res = JSON.parse(res);
	if (res.status == 1) {
		callback(res)
	} else {
		console.log('[EB] ===========\n ', ' 上传图片接口返回错误信息： msg: ' + res.msg, '======== \n')
		if (res.msg === 'token invalid' || res.msg === 'token empty') {

			ebShowModal({title: '提示信息', content: '登录已失效，请重新登录', showCancel: false, confirmText: '我知道了'}, () => {
				ebLogout()
			})

		}
	}
}

// 不能以pages 或  /pages/ 开头 ，结尾不能为 .js
const ebNavigateTo = (url, redirectTo = false) => {

	console.log('传入的路径:' + url);

	//第一个字符必须是反斜线 "/"
	if (url.substr(0, 1) != '/') {
		console.error('传入的路径中第一个字符必须是反斜线 "/"' + url);
		return;
	}

	//结尾不能为 .js
	if (url.substr(url.length - 3) == '.js') {
		console.error('传入的路径中末尾后三位不能为.js' + url);
		return;
	}

	let arr = url.split('/');

	if (arr[0] == 'pages' || arr[1] == 'pages') {
		console.error('传入的路径中不能以 pages 或 /pages 开头' + url);
		return;
	}

	url = url == '/' ? url : '/pages' + url;

	let currentPages = Taro.getCurrentPages();

	console.info('跳转到:' + url);

	if (currentPages.length > 5 || redirectTo) {
		Taro.redirectTo({url: url})
	} else {
		Taro.navigateTo({url: url})
	}

}

/**
 * 返回上delta页
 */
const ebNavigateBack = (delta) => {
	delta = delta || 1
	Taro.navigateBack({delta})
}

/**
 * 关闭当前页面，跳转到应用内的某个页面。
 * @param url
 */
const ebRedirectTo = (url) => {
	Taro.redirectTo({
		url: url
	})
}

/**
 * 关闭所有页面，打开到应用内的某个页面。
 * @param url
 */
const ebReLaunch = (url = '/pages/index/index') => {
	if (ENV === 'WEAPP') {
		Taro.reLaunch({
			url: url
		})
	} else {
		ebRedirectTo(url)
	}
}

/**
 * 扫码封装
 * @param successCallBack
 */
const ebScanCode = (successCallBack, onlyFromCamera = true, scanType) => {

	scanType = scanType || 'qrCode'
	Taro.scanCode({
		scanType,
		onlyFromCamera,
		success: (res) => {
			successCallBack(res)
		},
		fail: (e) => {
			console.log(e)
		}
	}).catch(
		(e) => {
			console.log(e)
			if (e['errMsg'] == 'scanCode:fail cancel') {
				ebShowToast('取消扫码', 5000)
			}
			if (e['errMsg'] == 'scanCode:fail') {
				ebShowToast('扫码失败,请确认', 5000)
			}
		}
	)
}

/**
 * 更改标题
 * @param title
 */
const ebSetNavigationBarTitle = (title) => {
	ebSetColorTo('c');
	if (ENV == 'WEAPP') {
		Taro.setNavigationBarTitle({
			title: title || ''
		})
	} else {
		if (ENV === 'h5') {
			document.title = decodeURI(title)
		}
	}
}

/**
 *
 */
const ebSetColorTo = (from) => {
	let {bg_color: backgroundColor, font_color: frontColor} = ebSetColor('1' + from);
	//console.log('setColor bg_color, font_color', backgroundColor, frontColor)
	ebSetNavigationBarColor(frontColor, backgroundColor);
}

/**
 * 交互
 * @param title
 * @param duration
 * @param icon
 */
const ebShowToast = (title, duration = 3000, icon = 'none') => {
	Taro.showToast({
		title: title || '',
		icon: icon,
		duration: duration
	})
}

const ebShowLoading = (title = '', mask = false) => {
	Taro.showLoading({
		title,
		mask
	})
}


const ebHideLoading = () => {
	Taro.hideLoading()
}


/**
 * 获取定位信息 经纬度 等
 * @param open
 * @param type 默认为2，即 gcj02，
 *             wgs84 返回 GPS 坐标；gcj02 返回国测局坐标（火星坐标），可用于Taro.openLocation的坐标
 * @param callBack
 */
const ebGetLocationVal = (options = {}, callBack = () => {
}) => {

	Taro.getSetting({
		success(res) {
			//console.log(res)
			if (!res.authSetting['scope.userLocation']) {
				Taro.authorize({
					scope: 'scope.userLocation',
					success() {
						getLocationVal(options, callBack)
					}
				})
			} else {
				console.log('fail');

				getLocationVal(options, callBack)
			}
		}
	})

}

/**
 * 获得设备位置
 * @param open
 * @param type
 * @param callBack
 */
const getLocationVal = (options, callBack = () => {
}) => {

	let {type} = options
	type = type || 2;
	type = type == 2 ? 'gcj02' : 'wgs84';


	Taro.getLocation({
		type,
		success: function (res) {
			//console.log('定位获取成功', res)
			let {latitude, longitude, speed, accuracy} = res
			callBack(res)
		},
		fail: function (res) {
			console.log('定位获取失败', res)
			ebShowToast('定位获取失败,请检查授权', 8000);
		}
	})
}

/**
 * 获取定位信息 经纬度 等
 * @param open
 * @param type 默认为2，即 gcj02，
 *             wgs84 返回 GPS 坐标；gcj02 返回国测局坐标（火星坐标），可用于Taro.openLocation的坐标
 * @param callBack
 */
const ebGetLocation = (options = {}, callBack = () => {
}) => {

	Taro.getSetting({
		success(res) {
			//console.log(res)
			if (!res.authSetting['scope.userLocation']) {
				Taro.authorize({
					scope: 'scope.userLocation',
					success() {
						// 用户已经同意小程序使用位置功能，后续调用 Taro.getLocation 接口不会弹窗询问
						getLocation(options, callBack)
					}
				})
			} else {
				getLocation(options, callBack)
			}
		}
	})

}

/**
 * 获得设备位置
 * @param open
 * @param type
 * @param callBack
 */
const getLocation = (options, callBack = () => {
}) => {

	let {open, type, show} = options
	open = open || false;
	type = type || 2;
	show = show || false;

	type = type == 2 ? 'gcj02' : 'wgs84'

	Taro.getLocation({
		type,
		success: function (res) {
			//console.log('定位获取成功', res)
			let {latitude, longitude, speed, accuracy} = res

			if (show) {
				let option = {latitude, longitude}
				getLocationInfo(option, (result) => {
					if (result.data.get) {
						console.log(result.data)
						let title = '请确认您的当前位置';
						let content = result.data.formatted_addresses.recommend;
						let optionsModel = {content, title};
						ebShowModal(optionsModel);
					} else {
						ebShowToast('获取详情地址失败')
					}
				});
			}

			if (open) {
				Taro.openLocation({
					latitude: latitude,
					longitude: longitude,
					name: 'name',
					address: 'address',
					scale: 28
				})
			}
			callBack()
		},
		fail: function (res) {
			console.log('定位获取失败', res)
			ebShowToast('定位获取失败,请检查授权', 8000);
		}
	})
}

/**
 * 取坐标详情信息
 * @param options
 * @param callBack
 */
const getLocationInfo = (options, callBack) => {
	let {latitude, longitude, type} = options
	type = type != undefined ? type : 'tx';
	let option = {
		url: API_LOCATION + 'tx?lat=' + latitude + '&lng=' + longitude + '&type=' + type
	}
	ebRequest(option, callBack)
}

const ebShowActionSheet = (options = {}, successCallBack = () => {
}, failCallBack = () => {
}) => {

	let {itemList} = options

	itemList = itemList != undefined ? itemList : ['A', 'B', 'C']

	Taro.showActionSheet({
		itemList,
		success: function (res) {
			console.log(res.tapIndex)
			successCallBack()
		},
		fail: function (res) {
			console.log(res.errMsg)
			failCallBack()
		}
	})
}

/**
 * 模态框封装
 * @param options
 * @param confirmCallBack
 * @param cancelCallBack
 */
const ebShowModal = (options = {}, confirmCallBack, cancelCallBack) => {

	let {content, title, cancelText, confirmText, showCancel} = options;

	confirmCallBack = confirmCallBack || (() => {
	})

	cancelCallBack = cancelCallBack || (() => {
	})

	content = content || '此字段必填！！！';
	title = title || '提示';
	cancelText = cancelText || '否';
	confirmText = confirmText || '是';
	showCancel = showCancel == false ? false : true;

	Taro.showModal({
		title,
		content,
		cancelText,
		confirmText,
		showCancel,
		success: function (r) {
			if (r.confirm) {
				//console.log('用户点击确定')
				confirmCallBack()
			} else if (r.cancel) {
				//console.log('用户点击取消')
				cancelCallBack()
			}
		}
	})
}

/**
 * 触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致
 */
const ebStartPullDownRefresh = () => {
	Taro.startPullDownRefresh()
}

/**
 * 当处理完数据刷新后,停止当前页面的下拉刷新
 */
const ebStopPullDownRefresh = () => {
	Taro.stopPullDownRefresh()
}

/**
 * 系统信息
 * 手机屏幕高度单位rpx
 * @param successCallBack
 */
const ebGetSystemInfo = (successCallBack) => {
	Taro.getSystemInfo({
		success: (res) => {
			let h = null;
			successCallBack ? successCallBack(res) : h = 750 * res.windowHeight / res.windowWidth
		}
	})
}

/**
 * 是否存在
 * @param array
 * @param val
 * @returns {boolean}
 */
const ebCheckExist = (array, val) => {
	//console.log('array: ', array)
	let r = array.indexOf(val) > -1;
	//console.log('r: ', r)
	return r;
}


/**
 *
 */
const ebShowShareMenu = () => {
	if (ENV === 'WEAPP') {
		Taro.showShareMenu({
			withShareTicket: true
		})
	} else {
		ebSay('当前不支持微信分享');
	}

}

/**
 *
 * @param from
 * @returns {{bg_color: string, font_color: string}}
 */
const ebSetColor = (from = 'default') => {
	//console.log('ebSetColor from: ' + from)
	let init = ebGetLocalStorage("EB_INIT");
	try {
		init = JSON.parse(init)
	} catch (e) {

	}
	if (init == null) {
		init = [];
		init["color"] = '#ffffff'
	}

	let bg_color = init ? ENV == 'H5' ? '#' + init["color"] : init["color"] : '#3176e7';
	let font_color = bg_color == "#ffffff" ? "#000000" : "#ffffff";

	return {bg_color, font_color}
}

/**
 *
 * @param that
 * @param from
 */
const ebSetColorState = (that, from = 'default') => {
	//console.log('ebSetColorState from: ' + from)

	let {bg_color, font_color} = ebSetColor(from)
	that.setState({
		bg_color,
		font_color,
	})

	return {bg_color, font_color}

}

/**
 *
 * @param top_info
 * @param from
 */
const ebSetColorInit = (top_info = {}, from = 1) => {
	let init_info = ebGetLocalStorageInit();
	let initColor = init_info["color"]

	if (init_info == null || JSON.stringify(init_info) == '{}') {
		init_info = {};
		initColor = "#ffffff"
	} else {
		//revert replaced '#'
		if (ENV === 'h5') {
			initColor = "#" + initColor
		}
	}

	let show_search = top_info && top_info.status ? "none" : "block";
	let style = "background:" + initColor;

	//console.log('initColor',initColor)

	let color = "#ffffff";
	let border_bottom = "";
	let search_bottom = "";
	if (initColor == "#ffffff") {
		style += ";color:#666666;"
		border_bottom = "border-bottom:1px solid #666666";
		search_bottom = "color:#666666";
		color = "#666666";
	} else {
		style += ";color:#ffffff;";
		border_bottom = "border-bottom:1px solid #ffffff";
		search_bottom = "color:#ffffff";
	}

	switch (from) {
		case 1:
			//search use
			return {
				init_info,
				style,
				color,
				border_bottom,
				search_bottom: search_bottom += ';font-size:14px',
				show_search
			}
			break;
		case 2:
			//footer use
			let background = "background:" + initColor;
			let phonestyle = '';
			style = "background:" + initColor;

			if (initColor == "#ffffff") {
				phonestyle = initColor;
				style += ";color:#666666"
			} else {
				phonestyle = initColor;
				style += ";color:#ffffff";
			}

			//console.log(background, style, color, phonestyle);

			return {background, style, color, phonestyle}
			break;
	}


}

/**
 * 获得地址栏参数
 * @param that
 * @returns {{}}
 */
const ebGetRouterParams = (that) => {
	try {
		return that.$router ? that.$router.params || {} : {};
	} catch (e) {
		return {}
	}
}

/**
 *
 * @param frontColor
 * @param backgroundColor
 */
const ebSetNavigationBarColor = (frontColor, backgroundColor) => {

	if (ENV === 'WEAPP') {

		Taro.setNavigationBarColor({
			frontColor: backgroundColor == "#ffffff" ? "#000000" : "#ffffff",
			backgroundColor: backgroundColor ? backgroundColor : frontColor,
			success: function () {

			}
		})

	} else {
		ebSay('不支持设置头部颜色');
	}

	ebSetLocalStorage('EB_TOPBG', frontColor);

}

/**
 * 该方法不需要对外暴露
 * @param msg
 */
const ebSay = (msg) => {
	//console.log('EB say: ' + msg)
}

/**
 * JSON.parse and  decodeURI
 * @param json
 * @returns {any}
 */
const EBJsonParseDecode = (json = '{}') => {
	json = decodeURI(json);
	return JSON.parse(json);
}

/**
 * 初始化数据
 * @param parse
 * @returns {boolean|any|string}
 */
const ebGetLocalStorageInit = (parse = true) => {
	let init = ebGetLocalStorage('EB_INIT');
	if (parse) {
		try {
			init = JSON.parse(init)
		} catch (e) {

		}
	}

	return init;
}

/**
 * 判断是否为微信小程序
 *
 * @export
 * @returns
 */
const ebIsWeChatApplet = () => {
	//console.log('ebIsWeChatApplet', ENV)
	if (ENV == 'H5') {
		const ua = window.navigator.userAgent.toLowerCase();
		return new Promise((resolve) => {
			if (ua.indexOf('micromessenger') == -1) {//不在微信或者小程序中
				//console.log('ebIsWeChatApplet', '不在微信或者小程序中')
				ebSetLocalStorage('EB_isWeChatApplet', false)
				resolve(false);
			} else {
				if (ENV == 'WEAPP') {//在小程序中
					//console.log('ebIsWeChatApplet', '在小程序中 h5')
					ebSetLocalStorage('EB_isWeChatApplet', true)
					resolve(true);
				} else {
					//在微信中
					//console.log('ebIsWeChatApplet', '在微信中')
					ebSetLocalStorage('EB_isWeChatApplet', false)
					resolve(false);
				}
				;
			}
		});
	} else if (ENV == 'WEAPP') {
		return new Promise((resolve) => {
			//console.log('ebIsWeChatApplet', '在小程序中 原生')
			ebSetLocalStorage('EB_isWeChatApplet', true)
			resolve(true);
		});
	}

}

/**
 * 版本更新提示
 */
const ebGetUpdateManager = () => {
	if (ENV == 'WEAPP') {
		if (Taro.canIUse('getUpdateManager')) {
			const updateManager = Taro.getUpdateManager()
			updateManager.onCheckForUpdate(function (res) {
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function () {
						Taro.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success: function (res) {
								if (res.confirm) {
									updateManager.applyUpdate()
								}
							}
						})
					})
					updateManager.onUpdateFailed(function () {
						Taro.showModal({
							title: '已经有新版本了哟~',
							content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
						})
					})
				}
			})
		} else {
			Taro.showModal({
				title: '提示',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			})
		}
	}
}

/**
 * 设置标题并验证登录
 * @param that
 * @returns {{}}
 */
const ebSetTitleAndReturnState = (that, title) => {

	let params = ebGetRouterParams(that)

	console.log('params', params)

	ebSetLocalStorage('params', JSON.stringify(params))

	let detail = ebGetLocalStorage('EB_INIT');

	try {
		detail = JSON.parse(detail);
	} catch (e) {
		//console.log(e)
	}

	ebSetNavigationBarTitle(title || detail.name || '万印宝-便捷的打印体验')


	let TOKEN = ebGetLocalStorage('EB_TOKEN');
	if (!TOKEN) {
		ebGetToken(that);
	}

	return {}
}

const ebGetToken = (that, callback) => {

	callback = callback || (() => {
	})

	let token = ebGetLocalStorage('EB_TOKEN');
	if (ENV == 'WEAPP') {
		if (!token) {
			Taro.login({
				success: function (res) {

					console.log(res)

					let data = {code: res.code}
					let option = {data, method: 'POST'}

					ebRequest('/wxmin/' + API_V1 + "User/getToken", option, (result) => {
						if (result.status) {

							ebSetLocalStorage('EB_OPENID', result["data"]["openid"]);
							ebSetLocalStorage('EB_SESSIONKEY', result["data"]["session_key"]);
							if (result["data"]["token"]) {
								token = result["data"]["token"]
								ebSetLocalStorage('EB_TOKEN', token);
								that.props.authorizedUpdate(true)
								//获取用户信息
								ebGetUserInfo(that, {token, from: "ebGetToken not exsit"}, callback)
							}else {
								that.props.authorizedUpdate(false)
							}
						}
					})
				}
			})
		} else {
			//获取用户信息
			ebGetUserInfo(that, {token, from: "ebGetToken token exist"}, callback)

			console.log('微信小程序内打开，token 已存在');
		}
	} else {
		//console.log('todo 微信小程序外打开，考虑怎样获取token');
	}

}

const ebGetUserInfo = (that, option, callback) => {
	option.method = 'POST';
	callback = callback || (() => {
	})
	console.log('获取用户信息')

	ebRequest('/wxmin/' + API_V1 + 'User/getUserInfo', option, (res) => {
		let {data} = res;
		if (data.length > 0) {
			that.props.initAppUpdate(data, that);
			callback()
		} else {
			console.log('userInfo empty')
		}
	})
}


const ebGetAuthState = () => {
	return ebGetLocalStorage('EB_TOKEN') ? true : false
}

const ebLogout = () => {
	getApp().props.authorizedUpdate(false)
	ebClearStorage()
	ebReLaunch()

}

/**
 *
 * @param oid 订单ID
 * @param type 支付的场景类型 1 打印订单支付
 * @returns {boolean}
 */
const ebPay = (oid, type = 1) => {
	if (!oid) return false
	//获取支付参数
	let token = ebGetLocalStorage('EB_TOKEN');
	let data = {oid: oid};
	let option = {data, token, method: 'POST'};
	ebRequest('/wxmin/' + API_V1 + 'pay', option, function (res) {
		if (res.status) {
			console.log('支付接口调用成功');
			let {timeStamp, nonceStr, signType, paySign, appId} = res.data;
			//支付
			Taro.requestPayment({
				appId,
				timeStamp,
				nonceStr,
				'package': res.data.package,
				signType,
				paySign,
				success(res) {
					console.log('支付成功');
					switch (type) {
						case 1:
							ebNavigateTo('/model/printModel/payFinish/payFinish', true)
							break;
					}

				},
				fail(res) {
					console.log('支付失败')
				}
			}).catch(reason => {
				if (reason['errMsg'] == 'requestPayment:fail cancel') {
					ebShowToast('用户取消支付', 5000)
				}
				if (reason['errMsg'] == 'requestPayment:fail') {
					ebShowToast('支付失败', 5000)
				}

				switch (type) {
					case 1:
						ebNavigateTo('/model/printModel/historyOrder/historyOrder', true)
						break;
				}

			})

		}

	})

}

/**
 * 创建打印任务
 * @param option
 */
const ebPrintTaskCreate = (option) => {
	ebRequest('/wxmin/' + API_V1 + 'task/create', option, function (res) {
		ebNavigateTo('/model/printModel/scanSuccess/scanSuccess?resCreate=' + JSON.stringify(res), true);
	});
}

/***
 *
 * @param url 要预览的文件路径
 */
const ebDocumentPreview = (url) => {
	Taro.downloadFile({
		url: url,
		success: function (res) {
			var filePath = res.tempFilePath
			Taro.openDocument({
				filePath: filePath,
				fileType: 'pdf',
				success: function (res) {
					console.log('打开文档成功')
					console.log(res)
					//ebShowToast('打开文档成功')
				},
				fail: function (res) {
					console.log('openDocument fail')
					console.log(res)
				},
				complete: function (res) {
					console.log('openDocument complete')
					console.log(res)
				}
			})
		},
		fail: function (res) {
			console.log('downloadFile  fail')
			console.log(res)
		},
		complete: function (res) {
			console.log('downloadFile  complete')
			console.log(res)
		}
	})
}

/**
 * 文件预览封装
 * @param option
 */
const ebFilePreview = (option) => {
	ebShowLoading("加载中..")

	let {previewSrc, ext} = option
	let url = "https://web.ewyb.cn/preview?t0=pdf&u0=" + previewSrc;

	if (ext == 'doc' || ext == 'docx' || ext == 'xls' || ext == 'xlsx' || ext == 'ppt' || ext == 'pptx') {

		if (SystemInfoUtil.platform == SystemInfoUtil.IOS) {
			let url = '/com/webView/index?ebsrc=' + previewSrc;
			ebNavigateTo(url);
		} else if (SystemInfoUtil.platform == SystemInfoUtil.ANDROID) {
			ebDocumentPreview(url);
		}
	} else if (ext == 'png' || ext == 'jpg' || ext == 'jpeg') {
		ebPreviewImage({urls: previewSrc}, () => {
		});
	}

	setTimeout(()=>{ebHideLoading()},2000)

}

/**
 *  SystemInfoUtil.init()
 *  //设备:ios
 //微信版本:6.7.3 -》 基础库版本对应2.4.4
 if (SystemInfoUtil.platform == SystemInfoUtil.IOS && SystemInfoUtil.wxSDKVersion == 244) {
      return;//相应处理
    }
 ---------------------
 */
export class SystemInfoUtil {
	static PC = "pc";
	static IOS = "ios";
	static ANDROID = "android";

	/**
	 * 平台 ios,andorid,pc
	 */
	static platform;
	/**
	 * 基础库版本 已处理成数值7.0.0->700 容易比较 可以查map到微信什么版本
	 */
	static wxSDKVersion;

	static init() {
		Taro.getSystemInfo({
			success: function (res) {
				if (res.platform == "devtools") {
					SystemInfoUtil.platform = SystemInfoUtil.PC;
				} else if (res.platform == "ios") {
					SystemInfoUtil.platform = SystemInfoUtil.IOS;
				} else if (res.platform == "android") {
					SystemInfoUtil.platform = SystemInfoUtil.ANDROID;
				}

				let version = res.SDKVersion;
				version = version.replace(/\./g, "");
				SystemInfoUtil.wxSDKVersion = version;
			}
		})
	}
}

export {
	ebRequest,
	ebChooseImage,
	ebPreviewImage,
	ebGetImageInfo,
	ebSaveImageToPhotosAlbum,
	ebUploadFile,
	ebNavigateTo,
	ebNavigateBack,
	ebRedirectTo,
	ebReLaunch,
	ebGetLocalStorage,
	ebSetLocalStorage,
	ebRemoveLocalStorage,
	ebClearStorage,
	ebScanCode,
	ebSetNavigationBarTitle,
	ebShowToast,
	ebShowLoading,
	ebHideLoading,
	ebGetLocation,
	ebGetLocationVal,
	ebShowModal,
	ebStartPullDownRefresh,
	ebStopPullDownRefresh,
	ebGetSystemInfo,
	ebCheckExist,
	ebShowShareMenu,
	ebSetColorState,
	ebSetColorInit,
	ebSetColorTo,
	ebGetRouterParams,
	ebSetNavigationBarColor,
	ebGetLocalStorageInit,
	ebIsWeChatApplet,
	ebGetUpdateManager,
	ebSetTitleAndReturnState,
	ebGetAuthState,
	ebLogout,
	ebPay,
	ebPrintTaskCreate,
	ebDocumentPreview,
	ebFilePreview,
	API_HOST,
	API,
	API_V1,
	API_WS,
	ENV,
}
