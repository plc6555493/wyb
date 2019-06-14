import Taro, {Component} from '@tarojs/taro'
import {View, Button} from '@tarojs/components'
import './index.scss'
import CopyRight from '../../../../components/copyRight';
import {ebNavigateTo,EBSetTitleAndReturnState,ebUploadFile} from '../../../../utils';
import picAdv1 from '../../../../asset/image/picAdv1.png';
import videoAdv1 from '../../../../asset/image/videoAdv1.png';
import to_upload from '../../../../asset/image/to_upload.png';

let self

export default class Index extends Component {
    constructor(props) {
        super(props);
        self = this
        this.state = {
            top_info: {status: false, color: '#ffffff', bgcolor: '#ff0000'},
            //input文本框件提示内容
            placeholder1:'请选择要上传的图片',
            placeholder2:'请选择要上传的视频',

            

            //图片选择按钮组模块
            s1:'display:none',
            
            btn5s1:'border-color: #dddddd;',
            btn15s1:'border-color: #dddddd;',
            btn30s1:'border-color: #dddddd;',
            btnOther11:'border-color: #dddddd;',

            btn1d1:'border-color: #dddddd;',
            btn7d1:'border-color: #dddddd;',
            btn30d1:'border-color: #dddddd;',
            btnOther21:'border-color:#dddddd;',

            picBtn1s1:'border-color: #dddddd;',

            //视频选择按钮组模块
            s2:'display:none',

            btn5s2:'border-color: #dddddd;',
            btn15s2:'border-color: #dddddd;',
            btn30s2:'border-color: #dddddd;',
            btnOther12:'border-color: #dddddd;',

            btn1d2:'border-color: #dddddd;',
            btn7d2:'border-color: #dddddd;',
            btn30d2:'border-color: #dddddd;',
            btnOther22:'border-color: #dddddd;',

            picBtn2s1:'border-color: #dddddd;',

        } 
    }
    

    //页面跳转
    todemo9(){
        ebNavigateTo('/model/advModel/advUploadSuccess/index');
    }

    show1(){

        let {isShow1,s1}=this.state;
        this.setState({
            s2:'display:none',
            s1:'display:block',

            picBtn2s1:'border-color: #dddddd;',
            picBtn1s1:'box-shadow:0px 8px 32px rgba(0,0,0,.1);border-color: #3176E7;',
        })
    }

    select1(str1,event){
        let {btn5s1,btn15s1,btn30s1,btnOther11}=this.state;
        this.setState({
            btn5s1:'border-color: #dddddd;',
            btn15s1:'border-color: #dddddd;',
            btn30s1:'border-color: #dddddd;',
            btnOther11:'border-color: #dddddd;',
            [str1]:'border-color: #3176E7;color: #FFFFFF;background-color: #3176E7;',
        })
        
    }

    select2(str1,event){
        let {btn1d1,btn7d1,btn30d1,btnOther21}=this.state;
        this.setState({
            btn1d1:'border-color: #dddddd;',
            btn7d1:'border-color: #dddddd;',
            btn30d1:'border-color: #dddddd;',
            btnOther21:'border-color: #dddddd;',
            [str1]:'border-color: #3176E7;color: #FFFFFF;background-color: #3176E7;',
        })
        
    }


    show2(){

        let {isShow2,s2}=this.state;
        this.setState({
            s1:'display:none',
            s2:'display:block',

            picBtn1s1:'border-color: #dddddd;',
            picBtn2s1:'box-shadow:0px 8px 32px rgba(0,0,0,.1);border-color: #3176E7;',
        })
    }

    select3(str1,event){
        let {btn5s2,btn15s2,btn30s2,btnOther12}=this.state;
        this.setState({
            btn5s2:'border-color: #dddddd;',
            btn15s2:'border-color: #dddddd;',
            btn30s2:'border-color: #dddddd;',
            btnOther12:'border-color: #dddddd;',
            [str1]:'border:1px solid #3176E7;color: #FFFFFF;background-color: #3176E7;',
        })
        
    }

    select4(str1,event){
        let {btn1d2,btn7d2,btn30d2,btnOther22}=this.state;
        this.setState({
            btn1d2:'border-color: #dddddd;',
            btn7d2:'border-color: #dddddd;',
            btn30d2:'border-color: #dddddd;',
            btnOther22:'border-color: #dddddd;',
            [str1]:'border:1px solid #3176E7;color: #FFFFFF;background-color: #3176E7;',
        })
        
    }

    //上传图片广告
    upload1(){
        Taro.chooseImage({
            success(res){
                console.log('res.tempFilePaths='+res.tempFilePaths);
                let path = res.tempFilePaths[0]
                self.setState({
                    placeholder1:res.tempFilePaths,
                })
                // 上传图片至服务器
                ebUploadFile({filePath: path, uptype:2}, function (res) {
                    //上传成功后操作
                    if (res.status) {

                    }
                })
            }
        })
    }

    //上传视频广告
    upload2(){
        Taro.chooseVideo({
            success(res){
                console.log('res.tempFilePath='+res.tempFilePath);
                let path = res.tempFilePath
                self.setState({
                    placeholder2:res.tempFilePath
                })
                // 上传视频至服务器
                ebUploadFile({filePath: path, uptype:2}, function (res) {
                    //上传成功后操作
                    if (res.status) {

                    }
                })
            }
        })
    }


