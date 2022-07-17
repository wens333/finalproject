import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Button, KeyboardAvoidingView, Image, Keyboard } from 'react-native';
// Radio Button -> 景茹推薦｜需要下載套件
import RadioButtonRN from 'radio-buttons-react-native';
import Dialog from "react-native-dialog";
// 資料庫
import firebase from 'firebase';
// Firebase Authentication
import 'firebase/auth';
// 程式碼初始化太多次，故有此方案產生
import { initializeFirestore } from '../useCodeManyTimes/initializeFirestore';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';//icon
import AntDesign from 'react-native-vector-icons/AntDesign';//icon


export default function ProfileFixDetailScreen(props) {
    // 資料庫
    useEffect(() => {
        initializeFirestore()
    }, [])

    const passProps = props.route.params.passProps || 'nothing get';

    // Radio Button -> 景茹推薦
    const data = [
        {
            label: '是'
        },
        {
            label: '否'
        }
    ];
    const [isVisible, setIsVisible] = useState(false);
    const [checked, setChecked] = useState('');
    const fixingFinished = () => {
        setIsVisible(!isVisible)
        if (checked === "是") {
            firebase.firestore()
                .collection("repairForm")
                .doc(passProps.id)
                .update({
                    isFixing: true
                })
                .then(() => {
                    console.log("Document successfully updated --> isFixing: true");
                })
        }
        else if (checked === "否") {
            firebase.firestore()
                .collection("poll")
                .doc(passProps.id)
                .update({
                    isFixing: false
                })
                .then(() => {
                    console.log("Document successfully updated --> isFixing: false");
                })
        }
        setIsVisible(!isVisible)
    }

    const [test, setTest] = useState({})
    useEffect(() => {
        firebase
            .firestore()
            .collection('repairForm')
            .doc(passProps.id)

            .onSnapshot((docSnapshot) => {
                const data = docSnapshot.data()
                setTest(data)
            })
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.containerInner}>
                <KeyboardAwareScrollView>

                    <View style={styles.topicSection}>
                        {/* <Text style={styles.topicText}>公園設施-故障</Text> */}
                        {/*暫時抓topic當標題___之後要設定一個不同的才不會重複*/}
                        <Text style={styles.topicText}>{passProps.topic}</Text>
                    </View>

                    <View style={styles.topInner}>
                        <View style={styles.topSection}>
                            <Text style={styles.topText}>申報時間：2021/01/05 15:54</Text>
                            {/*非string有問題*/}
                            {/* <Text style={styles.topicText}>{passProps.datetime}</Text> */}
                        </View>

                        <View style={styles.topSection}>
                            {/* <Text style={styles.topText}>申報人：泰開心</Text> */}
                            <Text style={styles.topText}>申報人：{passProps.name}</Text>
                        </View>

                        <View style={styles.topSection}>
                            {/* <Text style={styles.topText}>申報人連絡電話：0912345678</Text> */}
                            <Text style={styles.topText}>申報人連絡電話：{passProps.phone}</Text>
                        </View>
                    </View>

                    <View style={styles.repaireSection}>
                        <View style={styles.repaireTitle}>
                            <MaterialIcons name="place" size={30} color="white" style={styles.repaireIcon} />
                            <Text style={styles.repaireTitleText}>修繕地址</Text>
                        </View>
                        {/* <Text style={styles.repaireText}>新北市泰山區武林十四路九段66巷999號</Text> */}
                        <Text style={styles.repaireText}>{passProps.address}</Text>
                    </View>

                    <View style={styles.repaireSection}>
                        <View style={styles.repaireTitle}>
                            <MaterialIcons name="content-paste" size={30} color="white" style={styles.repaireIcon} />
                            <Text style={styles.repaireTitleText}>申報事由</Text>
                        </View>
                        {/* <Text style={styles.repaireText} >
                            世界需要改革，需要對快樂有新的認知。不要先入為主覺得快樂很複雜，實際上，快樂可能比你想的還要更複雜。我們不得不面對一個非常尷尬的事實，那就是，問題的核心究竟是什麼？
                        </Text> */}
                        <Text style={styles.repaireText}>{passProps.content}</Text>
                    </View>

                    <View style={styles.repaireSection}>
                        <View style={styles.repaireTitle}>
                            <AntDesign name="picture" size={30} color="white" style={styles.repaireIcon} />
                            <Text style={styles.repaireTitleText}>圖片</Text>
                        </View>

                        <View style={styles.imageSection}>
                            {/*要再設定if else判斷是否有照片設定框格大小*/}
                            {/* {Image && <Image source={require('./../images/carrotPhoto.jpg')} style={{ width: 200, height: 200, borderRadius: 4 }} />} */}
                            {/* ({{ uri: passProps.phoneUrl }}===null)? <Image source={{ uri: passProps.phoneUrl }} style={{ width: 200, height: 200, borderRadius: 4 }} /> : <Image source={{ uri: passProps.phoneUrl }} style={{ width: 0, height: 0, borderRadius: 4 }} /> */}
                            <Image source={{ uri: passProps.phoneUrl }} style={{ width: 200, height: 200, borderRadius: 4 }} />
                        </View>
                    </View>

                    <View style={styles.bottomBarInner}>
                        <TouchableOpacity
                            style={styles.btnSend}
                            onPress={() => setIsVisible(!isVisible)}>
                            <Text style={styles.btnSendText}>
                                審核按鈕</Text>
                        </TouchableOpacity>
                    </View>

                    <Dialog.Container visible={isVisible}>
                        <Dialog.Title>{passProps.address}</Dialog.Title>

                        <RadioButtonRN
                            data={data}
                            selectedBtn={(e) => setChecked(e.label)}
                        />
                        <Dialog.Button label="取消" onPress={() => setIsVisible(!isVisible)} />
                        <Dialog.Button label="送出" onPress={() => fixingFinished()} />
                    </Dialog.Container>
                </KeyboardAwareScrollView>
            </View >

            <StatusBar style="auto" />
        </View >


        // <View style={styles.container}>
        //     <Button
        //         title="修繕回報"
        //         onPress={() => setIsVisible(!isVisible)}
        //     />
        // <Dialog.Container visible={isVisible}>
        //     <Dialog.Title>{passProps.address}</Dialog.Title>

        //     <RadioButtonRN
        //         data={data}
        //         selectedBtn={(e) => setChecked(e.label)}
        //     />
        //     <Dialog.Button label="取消" onPress={() => setIsVisible(!isVisible)} />
        //     <Dialog.Button label="送出" onPress={() => fixingFinished()} />
        // </Dialog.Container>
        //     <StatusBar style="auto" />
        // </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFBF0',

    },
    containerInner: {
        flex: 1,
        marginHorizontal: '4%',
        marginTop: '4%',
    },

    topicSection: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 5,

    },
    topicText: {
        fontSize: 30,
        fontWeight: 'bold',
    },


    topInner: {
        paddingVertical: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#585A56',
    },
    topSection: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 5,
    },
    topText: {
        fontSize: 20,
    },

    repaireSection: {
        width: '100%',
        marginVertical: 5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#585A56',
    },
    repaireTitle: {
        backgroundColor: '#dd978f',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        paddingVertical: 2,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    repaireIcon: {
        marginHorizontal: 5,
    },
    repaireTitleText: {
        fontSize: 20,
        color: '#fff'
    },
    repaireText: {
        fontSize: 20,
        marginBottom: 5,
        paddingHorizontal: 5,
    },
    imageSection: {
        width: '100%',
        marginBottom: 5,
        paddingHorizontal: 5,
    },
    bottomBarInner: {
        width: '100%',
        height: 40,
        marginVertical: 5
    },
    btnSend: {
        backgroundColor: "#dd978f",
        width: '100%',
        height: 40,
        justifyContent: 'center',
        borderRadius: 10,
    },
    btnSendText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
    },


    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // item: {
    //     padding: 20,
    //     marginVertical: 8,
    //     marginHorizontal: 16,
    //     backgroundColor: '#9AC4F8'
    // },
    // title: {
    //     fontSize: 32,
    //     color: '#FFF'
    // },
});
