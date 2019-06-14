import Taro, {Component} from '@tarojs/taro'
import {View,Text,Image,Map,CoverView,CoverImage,Swiper} from '@tarojs/components'
import './index.css'
import {ebSetTitleAndReturnState, ebNavigateTo, ebGetLocalStorage, ebSetLocalStorage} from "../../../../utils"
import '../../../../asset/image/map_blue.png'
import '../../../../asset/image/map_red.png'
import '../../../../asset/image/map_nav.png'
import PointShow from '../../../../components/pointShow'
let self=null;

export default class Demo4 extends Component {
    constructor(props){
        super(props);
        self=this;
        this.state={
            addNumber:0,
            iconPath:['../../../../asset/image/map_blue.png',
            '../../../../asset/image/map_red.png'],
            listShow:[]
        }
    }
    componentDidMount() {
        ebSetTitleAndReturnState(this);


    }

    componentWillMount(){

	}

    componentDidShow() {
        //获取上个页面传过来的内容

        // address:"四川省 凉山彝族自治州 昭觉县"
        // checked:false
        // id:"530000200606024470"
        // image:"http://dummyimage.com/200x100/4A7BF7&text=Hello"
        // paragraph:"条从节压市物容矿府听太按。作开解民现不象没水究已那十资。速低八阶长基起果有作说厂。何路油高如期领说西清阶知解。"
        // title:"Eiv Elfsg Kksidufm Muluh Znl Wucwampn"
        // vip:false
        let s=ebGetLocalStorage('EB_LIST_SELECT');
        console.log('333',s);
        let {listShow}=self.state;
        listShow=s;
        // listShow=[
        //     {title:'酒店111',address:'地址111',image:'http://cdn.ewyb.cn/weapp/main/hotel.jpg'},
        // ];
        self.setState({
            listShow:listShow
        })
        let {addNumber}=this.state;
        for(let i=0;i<listShow.length;i++){
            if(listShow[i].checked===true){
                addNumber++
            }
            this.setState({
                addNumber
            })
        }
        Taro.getLocation({
            type:'gcj02',
            success(res){
                console.log(res.latitude);
                console.log(res.longitude);
                const latitude=res.latitude;
                const longitude=res.longitude;
                self.setState({latitude:latitude,longitude:longitude})
            }
        });


    }
    componentDidHide() {

    }

    //用户点击右上角转发
    onShareAppMessage = () => {
        //console.log('小程序专有 用户点击右上角转发')
    };

    //页面上拉触底事件的处理函数
    onReachBottom = () => {
    };

    //点击下一步
    next(){
        ebNavigateTo("/model/advModel/advSelectConfirm/index"
        )
    }
    //点击地图
    mapNav(){
        let {listShow}=self.state;
        let s=listShow;
        ebSetLocalStorage('EB_LIST_SELECT',JSON.stringify(s));
        ebNavigateTo("/model/advModel/advSelectList/index")
    }
    //点击已选
    hasChoose(){
        ebNavigateTo("/model/advModel/advSelectConfirm/index")
    }
    render () {

        let {listShow}=self.state;
        return (
            <View className='map'>
                <Map className='myMap'
                     id='myMap'
                     scale='18'
                     longitude={this.state.longitude}
                     latitude={this.state.latitude}

                     markers={[
                         {
                             iconPath:this.state.iconPath[0],
                             id:0,
                             latitude:31.70165,
                             longitude:119.94311,
                             width:39,
                             height:46
                         },
                         {
                             iconPath:this.state.iconPath[1],
                             id:1,
                             latitude:31.70276,
                             longitude:119.94422,
                             width:22,
                             height:25
                         }
                     ]}
                     bindmarkertap={this.markerTap}
                />
                <CoverView className='hasChoose' onClick={this.hasChoose}>已选</CoverView>
                <CoverView className='addNumber'>{addNumber}</CoverView>
                <CoverImage className='mapNav'
                            onClick={this.mapNav}
                       src='../../../../asset/image/map_nav.png'
                />
                {/*底部展示板*/}
                <PointShow listShow={listShow}
                    //添加到购物车
                           myAdd={(k)=>{
                               if(listShow[k].checked===false)
                               {
                                   listShow[k].checked=true
                                   this.setState({
                                       addNumber:addNumber+1,
                                       listShow,
                                   });
                               }
                               else{
                                   listShow[k].checked=false
                                   this.setState({
                                       addNumber:addNumber-1,
                                       listShow,
                                   });
                               }
                           }
                           }

            />
                <CoverView className='next' onClick={this.next}>下一步

                </CoverView>

                {/*侧边留白*/}
                <CoverView className="left"/>
                <CoverView className="right" />

            </View>
        )
    }
}