    componentDidMount() {
        //EBSetTitleAndReturnState(this);
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
            <View style={{backgroundColor: 'white'}} className='adv8'>
                {/* 行：选择广告类型 */}
                <View className='view1'>
                    <View className='txt1'>选择广告类型</View>
                    <View><Text>\n</Text></View>
                    {/* 行：图片广告 */}
                    <View className='view1h2'>
                        <View className='btnPicAdv1'  onClick={this.show1} >
                            <Image className='img1' style={this.state.picBtn1s1} src={picAdv1}></Image>
                        </View>
                    </View>
                    <View><Text>\n</Text></View>
                    {/* 行：视频广告 */}
                    <View className='view1h3'>
                        <View className='btnVideoAdv1'  onClick={this.show2} >
                            <Image className='img2' style={this.state.picBtn2s1} src={videoAdv1}></Image>
                        </View>
                    </View>
                </View>
                <View><Text>\n</Text></View>
                {/* 行：图片 选择图片文件、选择播放时长、选择投放周期 */}
                <View className='view2' style={this.state.s1}>
                    <View className='txt1'>选择文件</View>
                    <View><Text>\n</Text></View>
                    {/* 行：显示文件名、预览和浏览按钮 */}
                    <View className='view2h1'>
                        <Input className='input'
                                placeholder={this.state.placeholder1}
                                disabled='true'
                        />
                        <Image className='upload'
                                src={to_upload}
                                onClick={this.upload1}
                        />
                    </View>

                    <View><Text>\n</Text></View>

                    <View className='txt1'>选择播放时长</View>
                    <View><Text>\n</Text></View>
                    {/* 行：按钮5秒、15秒、30秒、其他 */}
                    <View className='view2h2'>
                        <Button className='btnLen1' onClick={this.select1.bind(this,'btn5s1')} style={this.state.btn5s1}>5秒</Button>
                        <Button className='btnLen2' onClick={this.select1.bind(this,'btn15s1')} style={this.state.btn15s1}>15秒</Button>
                        <Button className='btnLen2' onClick={this.select1.bind(this,'btn30s1')} style={this.state.btn30s1}>30秒</Button>
                        <Button className='btnLen2' onClick={this.select1.bind(this,'btnOther11')} style={this.state.btnOther11}>其他</Button>
                    </View>

                    <View><Text>\n</Text></View>

                    <View className='txt1'>选择投放周期</View>
                    <View><Text>\n</Text></View>
                    {/* 行：按钮一天、一周、一个月、其他 */}
                    <View className='view2h4'>
                        <Button className='btnLen3' onClick={this.select2.bind(this,'btn1d1')} style={this.state.btn1d1}>1天</Button>
                        <Button className='btnLen4' onClick={this.select2.bind(this,'btn7d1')} style={this.state.btn7d1}>7天</Button>
                        <Button className='btnLen4' onClick={this.select2.bind(this,'btn30d1')} style={this.state.btn30d1}>30天</Button>
                        <Button className='btnLen4' onClick={this.select2.bind(this,'btnOther21')} style={this.state.btnOther21}>其他</Button>
                    </View>
                </View>
                {/* 行：视频 选择视频文件、选择播放时长、选择投放周期 */}
                <View className='view4' style={this.state.s2}>
                <View className='txt1'>选择文件</View>
                    <View><Text>\n</Text></View>
                    {/* 行：显示文件名、预览和浏览按钮 */}
                    <View className='view4h1'>
                        <Input className='input2'
                                placeholder={this.state.placeholder2}
                                disabled='true'
                        />
                        <Image className='upload2'
                                src={to_upload}
                                onClick={this.upload2}
                        />
                    </View>

                    <View><Text>\n</Text></View>
                    
                    <View className='txt1'>选择播放时长</View>
                    <View><Text>\n</Text></View>
                    {/* 行：按钮5秒、15秒、30秒、其他 */}
                    <View className='view4h2'>
                        <Button className='btnLen1' onClick={this.select3.bind(this,'btn5s2')} style={this.state.btn5s2}>5秒</Button>
                        <Button className='btnLen2' onClick={this.select3.bind(this,'btn15s2')} style={this.state.btn15s2}>15秒</Button>
                        <Button className='btnLen2' onClick={this.select3.bind(this,'btn30s2')} style={this.state.btn30s2}>30秒</Button>
                        <Button className='btnLen2' onClick={this.select3.bind(this,'btnOther12')} style={this.state.btnOther12}>其他</Button>
                    </View>

                    <View><Text>\n</Text></View>

                    <View className='txt1'>选择投放周期</View>
                    <View><Text>\n</Text></View>
                    {/* 行：按钮一天、一周、一个月、其他 */}
                    <View className='view4h4'>
                        <Button className='btnLen3' onClick={this.select4.bind(this,'btn1d2')} style={this.state.btn1d2}>1天</Button>
                        <Button className='btnLen4' onClick={this.select4.bind(this,'btn7d2')} style={this.state.btn7d2}>7天</Button>
                        <Button className='btnLen4' onClick={this.select4.bind(this,'btn30d2')} style={this.state.btn30d2}>30天</Button>
                        <Button className='btnLen4' onClick={this.select4.bind(this,'btnOther22')} style={this.state.btnOther22}>其他</Button>
                    </View>
                </View>
                <View><Text>\n</Text></View>
                {/* 行：确认提交 */}
                <View className='view3'>
                    <Button className='btnSubmit1' onClick={this.todemo9}>确认提交</Button>
                </View>
                {/* <View id='componentOne'>
                    <CopyRight tabbar={true}/>
                </View> */}   
            </View>
            
        )
    }
}
