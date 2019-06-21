import Taro, {Component} from '@tarojs/taro'
import {View,Button,Image,OpenData} from '@tarojs/components'
import './payFinish.css'
import {API_V1, ebGetLocalStorage, ebGetRouterParams, ebReLaunch, ebRequest, ebScanCode, ebSetTitleAndReturnState} from "../../../../utils"
import greenHook from "../../../../asset/image/greenHook.png"


 class PayFinish extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ebSetTitleAndReturnState(this);
    }

    scan(){
    		ebScanCode((res1)=>{
				//获取参数
				let params = ebGetRouterParams(this);
				console.log('获取的参数是',params);
				let {pic}=params;

				console.log('扫码成功');
				console.log(res1.result);
				let token = ebGetLocalStorage('EB_TOKEN');
				let data = {machine_code:res1.result};
				let option = {data,token,method: 'GET'};
				ebRequest('/wxmin/' + API_V1 + 'order/', option, function (res) {
					if (res.status) {
						console.log('机器码对比');
						let machine_code=res1.result;
						Taro.navigateTo({
							url:'../printScan/scan?machine_code='+machine_code
						})

					}
				});

			})
    }

	goIndex(){
		ebReLaunch()
	}


	render() {

        return (
            <View>
                {/*<View className="head">*/}
                    {/*<OpenData className="head-left"*/}
                              {/*type="userAvatarUrl"*/}
                    {/*/>*/}
                    {/*<Image className="head-right"*/}
                           {/*src="../../../../asset/image/msg.png"*/}
                    {/*/>*/}
                {/*</View>*/}
                <View className="body">
                    <Image className="body1" src={greenHook}/>
                    <View className="body2">支付成功</View>
                    <View className="body3"> 点击扫码取件开始打印，也可在首页点击 右上角“扫一扫”扫码取件</View>
                </View>
                <View className="foot">
                    <Button className="foot-left"
                            onClick={this.goIndex}
                    >返回首页</Button>
                    <Button className="foot-right"
                            onClick={this.scan}
                    >扫码取件</Button>


                </View>
							{/*营销类活动*/}

            </View>
        )
    }
}
