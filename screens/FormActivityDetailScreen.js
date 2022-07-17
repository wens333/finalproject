import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Animated, Button, TextInput, Image, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// React Native TextInput Effects
// import { Kaede } from 'react-native-textinput-effects';  //之後可刪
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
// 資料庫
import firebase from "firebase";

export default function FormActivityDetailScreen(props) {
    // const name = props.route.params.name || 'nothing get';
    const passProps = props.route.params.passProps || 'nothing get';

    // useEffect(() => {
    //     console.log(passProps)
    // }, [])

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

    // 取得 userUID
    const [userEmail, setUserEmail] = useState('');
    const [userUID, setUserUID] = useState('');
    firebase
        .auth()
        .onAuthStateChanged(function (user) {
            if (user) {
                // 使用者已登入，可以取得資料
                // console.log(user.email, user.uid);
                setUserEmail(user.email)
                setUserUID(user.uid)
            } else {
                // 使用者未登入
            }
        });

    // 活動報名
    const [userName, onChangeUserName] = React.useState(null);
    const [phone, onChangePhone] = React.useState(null);
    const [number, onChangeNumber] = React.useState(null);
    const attendAct = () => {
        if (phone.length !== 10 || userName.length === 0 || number.length === 0) {
            Alert.alert(
                '⚠️錯誤訊息', "欄位無填寫完成，請確認是否都填寫正確，謝謝=)", [
                { text: "OK", onPress: () => console.log("ok Pressed") },
            ]
            )
        }
        else {
            firebase.firestore()
                .collection("activityAttend").
                doc()
                .set({
                    activityTitle: passProps.title,
                    name: userName,
                    phoneNumber: phone,
                    people: number,
                    userUID: userUID,
                    smalltime: passProps.smalltime,
                    smallimage: passProps.smallimage,
                }, { merge: true })
                .then(function () {
                    Alert.alert(
                        passProps.title,
                        `已完成此活動報名`,
                        [
                            // {
                            //     text: "Cancel",
                            //     onPress: () => console.log("Cancel Pressed"),
                            //     style: "cancel"
                            // },
                            {
                                text: `ＯＫ`, onPress: () => pop("已完成此活動報名")
                            },
                        ]
                    );
                })
        }
    }

    const pop = (msg) => {
        console.log(msg)
        props.navigation.pop()
    }

    const [countPeople, setCountPeople] = useState(0)
    useEffect(() => {
        firebase
            .firestore()
            .collection('activityAttend')
            .where("activityTitle", "==", passProps.title)
            .onSnapshot((querySnapshot) => {
                const howManyPeople = []
                querySnapshot.forEach((doc) => {
                    howManyPeople.push(parseInt(doc.data().people))
                })
                // console.log(howManyPeople)
                let total = 0
                howManyPeople.forEach((item) => {
                    total += item
                })
                setCountPeople(total)
            })
    })
    // 活動統計人數
    const showPeople = () => {
        firebase
            .firestore()
            .collection('activityAttend')
            .where("activityTitle", "==", passProps.title)
            .onSnapshot((querySnapshot) => {
                const howManyPeople = []
                querySnapshot.forEach((doc) => {
                    howManyPeople.push(parseInt(doc.data().people))
                })
                let total = 0
                howManyPeople.forEach((item) => {
                    total += item
                })
                setCountPeople(total)
            })
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


    // fadeAnim will be used as the value for opacity. Initial Value: 0
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true // Add This line
        }).start();
    };
    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true // Add This line
        }).start();
    };
    //----------------取得驗證碼 → 驗證碼輸入無誤--------------

    const [randomNumber, setRandomNumber] = useState(0);
    const [validCode, setValidCode] = useState('');
    const [validState, setValidState] = useState('');


    const getRandomNumber = () => {
        setRandomNumber(Math.floor(Math.random() * (999 - 100 + 1)) + 100)
    }
    const valid = () => {
        if (parseInt(validCode) === randomNumber) {
            Alert.alert("驗證碼", "正確", [
                { text: "OK", onPress: () => console.log("ok Pressed") },
            ])
        }
        else {
            Alert.alert("⚠️錯誤", "輸入數值與驗證碼不符合", [
                { text: "OK", onPress: () => console.log("ok Pressed") },
            ])
        }
        // return parseInt(validCode) === randomNumber ? setValidState('與驗證碼相符') : setValidState('與驗證碼不符')
    }


    //----------------取得驗證碼 → 驗證碼輸入無誤--------------
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView style={{ width: '100%' }} >
                {/* 資料庫存圖片並讀取 >>OK*/}
                <View image>
                    <Image source={{ uri: passProps.imageURL }} style={{ width: '100%', height: 250 }} />
                </View>

                <View style={styles.containerInner}>
                    <View style={styles.textTitle}>
                        <Text style={{ fontSize: 40, fontWeight: '800', color: '#29342B' }}>{passProps.title}</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            alignItems: 'left',
                            justifyContent: 'center',
                            marginBottom: 10
                        }}
                    >
                        {/* 投票狀況icon>>OK */}
                        <View >
                            <Button title="本活動報名人數狀況 👈️" onPress={showPeople} />
                        </View>
                    </View>


                    <View style={styles.activityDetail} >
                        <View style={styles.activityList}>
                            <Text style={styles.activityTitle}><Ionicons name="location-outline" size={20} color="black" /> 活動地點：</Text>
                            <Text style={styles.activityContent}>{passProps.location}</Text>
                        </View>

                        <View style={styles.activityList}>
                            <Text style={styles.activityTitle}><Ionicons name="calendar-outline" size={20} color="black" /> 活動時間：</Text>
                            <Text style={styles.activityContent}>{passProps.date}</Text>
                        </View>

                        {/* 資料庫新增電話欄位並讀取>>不須 */}
                        <View style={styles.activityList}>
                            <Text style={styles.activityTitle}><Ionicons name="call-outline" size={20} color="black" /> 連絡電話：</Text>
                            <Text style={styles.activityContent}>(02)2811-0203</Text>
                        </View>

                        {/* 資料庫新增備註欄位並讀取  >>OK */}
                        <View style={styles.activityList}>
                            <Text style={styles.activityTitle}><Ionicons name="list-circle-outline" size={20} color="black" /> 備註：</Text>
                            <Text style={styles.activityContent}>{passProps.infoword}</Text>
                        </View>

                    </View>
                    {/* 資料庫修改詳細活動內容  >>OK */}
                    <View style={styles.textContent}>
                        <Text style={{ fontSize: 18 }}>{passProps.info}</Text>
                    </View>

                    <View style={styles.textInputSection}>

                        <View style={styles.textEnroll}>
                            <Text style={{
                                fontSize: 25, color: 'white', fontWeight: 'bold'
                            }}>
                                我要報名
                            </Text>
                        </View>

                        {/* 資料庫新增報名時間欄位並讀取   >>OK*/}
                        <View style={{ paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 18, color: '#4682B4', fontWeight: '800' }}>報名時間：</Text>
                            <Text style={{ fontSize: 18, color: '#4682B4', fontWeight: '800' }}>{passProps.ActivityTime}</Text>
                        </View>

                        <View style={styles.textInputSae}>
                            <Sae
                                label={'*姓名'}
                                iconClass={FontAwesomeIcon}
                                iconName={'user'}
                                iconColor={'#4682B4'}
                                inputPadding={16}
                                labelHeight={24}
                                // active border height
                                borderHeight={2}
                                // TextInput props
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={onChangeUserName}
                            />
                        </View>

                        <View style={styles.textInputSae}>
                            <Sae
                                label={'*聯絡電話'}
                                iconClass={FontAwesomeIcon}
                                iconName={'phone'}
                                iconColor={'#4682B4'}
                                inputPadding={16}
                                labelHeight={24}
                                // active border height
                                borderHeight={2}
                                // TextInput props
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={onChangePhone}
                                maxLength={10}//設定最多字數
                                keyboardType='number-pad'//只認數值
                            />
                        </View>

                        <View style={styles.textInputSae}>
                            <Sae
                                label={'*人數'}
                                iconClass={FontAwesomeIcon}
                                iconName={'users'}
                                iconColor={'#4682B4'}
                                inputPadding={16}
                                labelHeight={24}
                                // active border height
                                borderHeight={2}
                                // TextInput props
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={onChangeNumber}
                                keyboardType='number-pad'//只認數值
                            />
                        </View>

                        <View style={{ marginTop: '10%', paddingRight: '5%' }}>
                            <Text style={{ color: "#FF0000", textAlign: 'right' }}>有*號之欄位必須要填寫</Text>
                        </View>

                        <View style={styles.verificationSection}>

                            <View style={styles.verificationCode}>

                                <View style={styles.code}>
                                    <Text style={styles.codeText}>驗證碼：</Text>
                                    <ImageBackground
                                        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDjSEZRcm5xn32jgOx5hrdAUYkXLNaS42sbQ&usqp=CAU' }}
                                        resizeMode="cover"
                                        style={styles.codeImage}
                                    >
                                        <Text style={styles.codeNum}>{randomNumber}</Text>
                                    </ImageBackground>
                                </View>

                                <TextInput
                                    style={{ borderWidth: 2, padding: '3%', borderRadius: 4, borderColor: '#1B3D5B' }}
                                    fontSize='18'
                                    fontWeight='800'
                                    color='#1B3D5B'
                                    placeholder='輸入驗證碼'
                                    placeholderTextColor={'#A2AAAC'}
                                    textAlign='center'
                                    maxLength={3}
                                    secureTextEntry={false}
                                    keyboardType='numeric'
                                    onChangeText={(text) => { setValidCode(text) }}
                                />

                            </View>

                            <View style={styles.verificationCode}>
                                <TouchableOpacity
                                    style={styles.VerificationBtn}
                                    onPress={() => { getRandomNumber() }}
                                >
                                    <Text style={{ fontSize: 18, color: '#686D6F' }}>取得驗證碼</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.VerificationBtn}
                                    onPress={() => { valid() }}
                                >
                                    <Text style={{ fontSize: 18, color: '#686D6F' }}>送出驗證碼</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                        <View style={styles.bottomBarInner}>
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={() => attendAct()}
                            >
                                <Text style={styles.buttonText}>送出</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            </ KeyboardAwareScrollView>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
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
        marginBottom: '15%',
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
    codeText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1B3D5B',
        paddingVertical: '2%',
        textAlign: 'center'
    },
    codeNum: {
        fontSize: 18,
        fontWeight: '800',
        color: '#A4A7BA',
        paddingVertical: '2%',
        textAlign: 'center'
    },
    activityContent: {
        fontSize: 18,
        paddingLeft: '7%'
    },
    textInputSae: {
        paddingLeft: '5%',
        paddingRight: '5%'
    },
    textEnroll: {
        backgroundColor: '#FECA58',
        borderRadius: 5,
        paddingVertical: '3%',
        width: '50%',
        alignItems: 'center',
        position: 'relative',
        top: -25,
        left: '25%'
    },
    shadow: {
        backgroundColor: 'black',
        borderRadius: 5,
        paddingVertical: '3%',
        width: '50%',
        position: 'relative',
        left: '28%',
        top: 0,
        height: 45
    },
    textInputSection: {
        borderColor: '#F8D47C',
        borderWidth: 5,
        borderRadius: 10,
        height: 620,
        backgroundColor: '#F9EDCB',
        marginBottom: '10%'
    },
    verificationSection: {
        flexDirection: 'row',
        marginTop: '15%',
        paddingLeft: '5%',
    },
    verificationCode: {
        marginRight: '15%',
        width: '40%'
        //backgroundColor: 'purple'
    },
    code: {
        marginTop: '5%',
        flexDirection: 'row',
        marginBottom: '18%'
    },
    codeImage: {
        flex: 1,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: '#4682B4'
    },
    VerificationBtn: {
        backgroundColor: '#F8E27C',
        height: 35,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2%',
        marginBottom: '14%'
    },
    bottomBarInner: {
        marginTop: '10%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: '90%',
        backgroundColor: '#4682B4',
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '800'
    }

});
