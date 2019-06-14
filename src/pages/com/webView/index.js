import Taro, {Component} from '@tarojs/taro'
import {View, Button} from '@tarojs/components'
import './index.scss'
import {ebGetRouterParams, ebSetTitleAndReturnState} from '../../../utils';

let self

export default class Index extends Component {
	constructor(props) {
		super(props)
		self = this
		self.state = {
			params: {
				ebsrc: null,
			}
		}
	}

	componentWillMount() {
		let params = ebGetRouterParams(this);
		console.log('获得地址栏参数:', params)
		self.setState({params})
	}

	componentDidMount() {
		ebSetTitleAndReturnState(self);
	}


	render() {

		let {params} = self.state
		let {ebsrc} = params

		return (
			<View>
				<web-view src={"https://web.ewyb.cn/preview?t0=pdf&u0="+ebsrc}></web-view>
			</View>
		)
	}
}

