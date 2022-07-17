import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity, Image, Dimensions } from 'react-native';
// SeiperFlatList - Coupon
import { SwiperFlatList, Pagination } from 'react-native-swiper-flatlist';
import { CustomPagination } from './CustomPagination';
// 資料庫
import firebase from 'firebase';

const { width, height } = Dimensions.get('window');

export default function HomeCouponScreen(props) {

    let fakeData = [
        {
            id: "5NjMeLlFYqJ53FDjV6DD",
            deadline: "2021/11/30",
            picture: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Carrefour_logo.svg/200px-Carrefour_logo.svg.png",
            store: "便利商店",
            text: "九折優惠"
        },
        {
            id: "qvZjTKButmQ4nuzb1qNT",
            deadline: "2021/11/30",
            picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYenHZHHFFuPtonHXuJmVNDAZ2bsC7Iy2RZA&usqp=CAU",
            store: "Test2",
            text: "八折優惠"
        },
        {
            id: "qvZjTKButmQ4nuzb1qNU",
            deadline: "2021/11/3",

            picture: "https://firebasestorage.googleapis.com/v0/b/my-awesome-project-jack.appspot.com/o/uploadTestPicture%2Fstorebreakfast01.png?alt=media&token=a51a431b-5ce7-4ed6-b5db-4b989ed9839e",
            store: "Test3",
            text: "八折優惠"
        },
        // picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYenHZHHFFuPtonHXuJmVNDAZ2bsC7Iy2RZA&usqp=CAU",
        // {
        //     id: "testID",
        //     deadline: "2021/11/30",
        //     picture: '../images/store01.png',
        //     store: "📣三塊厝懷舊美食🍲",
        //     text: "出示本畫面，消費滿千打九折"
        // },
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
        //以下可以註解
        console.log("kkkkkkkk")
        // for (let index = 0; index < 3; index++) {
        //     { currentDate === fakeData[index].deadline ? console.log("the same one" + fakeData[index].deadline) : console.log("different" + fakeData[index].deadline) }
        // }

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
                {/* <Image style={styles.child} source={{ uri: cases.picture }} /> */}
                <Image style={styles.child} source={{ uri: cases.picture }} />
            </TouchableOpacity >
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

    return (
        <View style={styles.container}>
            {/* Coupon */}

            <View style={styles.swip}>
                {/* <SwiperFlatList
                    autoplay
                    autoplayDelay={2}
                    autoplayLoop
                    index={0}
                    showPagination
                    data={fakeFilterData}
                    // fakeData - filterCoupons
                    renderItem={cases => renderActivity(cases.item)}
                    keyExtractor={cases => cases.id}
                /> */}
            </View>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    child: {
        height: height * 0.4,
        width,
        alignItems: 'center',
    },
    swip: {
        flex: 0.5,
    },
    swiptext: {
        flex: 0.5,
        marginTop: 0.5,
        textAlign: 'center',
        justifyContent: 'center',
    },
});
