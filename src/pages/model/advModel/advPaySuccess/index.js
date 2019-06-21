import Taro, {Component} from '@tarojs/taro'
import {View, Button} from '@tarojs/components'
import './index.scss'
import {ebNavigateTo, ebSetTitleAndReturnState,ebGetRouterParams} from '../../../../utils';
import greenHook from '../../../../asset/image/greenHook.png';


let self

export default class Index extends Component {
    constructor(props) {
        super(props);
        self = this
        this.state = {
            topInfo: {status: false, color: '#ffffff', bgcolor: '#ff0000'},
            totalPrice:null,
        }
    }

    //页面跳转
    toadv8(){
        ebNavigateTo('/model/advModel/advSubmit/index');
    }

    componentDidMount() {
        ebSetTitleAndReturnState(this);
        //获取值
        let params = ebGetRouterParams(this);
        console.log('123',params)
        //使用totalPrice之前要先对数据进行解构，因为params是一个对象，此处取params中的totalPrice的值
        //let totalPrice = params.totalPrice
        //下面一句和上面一句等价，都是用于“使用totalPrice之前要先对数据进行解构”
        let {totalPrice} = params
        this.setState({
            totalPrice:totalPrice,
        })
    }

    componentDidShow() {
    }

    componentDidHide() {
    }

    //用户点击右上角转发
    onShareAppMessage = () => {
        //console.log('小程序专有 用户点击右上角转发')
    }

    //页面上拉触底事件的处理函数
    onReachBottom = () => {
    }

    render() {

        return (
            <View style={{backgroundColor: 'white'}} className='adv7'>
                {/* 行：图片 */}
                <View className='view1'>
                    <Image className='img1' src={greenHook}></Image>
                </View>
                {/* 行：支付成功 */}
                <View className='view2'>
                    <Text className='txt1'>支付成功</Text>
                </View>
                {/* 行：价格 */}
                <View className='view3'>
                    <View className='txt2'>
                        <Text>￥</Text>
                        <Text>{this.state.totalPrice}</Text>
                    </View>
                </View>
                <View><Text>\n</Text></View>
                {/* 行：前往上传广告 */}
                <View className='view4'>
                    <Button className='btnUploadAdv' onClick={this.toadv8}>前往上传广告</Button>
                </View>
                {/* <View id='componentOne'>
                    <CopyRight tabbar={true}/>
                </View> */}
            </View>
        )
    }
}
