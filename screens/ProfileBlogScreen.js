import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// 資料庫
import firebase from 'firebase';
// Firebase Authentication
import 'firebase/auth';
// 程式碼初始化太多次，故有此方案產生
import { initializeFirestore } from '../useCodeManyTimes/initializeFirestore';

export default function ProfileBlogScreen(props) {
    const { navigation } = props
    // 資料庫
    useEffect(() => {
        initializeFirestore()
    }, [])

    const passProps = props.route.params.passProps || 'nothing get';

    const [blogArticle, setBlogArticle] = useState([]);

    useEffect(() => {
        // 目前實作收藏
        firebase.firestore().collection("testBlogAdd").where('collectedBy', "array-contains", passProps)
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
                setBlogArticle(data)
            })
    }, []);

    // FlatList
    const showNoticeDetail = (cases) => {
        /* 傳到下一頁 */
        props.navigation.push('收藏文章', { passProps: cases })
    }
    //
    const renderActivity = (cases) => {
        //個人頁面的部落格顯示自己的貼文的版面
        return (
            < TouchableOpacity onPress={() => showNoticeDetail(cases)} >

                <View style={styles.mainView}>
                    <View style={styles.imageSection}>
                        <Image
                            style={styles.image}
                            source={{ uri: cases.blogPhotoURL }}
                        />
                    </View>
                    <View style={styles.mainViewContainer}>
                        {/* <View style={styles.mainViewCategory}> */}
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.TextCategory} >
                            {cases.blogItems}
                        </Text>
                        {/* </View> */}
                        <Text ellipsizeMode='tail' numberOfLines={2} style={styles.textTitle}>
                            {cases.blogTitle}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="heart" size={14} color="#b45f50" style={{ marginRight: 5 }} />
                            <Text
                                style={{ fontSize: 16, marginRight: 5 }}
                            >
                                {cases.likedBy?.length || 0}  </Text>
                            <Ionicons name="chatbox-ellipses" size={14} color="#50A6B4" style={{ marginRight: 5 }} />
                            <Text
                                style={{ fontSize: 16, marginRight: 5 }}
                            >
                                {cases.commentsCount || 0} </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.seperator} />

            </TouchableOpacity >
        )
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={blogArticle}
                renderItem={(post) => renderActivity(post.item)}
                keyExtractor={(post) => post.id}
                style={{ backgroundColor: '#FEFBF0' }}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({

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

    container: {
        flex: 1,
        backgroundColor: '#FEFBF0',
    },

    mainView: {
        backgroundColor: '#FEFBF0', //#FEFBF0
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '3%',
        paddingVertical: 10,
    },

    imageSection: {
        // backgroundColor: '#A5D',
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: 80,
        height: 80,
        borderRadius: 20,
    },

    mainViewContainer: {
        // backgroundColor: '#A5D',
        justifyContent: 'space-between',
        width: '72%',
    },
    TextCategory: {
        // backgroundColor: '#a2a',
        color: '#4169E1', //#4169E1 #4560AE
        fontSize: 15,
        textAlign: 'right',
        alignItems: 'center',
    },
    textTitle: {
        fontSize: 20,
        width: '90%',
    },
    seperator: {
        height: 5,
        backgroundColor: '#D5D2C9' //#ddada5 #D9D7CD
    },
    // actionButtonIcon: {
    //     fontSize: 20,
    //     height: 22,
    //     color: 'white',
    // },
});
