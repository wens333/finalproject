import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
// 資料庫
import firebase from "firebase";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function FormActivityScreen(props) {

    // 資料庫
    useEffect(() => {
        const firebaseConfig = {
            apiKey: "AIzaSyCrThxivVSo-ICZRbrx5b29peEaX74j_5w",
            authDomain: "graduate-project-carrot.firebaseapp.com",
            projectId: "graduate-project-carrot",
            storageBucket: "graduate-project-carrot.appspot.com",
            messagingSenderId: "551700585027",
            appId: "1:551700585027:web:ba6f87bf32b698b65e12f6",
            measurementId: "G-Y32RRXQX0L"
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    }, [])

    // Firbase Firestore
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('activity')
            .onSnapshot(querySnapshot => {
                const users = [];

                querySnapshot.forEach(documentSnapshot => {
                    users.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });

                setUsers(users);
                setLoading(false);
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);

    //-------------------timer過久問題解決方法-----------------------------------------------
    const _setTimeout = global.setTimeout;
    const _clearTimeout = global.clearTimeout;
    const MAX_TIMER_DURATION_MS = 60 * 1000;
    if (Platform.OS === 'android') {
        // Work around issue `Setting a timer for long time`
        // see: https://github.com/firebase/firebase-js-sdk/issues/97
        const timerFix = {};
        const runTask = (id, fn, ttl, args) => {
            const waitingTime = ttl - Date.now();
            if (waitingTime <= 1) {
                InteractionManager.runAfterInteractions(() => {
                    if (!timerFix[id]) {
                        return;
                    }
                    delete timerFix[id];
                    fn(...args);
                });
                return;
            }

            const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
            timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
        };

        global.setTimeout = (fn, time, ...args) => {
            if (MAX_TIMER_DURATION_MS < time) {
                const ttl = Date.now() + time;
                const id = '_lt_' + Object.keys(timerFix).length;
                runTask(id, fn, ttl, args);
                return id;
            }
            return _setTimeout(fn, time, ...args);
        };

        global.clearTimeout = id => {
            if (typeof id === 'string' && id.startsWith('_lt_')) {
                _clearTimeout(timerFix[id]);
                delete timerFix[id];
                return;
            }
            _clearTimeout(id);
        };
    }
    //--------------------------timer過久問題解決方法----------------------------------------

    // IT 鐵人實作
    const [posts, setPosts] = React.useState([])
    React.useEffect(() => {
        firebase
            .firestore()
            .collection("activity")
            .get()
            .then((collectionSnapshot) => {
                const data = collectionSnapshot.docs.map(docSnapshot => {
                    const id = docSnapshot.id
                    return { ...docSnapshot.data(), id }
                })
                setPosts(data)
            })
    }, [])

    const showNoticeDetail = (cases) => {
        /* 傳到下一頁 */
        props.navigation.push('活動詳細內容', { passProps: cases })
    }

    const renderActivity = (cases) => {
        return (
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
                            <Text style={{ fontSize: 22, marginTop: 25, fontWeight: 'bold' }}>{cases.title}</Text>
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

                {/* IT 鐵人實作 */}
                <FlatList
                    data={posts}
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
