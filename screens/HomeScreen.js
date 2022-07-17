import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity, Image, Dimensions } from 'react-native';
// SeiperFlatList - Coupon
import { SwiperFlatList, Pagination } from 'react-native-swiper-flatlist';
import { CustomPagination } from './CustomPagination';
// 資料庫
import firebase from 'firebase';
import { withDelay } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function HomeScreen(props) {
    let fakeData = [
        {
            id: "5NjMeLlFYqJ53FDjV6DD",
            deadline: "2021/11/30",
            picture: "https://firebasestorage.googleapis.com/v0/b/my-awesome-project-jack.appspot.com/o/uploadTestPicture%2Fstoregfive03.png?alt=media&token=5fb5e2d0-030b-4c02-800d-6e90e1a93363",
            store: "📣探索五金",
            text: "出示本畫面，消費滿千打九折"
        },
        {
            id: "pp2sOnx5kM6FPoRNK005",
            deadline: "2021/11/30",
            picture: "https://firebasestorage.googleapis.com/v0/b/my-awesome-project-jack.appspot.com/o/uploadTestPicture%2Fstoreeat0502.png?alt=media&token=5cfeefa6-082c-4fc9-bd07-8f4d073ab59e",
            store: "52懷舊小吃",
            text: "餓了？品嘗台灣在地小吃。消費滿千送折扣券"
        },
        {
            id: "qvZjTKButmQ4nuzb1qNT",
            deadline: "2021/11/30",
            picture: "https://firebasestorage.googleapis.com/v0/b/my-awesome-project-jack.appspot.com/o/uploadTestPicture%2Fstorebreakfast01.png?alt=media&token=43bd620d-cb42-4d86-9f55-4f8599c142b7",
            store: "早上七點",
            text: "🥢出示本畫面，早餐打九折🍲"
        },
        {
            id: "Lm2sOnx5kM6FPoRNKcch",
            deadline: "2021/11/30",
            picture: "https://firebasestorage.googleapis.com/v0/b/my-awesome-project-jack.appspot.com/o/uploadTestPicture%2Fstoregrocery02.png?alt=media&token=f1987600-aba6-4774-b175-49dd8e4f9213",
            store: "古早雜貨",
            text: "🥢在地人在地情，尋找童年回憶。滿500一起打七折"
        },
        {
            id: "Lm2sOnx5kM6FPoRNK005",
            deadline: "2021/11/30",
            picture: "https://firebasestorage.googleapis.com/v0/b/my-awesome-project-jack.appspot.com/o/uploadTestPicture%2Fstorerecycle0402.png?alt=media&token=90946aed-d615-4488-81d0-44145d4bc50b",
            store: "永循無包裝店",
            text: "愛地球，從此做起。自備容器打九折"
        },

    ]

    const [fakeFilterData, setFakeFilterData] = useState([])
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
    const [coupons, setCoupons] = React.useState([])
    // 優惠下架
    const [currentDate, setCurrentDate] = useState('');
    const [testCurrentDate, setTestCurrentDate] = useState(new Date().getDate());
    const [filterCoupons, setFilterCoupons] = useState([]);
    // console.log(currentDate)
    useEffect(() => {
        setCurrentDate(new Date().getDate()) //當下日期

        const testFilterData = fakeData.filter((item) => {
            return item.deadline !== currentDate
        })
        setFakeFilterData(testFilterData)
    }, []);

    React.useEffect(() => {
        // 年｜月｜日
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const date = new Date().getDate();
        setCurrentDate(year + '/' + month + '/' + date);
        // setCurrentDate(date);
        firebase
            .firestore()
            .collection("coupon")
            .onSnapshot((collectionSnapshot) => {
                const data = collectionSnapshot.docs.map(docSnapshot => {
                    const id = docSnapshot.id
                    return { ...docSnapshot.data(), id }
                })
                setCoupons(data)
            })
        let filter = coupons.filter((item, index, array) => {
            return item.deadline?.toDate().toLocaleDateString() !== currentDate
        })
        setFilterCoupons(filter)
    }, [])

    // console.log(currentDate) //當下時間
    const renderActivity = (cases) => {
        return (

            <TouchableOpacity onPress={() => showNoticeDetail(cases)} style={[styles.item]} >
                <Image style={styles.child} source={{ uri: cases.picture }} />
            </TouchableOpacity >
            // </View>
        )
    };

    const showNoticeDetail = (cases) => {
        Alert.alert(
            cases.store,
            cases.text,
            [
                { text: "OK", onPress: () => console.log('Nice') },
            ]
        );
    }
    //---------------------------------- Coupon優惠下架 & 連接 Firebase------------------
    return (
        <View style={styles.container}>

            {/* Coupon */}
            <View style={styles.topView}>
                <SwiperFlatList
                    autoplay
                    autoplayDelay={4}
                    autoplayLoop
                    index={0}
                    showPagination
                    data={fakeFilterData}
                    // fakeData - filterCoupons
                    renderItem={cases => renderActivity(cases.item)}
                    keyExtractor={cases => cases.id}
                />
            </View>

            <View style={styles.buttomView}>
                {/* <Text>123</Text> */}
                <TouchableOpacity
                    style={styles.btnContainer}
                    onPress={() => props.navigation.push('線上投票')}
                >
                    <Image
                        style={{ width: '100%', height: '100%' }}
                        source={require('./../images/imageVote.png')}
                    />
                    {/* <Text style={styles.btnText}>線上投票</Text> */}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnContainer}
                    onPress={() => props.navigation.push('工務修繕提報')}
                >
                    <Image
                        style={{ width: '100%', height: '100%' }}
                        source={require('./../images/imageRepair.png')}
                    />
                    {/* <Text style={styles.btnText}>工務修繕提報</Text> */}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnContainer}
                    onPress={() => props.navigation.push('活動報名表單')}
                >
                    <Image
                        style={{ width: '100%', height: '100%' }}
                        source={require('./../images/imageActivity.png')}
                    />
                    {/* <Text style={styles.btnText}>活動報名表單</Text> */}
                </TouchableOpacity>
            </View>

            <StatusBar style="auto" />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFBF0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // width: '90%',
        // height: '36%', //計算
        // marginVertical: '8%',
        marginTop: '10%', //7
        marginBottom: '2%',
    },
    buttomView: {
        width: '90%',
        height: '55%',
        marginBottom: '4%',
        paddingVertical: '1%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    btnContainer: {
        backgroundColor: '#D59694',
        width: '99%',
        height: '28%',
        borderWidth: 1,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#3C2A2A',
        fontSize: 28,
    },

    child: {
        height: height * 0.4,
        width,
        alignItems: 'center',
        // justifyContent: 'center',
    },
});
