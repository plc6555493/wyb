import Taro from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import './index.scss';
import defau from '../../asset/image/emptyList.png'



let self = null;

class PageData extends Taro.Component {
    constructor(props) {
        super(props);
        self = this;
    }

    componentWillMount() {
    }

    render() {
        return (
            <Image className='defaultPage' src={defau}>
            </Image>
        )
    }
}
export default PageData