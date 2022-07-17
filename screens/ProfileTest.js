import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Button, Image, SafeAreaView, ScrollView, VirtualizedList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Ionicons from 'react-native-vector-icons/Ionicons';
// Radio Button -> 景茹推薦｜需要下載套件
import RadioButtonRN from 'radio-buttons-react-native';
import Dialog from "react-native-dialog";
// 資料庫
import firebase from 'firebase';
// Firebase Authentication
import 'firebase/auth';
// 程式碼初始化太多次，故有此方案產生
import { initializeFirestore } from '../useCodeManyTimes/initializeFirestore';

export default function ProfileTest(props) {
    // 資料庫
    useEffect(() => {
        initializeFirestore()
    }, [])

    const passProps = props.route.params.passProps || 'nothing get';

    // 讀取活動報名總人數
    useEffect(() => {
        firebase
            .firestore()
            .collection('activityAttend')
            .where("activityTitle", "==", passProps.title)
            .onSnapshot((querySnapshot) => {
                const howManyPeople = []
                let test = 0
                querySnapshot.forEach((doc) => {
                    // howManyPeople.push(parseInt(doc.data().people))
                    test += parseInt(doc.data().people)
                })
                let total = 0
                howManyPeople.forEach((item) => {
                    total += item
                })
                setCountPeople(test)
            })
    })

    // 讀取活動報名者資訊
    const [memberList, setMemberList] = useState([])
    useEffect(() => {
        firebase
            .firestore()
            .collection('activityAttend')
            .where("activityTitle", "==", passProps.title)
            .get()
            .then((collectionSnapshot) => {
                const data = collectionSnapshot.docs.map(docSnapshot => {
                    // 記得 React 有一個特點要使用 KEY            
                    const id = docSnapshot.id
                    // data -> 每一筆 document 物件底下的陣列資料
                    // document 物件資料、data 陣列資料
                    return { ...docSnapshot.data(), id }
                })
                setMemberList(data)
            })
    }, [])

    const [countPeople, setCountPeople] = useState(0)
    // 活動統計人數
    const showPeople = () => {
        Alert.alert(
            '投票數',
            `${passProps.title}／${countPeople}`,
            [
                // {
                //     text: "Cancel",
                //     onPress: () => console.log("Cancel Pressed"),
                //     style: "cancel"
                // },
                { text: 'OK', onPress: () => console.log(`NICE`) },
            ]
        );
    }

    const renderActivity = (cases) => {
        return (
            <View style={styles.txtForm}>
                <Text style={styles.enrollName}>{cases.name}</Text>
                <View style={styles.borderRender}></View>
                <Text style={styles.enrollPhone}>{cases.phoneNumber}</Text>
                <View style={styles.borderRender}></View>
                <Text style={styles.enrollCount}>{cases.people}</Text>
            </View>
        )
    };

    const showMemberList = (memberList) => {
        if (passProps === 'aa9tVklivRWdKuuu6fMN8U9va5g2') {
            // 里長 --> 報名人數列表
            props.navigation.push('ProfileActivityMemberList', { passProps: memberList })
        }
        else {
            // 里民 --> 自己報名活動
            // Alert.alert(
            //     cases.activityTitle,
            //     `當時參加人數有 ${cases.people} 位`,
            //     [
            //         { text: "OK", onPress: () => console.log('Good Job') },
            //     ]
            // );
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView style={{ width: '100%' }}>
                {/* <ScrollView> */}
                <View image>
                    <Image source={require('./../images/write.png')} style={{ width: '100%', height: 250 }} />
                </View>


                <View style={styles.containerInner}>

                    <View style={styles.textTitle}>
                        <Text style={{ fontSize: 40, fontWeight: '800', color: '#29342B' }}>淨灘 GOGOGO</Text>
                    </View>

                    <View style={styles.activityDetail} >
                        <View style={styles.activityList}>
                            <Text style={styles.activityTitle}><Ionicons name="location-outline" size={20} color="black" /> 活動地點：</Text>
                            <Text style={styles.activityContent}>963台東縣太麻里鄉</Text>
                        </View>

                        <View style={styles.activityList}>
                            <Text style={styles.activityTitle}><Ionicons name="calendar-outline" size={20} color="black" /> 活動時間：</Text>
                            <Text style={styles.activityContent}>2020/12/25 早上 7: 00 ~下午 5: 00</Text>
                        </View>

                        <View style={styles.activityList}>
                            <Text style={styles.activityTitle}><Ionicons name="call-outline" size={20} color="black" /> 連絡電話：</Text>
                            <Text style={styles.activityContent}>(02)2811-0203</Text>
                        </View>

                        <View style={styles.activityList}>
                            <Text style={styles.activityTitle}><Ionicons name="list-circle-outline" size={20} color="black" /> 備註：</Text>
                            <Text style={styles.activityContent}>記得帶防曬用品，太陽很大不要曬傷了喔！加油喔，你我一起努力！</Text>
                        </View>

                    </View>

                    <View style={styles.textContent}>
                        <Text style={{ fontSize: 18 }}>近年來受到海洋廢棄物影響，在海邊或沙灘偶而可以看到找不到貝殼，身上只背著塑膠瓶蓋的寄居蟹。{"\n"}{"\n"}
                            台東縣環保局說明，塑膠垃圾不容易會被生物、環境分解，還會隨著河流污染我們的生態環境，台東縣營造友善海洋環境，
                            逐步達成「無塑海洋」願景，因此特別呼籲大家不要亂丟垃圾，不管你在哪裡丟，不久後又可能隨著溪水、潮流漂到海岸邊，
                            造成很多環境問題。
                        </Text>
                    </View>


                    <View style={{ alignItems: 'flex-start' }}>
                        <Button title="本活動報名人數狀況 👈️" onPress={showPeople} />
                    </View>
                </View>
            </KeyboardAwareScrollView >

            <View style={styles.repaireSection}>
                <View style={styles.repaireTitle}>
                    <Text style={styles.repaireTitleText}>報名名單</Text>
                </View>

                <View style={styles.txtFormName}>
                    <Text style={styles.enrollName}>姓名</Text>
                    <View style={styles.borderRender}></View>
                    <Text style={styles.enrollPhone}>電話</Text>
                    <View style={styles.borderRender}></View>
                    <Text style={styles.enrollCount}>人數</Text>
                </View>
                {/* <SafeAreaView style={{ flex: 1 }}> */}
                <FlatList
                    data={memberList}
                    renderItem={(post) => renderActivity(post.item)}
                    keyExtractor={(post) => post.id}
                    style={{ paddingVertical: 5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                />
                {/* </SafeAreaView> */}
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFBF0',
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#9AC4F8'
    },
    title: {
        fontSize: 32,
        color: '#FFF'
    },
    containerInner: {
        flex: 1,
        marginHorizontal: '4%',
        marginTop: '4%',
    },
    textTitle: {
        marginTop: '1%',
        marginBottom: '5%'
    },
    textContent: {
        marginVertical: '5%',
        marginBottom: '5%',
        paddingHorizontal: '3%'
    },
    activityDetail: {
        padding: '3%',
        borderRadius: 10,
        backgroundColor: '#E1E6DE',
    },
    activityList: {
        paddingVertical: '1%',
        marginBottom: '1%'
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: '1%'
    },
    activityContent: {
        fontSize: 18,
        paddingLeft: '7%'
    },

    repaireSection: {
        width: '100%',
        height: '35%',
        marginVertical: 5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#585A56',
        // marginBottom: '10%',
        paddingBottom: '2%'
    },
    repaireTitle: {
        backgroundColor: '#F8E27C',
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        paddingVertical: 2,
        // paddingHorizontal: 10,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    repaireIcon: {
        marginHorizontal: 5,
    },
    repaireTitleText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    txtForm: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '1%',
        borderTopWidth: 2,
        borderTopColor: '#BEC0BC',
    },
    txtFormName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '1%',
    },
    enrollName: {
        width: '25%',
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: '4%'
    },
    enrollPhone: {
        width: '48%',
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: '4%'
    },
    enrollCount: {
        width: '25%',
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: '4%'
    },
    borderRender: {
        width: 2,
        backgroundColor: '#BEC0BC'
    },
});
