import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Animated, TouchableOpacity, Image } from 'react-native';
// 資料庫
import firebase from 'firebase';
// Firebase Authentication
import 'firebase/auth';
// Radio Button -> 景茹推薦｜需要下載套件
import RadioButtonRN from 'radio-buttons-react-native';
import Dialog from "react-native-dialog";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';//icon

export default function HomePollDetailScreen(props) {
    const passProps = props.route.params.passProps || 'nothing get';

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

    // Polling Need
    const [checked, setChecked] = useState('');
    const pollingFinished = () => {
        if (checked === "是") {
            firebase.firestore()
                .collection("poll")
                .doc(passProps.id)
                .update({
                    yes: firebase.firestore.FieldValue.increment(1),
                    member: firebase.firestore.FieldValue.arrayUnion(userUID)
                }, { merge: true })
                .then(function () {
                    console.log("投票已完成");
                })
        }
        else if (checked === "否") {
            firebase.firestore()
                .collection("poll")
                .doc(passProps.id)
                .set({

                    no: firebase.firestore.FieldValue.increment(1),
                    member: firebase.firestore.FieldValue.arrayUnion(userUID)
                }, { merge: true })
                .then(function () {
                    console.log("投票已完成");
                })
        }
        setIsVisible(!isVisible)
    }

    // Polling Check Member Only One
    const [members, setMembers] = React.useState([])
    const [pollingMember, setPolllingMember] = React.useState([])
    useEffect(() => {
        firebase.firestore()
            .collection("poll")
            .doc(passProps.id)
            .get()
            .then((docSnapshot) => {
                const data = docSnapshot.data()
                setPolllingMember(pollingMember)
            })
        console.log(pollingMember)
    }, []);

    const [userEmail, setUserEmail] = useState('');
    const [userUID, setUserUID] = useState('');
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // 使用者已登入，可以取得資料
            // console.log(user.email, user.uid);
            setUserEmail(user.email)
            setUserUID(user.uid)
        } else {
            // 使用者未登入
        }
    });


    // 讀取 pollingYes 與 pollingNo 的投票結果
    const [test, setTest] = useState({})
    useEffect(() => {
        firebase
            .firestore()
            .collection('poll')
            .doc(passProps.id)

            .onSnapshot((docSnapshot) => {
                const data = docSnapshot.data()
                setTest(data)
            })
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.containerInner}>


                <View>
                    <View style={styles.titleView}>
                        <Text style={styles.titleText}>{passProps.title}</Text>
                    </View>

                    <View style={styles.contentView}>
                        <Text style={styles.contentText}>
                            {passProps.info} </Text>
                    </View>
                </View>
            </View>
            <View style={styles.resultView}>
                <View style={styles.numVotes}>
                    <Text style={styles.resultText}>{test.yes}</Text>
                </View>
                <Image style={styles.resultImg} source={require('../images/villageChief.png')} />
                <View style={styles.numVotes}>
                    <Text style={styles.resultText}>{test.no}</Text>
                </View>
            </View>


            <View
                style={styles.divBtnVote}
            >
                <TouchableOpacity
                    style={styles.btnVote}
                    onPress={() => setIsVisible(!isVisible)}
                >
                    <Text style={styles.txtVote}>投票</Text>
                    <MaterialIcons name={"touch-app"} size={30} color={"#fff"} />
                </TouchableOpacity>
                <Dialog.Container visible={isVisible}>
                    <Dialog.Title>{passProps.title}</Dialog.Title>

                    <RadioButtonRN
                        data={data}
                        // selectedBtn={(e) => console.log(e.label)}
                        selectedBtn={(e) => setChecked(e.label)}
                    />

                    <Dialog.Button label="取消" onPress={() => setIsVisible(!isVisible)} />

                    <Dialog.Button label="送出" onPress={() => pollingFinished()} />
                </Dialog.Container>
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
    containerInner: {
        // backgroundColor: '#555',
        flex: 1,
        justifyContent: 'space-between',
        marginHorizontal: '4%',
        marginTop: '4%',
        // marginBottom: '4%', //15%
    },
    titleView: {
        paddingVertical: '3%',
    },
    titleText: {
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentView: {
        paddingHorizontal: '2%',
    },
    contentText: {
        // backgroundColor: '#55a',
        fontSize: 18,
        marginVertical: '5%',
    },
    resultView: {
        // backgroundColor: '#5aa',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
        marginBottom: 70,
    },
    numVotes: {
        width: '25%',
        paddingVertical: 20,
        borderWidth: 2,
        borderRadius: 10,
    },
    resultText: {
        fontSize: 22,
        textAlign: 'center',
    },
    resultImg: {
        width: 150,
        height: 150,
        marginHorizontal: '2%',
    },

    divBtnVote: {
        backgroundColor: 'gray',
    },
    btnVote: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#37376B', //#D5D2C9
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 35,
    },
    txtVote: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
});