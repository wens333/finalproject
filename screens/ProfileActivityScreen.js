import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
// 資料庫
import firebase from 'firebase';
// Firebase Authentication
import 'firebase/auth';
// 程式碼初始化太多次，故有此方案產生
import { initializeFirestore } from '../useCodeManyTimes/initializeFirestore';

export default function ProfileActivityScreen(props) {
    // 資料庫
    useEffect(() => {
        initializeFirestore()
    }, [])

    const passProps = props.route.params.passProps || 'nothing get';

    const [activitiesInfo, setActivitiesInfo] = useState([])

    useEffect(() => {
        if (passProps === 'aa9tVklivRWdKuuu6fMN8U9va5g2') {
            firebase.firestore().collection("activity")
                .get().then((collectionSnapshot) => {
                    // docs -> document 底下的陣列
                    // 陣列透過 map 可以拿到每一個 doc 的 Snapshot 物件
                    const data = collectionSnapshot.docs.map(docSnapshot => {
                        // 記得 React 有一個特點要使用 KEY            
                        const id = docSnapshot.id
                        // data -> 每一筆 document 物件底下的陣列資料
                        // document 物件資料、data 陣列資料
                        return { ...docSnapshot.data(), id }
                    })
                    setActivitiesInfo(data)
                })
        }
        else {
            firebase.firestore().collection("activityAttend").where('userUID', '==', passProps)
                .get().then((collectionSnapshot) => {
                    // docs -> document 底下的陣列
                    // 陣列透過 map 可以拿到每一個 doc 的 Snapshot 物件
                    const data = collectionSnapshot.docs.map(docSnapshot => {
                        // 記得 React 有一個特點要使用 KEY            
                        const id = docSnapshot.id
                        // data -> 每一筆 document 物件底下的陣列資料
                        // document 物件資料、data 陣列資料
                        return { ...docSnapshot.data(), id }
                    })
                    setActivitiesInfo(data)
                })
        }
    }, []);

    // const [countPeople, setCountPeople] = useState(0)
    // function testCountPeople(cases) {
    //     firebase
    //         .firestore()
    //         .collection('activityAttend')
    //         .where("activityTitle", "==", cases.title)
    //         .onSnapshot((querySnapshot) => {
    //             let countPeopleNumber = 0
    //             querySnapshot.forEach((doc) => {
    //                 countPeopleNumber += parseInt(doc.data().people);
    //             })
    //             setCountPeople()
    //             // return countPeopleNumber;
    //         })
    // }
    // FlatList
    const showNoticeDetail = (cases) => {
        /* 傳到下一頁 */
        // testCountPeople(cases)
        if (passProps === 'aa9tVklivRWdKuuu6fMN8U9va5g2') {
            // 里長 --> 各活動的報名總人數
            props.navigation.push('報名狀況', { passProps: cases })
            // console.log(cases)
            // console.log(activitiesInfo)

            // let filterData = activitiesInfo.filter(item => {
            //     return item.title ===
            // })

            // firebase
            //     .firestore()
            //     .collection('activityAttend')
            //     .where("activityTitle", "==", cases.title)
            //     .onSnapshot((querySnapshot) => {
            //         let countPeopleNumber = 0
            //         querySnapshot.forEach((doc) => {
            //             countPeopleNumber += parseInt(doc.data().people);
            //         })
            //         setCountPeople(countPeopleNumber)
            //     })

            // Alert.alert(
            //     '目前參加人數',
            //     `${cases.title}／${countPeople}`,
            //     [
            //         { text: 'OK', onPress: () => console.log(`NICE`) },
            //     ]
            // );
        }
        else {
            // 里民 --> 自己報名活動
            Alert.alert(
                cases.activityTitle,
                `當時參加人數有 ${cases.people} 位`,
                [
                    { text: "OK", onPress: () => console.log('Good Job') },
                ]
            );
        }
    }
    const renderActivity = (cases) => {
        return (
            // <TouchableOpacity
            //     onPress={() => showNoticeDetail(cases)}
            //     style={[styles.item]}
            // >
            //     <Text style={[styles.title]}>{passProps === 'aa9tVklivRWdKuuu6fMN8U9va5g2' ? cases.title : cases.activityTitle}</Text>
            // </TouchableOpacity >
            <View style={styles.pollSection}>
                <TouchableOpacity
                    style={styles.pollContainer}
                    onPress={() => showNoticeDetail(cases)}
                >
                    <View style={styles.btnRender}>
                        {/* 放圖片 */}
                        {/* <Image source={require('./../images/write.png')} style={styles.imgRender} /> */}
                        <Image source={{ uri: cases.smallimage }} style={styles.imgRender} />
                        <View style={styles.txtRender}>
                            <Text style={{ fontSize: 22, marginTop: 25, fontWeight: 'bold' }}>{passProps === 'aa9tVklivRWdKuuu6fMN8U9va5g2' ? cases.title : cases.activityTitle}</Text>
                            {/* 放報名時間 */}
                            {/* <Text style={{ fontSize: 14, color: '#48515A' }}>報名時間: 2021/12/20 ~ 2021/12/20</Text> */}
                            <Text style={{ fontSize: 14, color: '#48515A' }}>報名時間:  {cases.smalltime}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <View style={styles.allActivity}>
                <FlatList
                    data={activitiesInfo}
                    renderItem={(post) => renderActivity(post.item)}
                    keyExtractor={(post) => post.id}
                    style={{ paddingVertical: 5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                />
                <StatusBar style="auto" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFBF0',
        alignItems: 'center',
    },
    allActivity: {
        paddingVertical: '3%'
    },
    pollSection: {
        backgroundColor: '#FEFBF0', //#aa5
        width: '100%',
    },
    pollContainer: {
        backgroundColor: '#F4Cd6c',
        marginHorizontal: '5%',
        //alignItems: 'center',
        //paddingHorizontal: '10%',
        //paddingVertical: 30,
        borderWidth: 2,
        borderRadius: 10,
        marginVertical: 5,
    },
    btnRender: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '3%',
        paddingVertical: '3%'
    },
    txtRender: {
        //backgroundColor: 'pink',
        height: 80,
        justifyContent: 'space-between'
    },
    imgRender: {
        width: 80,
        height: 80,
        marginRight: '4%'
    }
});
