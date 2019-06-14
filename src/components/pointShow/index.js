import Taro from '@tarojs/taro';
import {View, Text, CoverImage} from '@tarojs/components';
import './index.scss';
import vip_pic from '../../asset/image/vip.png'
import plus from '../../asset/image/plus.png'
import hook from'../../asset/image/hook.png'

let self = null;

class PointShow extends Taro.Component {
    constructor(props) {
        super(props);
        self = this;
    }

    componentWillMount() {

    }
    myAdd(k){
        this.props.myAdd&&this.props.myAdd(k)
    }
    render() {
        let {listShow} = this.props;
        return (
            <View>
                {
                    listShow.map((v, k) => {
                        return (
                            <CoverView className='address' TaroKey={k}>
                                {
                                    v.vip===true
                                        ?(<CoverImage className='vip'
                                                              src={vip_pic}/>)
                                        :null
                                }

                                <CoverImage className='plus'
                                            src={v.checked===true?plus:hook}
                                            onClick={this.myAdd.bind(this,k)}
                                />
                                <CoverView className="msg1">{v.title}</CoverView>
                                <CoverView className="msg2">{v.address}</CoverView>
                                <CoverView className="msg3">设备正常运营中</CoverView>
                                <CoverImage className='addressPic'
                                            src={v.image}
                                />
                            </CoverView>
                        )
                    })
                }
            </View>
        )
    }
}

export default PointShow