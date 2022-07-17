import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
// 資料庫
import firebase from 'firebase';
// Firebase Authentication
import 'firebase/auth';
// 程式碼初始化太多次，故有此方案產生
import { initializeFirestore } from '../useCodeManyTimes/initializeFirestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function ProfileDetailScreen(props) {
    // 資料庫
    useEffect(() => {
        initializeFirestore()
    }, [])

    const passProps = props.route.params.passProps || 'nothing get';

    const [fixingMessage, setFixingMessage] = useState([]);

    // useEffect(() => {
    //     if (passProps === "aa9tVklivRWdKuuu6fMN8U9va5g2") {
    //         firebase.firestore().collection("repairForm").get().then((collectionSnapshot) => {
    //             // docs -> document 底下的陣列
    //             // 陣列透過 map 可以拿到每一個 doc 的 Snapshot 物件
    //             const data = collectionSnapshot.docs.map(docSnapshot => {
    //                 // 記得 React 有一個特點要使用 KEY            
    //                 const id = docSnapshot.id
    //                 // data -> 每一筆 document 物件底下的陣列資料
    //                 // document 物件資料、data 陣列資料
    //                 return { ...docSnapshot.data(), id }
    //             })
    //             setFixingMessage(data)
    //         })
    //     }
    //     else {
    //         firebase.firestore().collection("repairForm").where('isFixing', '==', false).get().then((collectionSnapshot) => {
    //             // docs -> document 底下的陣列
    //             // 陣列透過 map 可以拿到每一個 doc 的 Snapshot 物件
    //             const data = collectionSnapshot.docs.map(docSnapshot => {
    //                 // 記得 React 有一個特點要使用 KEY            
    //                 const id = docSnapshot.id
    //                 // data -> 每一筆 document 物件底下的陣列資料
    //                 // document 物件資料、data 陣列資料
    //                 return { ...docSnapshot.data(), id }
    //             })
    //             setFixingMessage(data)
    //         })
    //     }
    // }, []);

    useEffect(() => {
        // desc --> 完成在上，處理在下；asc --> 完成在下，處理在上
        firebase.firestore().collection("repairForm").orderBy("isFixing", "asc").get().then((collectionSnapshot) => {
            // docs -> document 底下的陣列
            // 陣列透過 map 可以拿到每一個 doc 的 Snapshot 物件
            const data = collectionSnapshot.docs.map(docSnapshot => {
                // 記得 React 有一個特點要使用 KEY            
                const id = docSnapshot.id
                // data -> 每一筆 document 物件底下的陣列資料
                // document 物件資料、data 陣列資料
                return { ...docSnapshot.data(), id }
            })
            setFixingMessage(data)
        })
    }, []);

    // FlatList
    const showNoticeDetail = (cases) => {
        /* 傳到下一頁 */
        if (passProps === 'aa9tVklivRWdKuuu6fMN8U9va5g2') {
            if (cases.isFixing === true) { // 完成修繕
                Alert.alert(
                    "修繕表單",
                    "完成修繕，政績加一",
                    [
                        { text: "OK", onPress: () => console.log("里長政績 + 1") },
                    ]
                );
            }
            else { // 等待審核中
                props.navigation.push('修繕狀況詳細內容', { passProps: cases })
            }
        }
        else {
            if (cases.isFixing === true) {
                Alert.alert(
                    "修繕表單",
                    "已完成修繕，感謝您的通報",
                    [
                        { text: "OK", onPress: () => console.log(passProps) },
                    ]
                );
            }
            else {
                Alert.alert(
                    "修繕表單",
                    "修繕中，請稍後",
                    [
                        { text: "OK", onPress: () => console.log(passProps) },
                    ]
                );
            }
        }
    }
    const renderActivity = (cases) => {
        return (
            // <TouchableOpacity
            //     onPress={() => showNoticeDetail(cases)}
            //     style={[styles.item]}
            // >
            //     <Text style={[styles.title]}>{cases.address}</Text>
            // </TouchableOpacity >

            <View style={styles.pollSection}>
                <TouchableOpacity
                    style={styles.pollContainer}
                    onPress={() => showNoticeDetail(cases)}
                >
                    <View style={styles.btnRender}>
                        <Image source={require('./../images/repair.png')} style={styles.imgRender} />

                        <View style={styles.txtRender}>
                            {/* 加上狀態 */}
                            <Text style={styles.statusRepair}>{cases.isFixing ? "完成修繕" : "處理中"}</Text>
                            {/* 加上種類 */}
                            {/* <Text style={{ fontSize: 22, fontWeight: 'bold' }}>公園設施 - 故障</Text> */}
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{cases.topic}</Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.addressRender}>{cases.address}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>


        )
    };

    return (
        // <KeyboardAwareScrollView style={styles.container}>

        <View style={styles.container}>
            <View style={styles.allActivity}>

                <FlatList
                    data={fixingMessage}
                    renderItem={(post) => renderActivity(post.item)}
                    keyExtractor={(post) => post.id}
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                />
            </View>
            <StatusBar style="auto" />
        </View>
        // </KeyboardAwareScrollView>

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
        borderWidth: 2,
        borderRadius: 10,
        marginVertical: 5,
    },
    btnRender: {
        flexDirection: 'row',
        paddingHorizontal: '3%',
        paddingVertical: '3%',
    },
    txtRender: {
        width: '70%',
        //backgroundColor: 'pink',
        justifyContent: 'space-between',
    },
    imgRender: {
        width: 80,
        height: 80,
        marginRight: '4%'
    },
    statusRepair: {
        fontSize: 14,
        //backgroundColor: 'green',
        textAlign: 'right',
        color: '#48515A',

    },
    addressRender: {
        fontSize: 16,
        color: '#48515A',
        marginTop: '5%'
    },
});

