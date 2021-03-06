import React, { useState, useEffect, useContext } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Text,
    Dimensions,
    Animated,
    Button,
    ImageBackground,
    FlatList,
    TouchableOpacity
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from '../database/config'
import { exp } from 'react-native-reanimated';
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-paper'
import { AuthContext } from '../navigations/AuthContext'

const { width, height } = Dimensions.get("window")

let index = null
let dataUser = {}
const Dashboardmemo = (() => {
    const { user, setUser } = useContext(AuthContext);
    
    const [data, setData] = useState([])
    const [flag, setFlag] = useState(false)
    const [show, setShow] = useState(false)

    const rootRef = firebase.database().ref();
    const animalRef = rootRef.child('/').orderByKey();
    const List = (props) => {
        const [showColor,setShowColor] = useState(false)
        useEffect(()=>{
            const interval = setTimeout(() => {
            setShowColor(!showColor);
            return () => {
                clearInterval(interval)
            }
        }, 600);
        })

        return (
            <>
                <TouchableOpacity onPress={() => { index = props.data.id; setShow(true);console.log(index) }} style={props.data.velo > 200 ? (showColor)?styles.warningDrop:styles.warningDropNo :styles.warningDropNo}>
                    <View style={styles.title}>
                        <View >
                            <Text style={styles.header}>Tên</Text>
                            <Text>{props.data.name}( {props.data.bedId})</Text>
                        </View>
                        <View style={styles.datas}>
                            <View style={styles.data}>
                                <Text style={styles.header}>Tốc độ</Text>
                                <Text>{props.data.velo}</Text>
                            </View>
                            <View style={styles.data}>
                                <Text style={styles.header}>Trạng thái</Text>
                                {props.data.stt ? <MCIcons name={'water'} size={25} /> : <MCIcons name={'water-off'} size={25} />}
                            </View>
                            <View style={styles.data}>
                                <Text style={styles.header}>Thời gian</Text>
                                <Text style={props.data.time >= 15 ? styles.warningTime : styles.warningTimeNo}>{props.data.time}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    useEffect(() => {

        animalRef.on('value', (child) => {
            let dataTemp = []
            child.forEach((doc) => {
                let key = doc.key
                let childData = doc.val()
                childData = { ...childData, id: key }
                dataTemp.push(childData)
            })
            if (flag) {
                dataTemp.sort((a, b) => {
                    return a.time - b.time
                })
            }
            else {
                dataTemp.sort((a, b) => {
                    return -a.time + b.time
                })
            }

            setData(dataTemp)

        })
    }, [flag])
    data.forEach((it) => {
        if (it.id == index) {
            dataUser = it
        }
    })
    const setDataName = ()=>{
        const modifyData = rootRef.child(`${dataUser.id}`).update({
            name:dataUser.name,
            bedId:dataUser.bedId
        });
        setShow(false)
    }
    const increase = ()=>{
        const modifyData = rootRef.child(`${dataUser.id}`)
        modifyData.once("value").then((snap)=>{dataUser.angle = snap.toJSON().angle})
        
        if(dataUser.angle<145){
            dataUser.angle++;
            rootRef.child(`${dataUser.id}`).update({
                angle:dataUser.angle,
            });
        }
    }   
        const decrease = ()=>{
            const modifyData = rootRef.child(`${dataUser.id}`)
            modifyData.once("value").then((snap)=>{dataUser.angle = snap.toJSON().angle})
            
            if(dataUser.angle>120){
                dataUser.angle--;
                rootRef.child(`${dataUser.id}`).update({
                    angle:dataUser.angle,
                });
            }
    }
    return (
        <View style={styles.container}>
            
            <View style={styles.order}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { setFlag(!flag) }} >
                    <Text style={{ color: 'gray', marginTop: 3 }}>Sắp xếp</Text>
                    <MCIcons name={'menu-swap'} size={25} color={'gray'} />
                </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: '#f5f5f5', height: 13 }}>

            </View>
            <View style={{ alignItems: 'center', width: width, marginBottom: 50 }}>
                <FlatList
                    data={data}
                    renderItem={(it,) => {
                        return (<List data={it.item}></List>)

                    }}
                    keyExtractor={item => item.id}
                />
            </View>
            <Modal
                isVisible={show}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
                style={{
                    height: 500,
                }}
            >
                <View style={styles.modals}>
                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => setShow(false)} style={{ alignItems: 'flex-end' }}>
                            <MCIcons name={'close-octagon-outline'} size={30} color={'#0AC4BA'} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thông tin bệnh nhân</Text>
                    </View>
                    <TextInput
                        label='Tên'
                        mode='outlined'
                        onChangeText={text=>dataUser.name = text}
                        placeholder = {dataUser.name}

                    />
                    <TextInput
                        label='Giường Bệnh'
                        mode='outlined'
                        onChangeText={text=>dataUser.bedId = text}
                        placeholder = {dataUser.bedId}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 15, marginTop: 10 }}>Tốc độ chảy:  </Text>
                        <Text style={{ fontSize: 15, marginTop: 10 }}>{dataUser.velo} giọt/phút</Text>
                    </View>
                    <View style={{ flexDirection: 'column', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 15 }}>Tăng vận tốc: </Text>
                            <TouchableOpacity onPress={increase}>
                                <MCIcons name='trending-up' size={40} color={'#0AC4BA'} ></MCIcons>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 15 }}>Giảm vận tốc: </Text>
                            <TouchableOpacity onPress={decrease}>
                                <MCIcons name='trending-down' size={40} color={'#0AC4BA'} ></MCIcons>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={{ alignItems: 'center', marginVertical: 5 }}>
                        <TouchableOpacity style={{width: 200, alignItems: 'center' }} onPress={setDataName}>
                            <View style={{backgroundColor:'#0AC4BA',padding:13}}>
                                <Text style={{fontSize:20}}>Đồng ý</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View >
    )
}
)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    order: {
        paddingRight: 15,
        paddingVertical: 8,
        width: width,
        alignItems: 'flex-end',
        backgroundColor: 'white',
    },
    title: {
        width: width * 0.9,
        borderWidth: 1,
        flexDirection: 'row',
        height: 70,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        borderRadius: 10,

    },
    header: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    datas: {
        flexDirection: 'row',
    },
    data: {
        marginHorizontal: 15,
        alignItems: 'center'
    },
    warningTime: {
        color: 'red',
        fontSize: 18
    },
    warningTimeNo: {
        color: 'brown',
        fontSize: 18
    },
    warningDrop: {
        margin: 2,
        borderRadius: 10,
        backgroundColor: '#d3e0ea',
    },
    warningDropNo: {
        backgroundColor: '#f6f5f5',
        margin: 2,
        borderRadius: 10,
    },
    modals: {
        flexDirection: 'column',
        backgroundColor: 'white',

        padding: 20,
        borderRadius: 20,
    }
})
export default Dashboard = React.memo(Dashboardmemo)