import Taro from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import './index.scss';

/**
 * 营销类活动
 */
class ActivityMarketing extends Taro.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {text} = this.props;
        return (
					<View className='bottom'>营销类活动</View>
				)
    }
}

export default ActivityMarketing