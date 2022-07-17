import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
// 資料庫
import firebase from 'firebase';
// Firebase Authentication
import 'firebase/auth';
// 程式碼初始化太多次，故有此方案產生
import { initializeFirestore } from '../useCodeManyTimes/initializeFirestore';

export default function ProfilePollScreen(props) {
    // 資料庫
    useEffect(() => {
        initializeFirestore()
    }, [])

    const passProps = props.route.params.passProps || 'nothing get';

    const [pollInfo, setPollInfo] = useState([]);

    useEffect(() => {
        if (passProps === 'aa9tVklivRWdKuuu6fMN8U9va5g2') {
            firebase.firestore().collection("poll")
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
                    setPollInfo(data)
                })
        }
        else {
            firebase.firestore().collection("poll").where('member', "array-contains", passProps)
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
                    setPollInfo(data)
                })
        }
    }, []);

    // FlatList
    const showNoticeDetail = (cases) => {
        /* 傳到下一頁 */
        // testCountPeople(cases)
        if (passProps === 'aa9tVklivRWdKuuu6fMN8U9va5g2') {
            // 里長 --> 投票情況

            Alert.alert(
                `${cases.title}`,
                `是：${cases.yes} vs 否：${cases.no}`,
                [
                    { text: 'OK', onPress: () => console.log(`里長在操作`) },
                ]
            );
        }
        else {
            // 里民 --> 自己投票
            Alert.alert(
                `${cases.title}`,
                `是：${cases.yes} vs 否：${cases.no}`,
                [
                    { text: 'OK', onPress: () => console.log(`里民在操作`) },
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
            //     <Text style={[styles.title]}>{cases.title}</Text>
            // </TouchableOpacity >
            <TouchableOpacity
                style={styles.pollContainer}
                onPress={() => showNoticeDetail(cases)}
            >
                <View style={styles.pollContainerView}>
                    <View style={styles.imageSection}>
                        {Image && <Image source={require('./../images/homePollicon.png')} style={styles.image} />}
                    </View>
                    <View style={styles.txtSection}>
                        <Text style={styles.pollTextTitle}>{cases.title}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={pollInfo}
                renderItem={(post) => renderActivity(post.item)}
                keyExtractor={(post) => post.id}
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFBF0',
    },
    pollSection: {
        backgroundColor: '#FEFBF0',
        width: '100%',
        paddingVertical: 5,
    },
    pollContainer: {
        backgroundColor: '#F4Cd6c',
        marginHorizontal: '5%',
        borderWidth: 2,
        borderRadius: 10,
        marginVertical: 5,

    },
    pollContainerView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageSection: {
        width: '30%'
    },
    image: {
        width: 95,
        height: 95,
    },
    txtSection: {
        width: '65%',
        marginLeft: '3%',
    },
    pollTextTitle: {
        fontSize: 22,
        fontWeight: 'bold',
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
