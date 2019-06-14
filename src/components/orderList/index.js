import Taro from '@tarojs/taro'
import {View, Input, Image,Text} from '@tarojs/components'
import './index.scss'
import to_preview from "../../asset/image/to_preview.png"
import un_preview from "../../asset/image/un_preview.png"
import to_upload from "../../asset/image/to_upload.png"
import un_upload from "../../asset/image/un_upload.png"


export default class OrderList extends Taro.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	upload(k) {
		this.props.upload && this.props.upload(k)
	}

	preview(k) {
		this.props.preview && this.props.preview(k)
	}

	bottom(k) {
		this.props.bottom && this.props.bottom(k)
	}
	chooseTime(q,k){
		this.props.chooseTime && this.props.chooseTime(q,k)
	}
    toSelectList(k){
        this.props.toSelectList && this.props.toSelectList(k)
    }
	render() {
		let {orderList,timeList} = this.props;
		return (
			<View>
				{orderList && orderList.map((v, k) => {
					console.log('v是',v);
					// v.chooseTimeList=[];
                        return (
                            <View className="order" taroKey={k}
                                    style={v.order_display||(v.order_state==='1'?{display:'block'}:{display:'none'})}
                            >
                                <View className="title"
                                      style={v.order_state==='3'?{backgroundColor:'#E8283F'}
                                      :(v.order_state==='2'?{backgroundColor:'#FDE516'}
                                      :(v.order_state==='1'?{backgroundColor:'#1EE37F'}
                                      :{backgroundColor:'#FDE516'}))}>
                                    <View className="id">{v.order_sn}</View>
                                    <View className="date">{v.create_time}</View>
                                </View>
                                <View className="advert">
                                    <View className="advert-title">广告内容</View>
                                    <View className="advert-content">
                                        <Input className="input"
                                               placeholder={v.placeholder||v.order_placeholder}
                                               disabled="true"
                                        />
                                        <Image className="preview"
                                               src={v.order_state!=='4'?to_preview:un_preview}
                                               onClick={v.order_state!=='4'?this.preview.bind(this, k):null}
                                        />
                                        <Image className="upload"
                                               src={v.order_state==='1'||v.order_state==='2'?to_upload:un_upload}
                                               onClick={v.order_state==='1'||v.order_state==='2'?this.upload.bind(this, k):null}
                                        />
                                    </View>
                                </View>
                                <View className="duration">
                                    <View className="duration-title">投放时长</View>
                                    <View className="duration-content">
                                        {/*map时长列表*/}
                                        {
                                            timeList && timeList.map((p,q)=>{
                                                v.chooseTimeList.push(v.chooseId===q
													?{choose:(v.order_state==='1'||v.order_state==='2'
															?{backgroundColor:'#3176E7',color:'white'}
															:{backgroundColor:'#DDDDDD',color:'white'})}
													:{choose:{}});
                                            return(

                                                <View className="seconds"
                                                      onClick={v.order_state==='1'||v.order_state==='2'
														  ?this.chooseTime.bind(this, q,k)
														  :null}
                                                      style={v.chooseTimeList[q].choose}
                                                      taroKey={q}
                                                >{p}</View>
                                            )
                                        })}
                                    </View>
                                </View>
                                <View className="period">
                                    <View>
                                        <View className="period-title">投放周期</View>
                                        <View className="point"
                                              onClick={this.toSelectList.bind(this,k)}>
											{v.order_state!=='4'?'设置投放点':null}</View>
                                    </View>
                                    <View className="period-content">{v.create_time}
                                        ~{v.create_time}</View>
                                </View>
                                {
                                    v.order_state!=='4'?
                                        (<View className="equipment">
                                            <View className="equipment-title">投放设备</View>
                                            <View className="equipment-content">{
                                            	v.equipment&&v.equipment.map((m,n)=>{
                                            		return(
                                            			<Text taroKey={n}
															className='equipment-id'
														>{m}</Text>
													)
												})
											}
                                            </View>
                                        </View>):
                                        (
                                            <View className="equipment">
                                                <View className="equipment-title">未通过原因<Text style={{color:'#E8283F'}}>*</Text></View>
                                                <View className="equipment-content1">由于您的投放内容涉嫌违反相关法律法规，请修改后重新提交。
                                                </View>
                                            </View>
                                        )
                                }

                                <View className="bottom"
                                      style={v.order_state==='4'?{backgroundColor:'#E8283F'}
                                          :(v.order_state==='3'?{backgroundColor:'#DDDDDD'}
                                          :(v.order_state==='2'?{backgroundColor:'#3176E7'}
                                          :{backgroundColor:'#3176E7'}))}
                                      onClick={v.order_state==='1'||v.order_state==='2'?this.bottom.bind(this, k):null}>
                                    {
                                        v.order_state==='4'?'审核未通过'
                                            :(v.order_state==='3'?'正在审核…':'确认修改')
                                    }
                                </View>
                            </View>
                        )

				})
				}
			</View>
		)
	}
}
