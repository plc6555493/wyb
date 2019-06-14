import Taro from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import './index.scss';
import {ebGetLocalStorageInit} from "../../utils";

let self = null;

class CopyRight extends Taro.Component {
    constructor(props) {
        super(props);
        self = this;
        this.state = {
            user_version: '1.0.0',
        }
    }

    componentWillMount() {
        let init = ebGetLocalStorageInit();
        console.log(init)
    }

    render() {
        let {user_version} = this.state;
        let {tabbar} = this.props;
        return (
            <View className={tabbar ? 'copyright-tabbar' : 'copyright'} style={{textAlign: 'center'}}>
            </View>
        )
    }
}

export default CopyRight