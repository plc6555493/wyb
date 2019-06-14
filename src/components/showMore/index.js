import Taro from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import './index.scss';


class ShowMore extends Taro.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {text} = this.props;
        return (
					<View className='more'><View className='more_text'>{text?text:"更多内容敬请期待"}</View></View>
				)
    }
}

export default ShowMore