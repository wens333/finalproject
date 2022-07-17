import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Platform, ScrollView, Alert, InteractionManager, Image
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';//可達到：鍵盤輸入不擋畫面
import RNPickerSelect from 'react-native-picker-select';//下拉表單
import { Hideo } from 'react-native-textinput-effects';//textinput effect 
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';//icon
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';//icon
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
export default function FormScreenRepair(props) {
    //firebaseConfig --------由Firebase複製來的程式碼&避免重複洗版-----------
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
    //firebaseConfig ------由Firebase複製來的程式碼&避免重複洗版-----------    

    const [userName, setUserName] = useState('');
    const [emptyState, setEmptyState] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [reportPlace, setReportPlace] = useState('');
    const [btopic, setbtopic] = useState("");
    const [content, setcontent] = useState('');

    //-------------------timer過久問題解決方法-----------------------------------------------
    const _setTimeout = global.setTimeout;
    const _clearTimeout = global.clearTimeout;
    const MAX_TIMER_DURATION_MS = 60 * 1000;
    if (Platform.OS === 'android') {
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

    // ImagePicker
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [filename, setFilename] = useState(null);

    // 每位會員第一次上傳照片需要跑兩次
    const [count, setCount] = useState(0)
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert("⚠️錯誤訊息", "抱歉您拒絕存取照相機，因此無法上傳照片。Sorry, we need camera roll permissions to make this work!", [
                        { text: "OK", onPress: () => console.log("ok Pressed") },
                    ])
                }
            }
        })();
    }, []);

    const randomImageName = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1 = Math.random().toString(36).substring(0, 8);
        return result1.substring(result1.lastIndexOf('.') + 1)
    }

    const pickImage = async () => { // async () 

        let result = await ImagePicker.launchImageLibraryAsync({ // await
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        setResult(result)

        if (!result.cancelled) {
            setImage(result.uri);
        }

        setFilename(randomImageName())

        const file = {
            uri: image,
            name: filename,
            type: 'image/jpg'
        }

        const formData = new FormData();
        formData.append("file", file)

        const metadata = {
            contentType: 'image/jpg',
        };
    };

    const pop = (msg) => {
        console.log(msg)
        props.navigation.pop()
    }

    //送出報修(含)照片
    const uploadImage = async () => {
        if (phoneNumber.length !== 10 || reportPlace.length === 0 || userName.length === 0 || content.length === 0) {
            Alert.alert(
                '⚠️錯誤訊息', "欄位無填寫完成，請確認是否都填寫正確，謝謝=)", [
                { text: "OK", onPress: () => console.log("ok Pressed") },]
            )
        }
        else {
            //感謝明達老大的智慧>>使用者沒有上傳照片，預設照片傳至Firebase，無上傳照片人採用直接傳至Firebase，並結合return的方式不跑到result.cancelled上傳照的部分
            if (result === null) {
                firebase.firestore()
                    .collection("repairForm").
                    doc()
                    .set({
                        test: "沒有上傳圖片",
                        name: userName,
                        phone: phoneNumber,
                        topic: btopic,
                        datetime: firebase.firestore.Timestamp.now(),  //放入firebase當下的時間
                        address: reportPlace,
                        content: content,
                        isFixing: false
                    }, { merge: true })
                    .then(function () {
                        Alert.alert("🚧修繕表單", "我們已收到修繕表單，感謝您用心填報，謝謝=)", [
                            { text: "OK", onPress: () => pop("ok Pressed") },
                        ])
                    })
                return
            }

            if (!result.cancelled) {
                setImage(result.uri);
                setFilename(image.substring(image.lastIndexOf('/') + 1))

                const file = {
                    uri: image,
                    name: filename,
                    type: 'image/jpg'
                }

                const formData = new FormData();
                formData.append("file", file)

                const metadata = {
                    contentType: 'image/jpg',
                };

                const documentRef = firebase.firestore().collection('repairForm').doc()

                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        resolve(xhr.response);
                    };
                    xhr.onerror = function () {
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", image, true);
                    xhr.send(null);
                });
                const ref = firebase.storage().ref().child('uploadTestPicture').child(filename);

                const task = ref.put(blob, { contentType: 'image/jpg' });

                task.on('state_changed',
                    (snapshot) => {
                        console.log(snapshot.totalBytes)
                    },
                    (err) => {
                        console.log("-----" + err + "為空")
                    },
                    () => {
                        task.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            documentRef.set({
                                name: userName,
                                phone: phoneNumber,
                                topic: btopic,
                                phoneUrl: downloadURL,
                                datetime: firebase.firestore.Timestamp.now(),  //放入firebase當下的時間
                                address: reportPlace,
                                content: content,
                                isFixing: false
                            }).then(() => {
                                // 「跳轉頁面」
                                Alert.alert("🚧修繕表單", "我們已收到修繕表單，感謝您用心填報，謝謝=)", [
                                    { text: "OK", onPress: () => pop("ok Pressed") },
                                ])
                            })
                        });
                    })
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerInner}>
                <KeyboardAwareScrollView style={{ width: '100%' }}>

                    <View style={styles.textInputSection}>
                        <Hideo
                            iconClass={FontAwesome5}
                            iconName={'pencil-alt'}
                            iconColor={'white'}
                            iconBackgroundColor={'#f2a59d'} //#f4c66c #f2c06b #f4d76c #f2a59d
                            inputStyle={styles.contentIcon}
                            placeholder="*申報人姓名"
                            maxLength={20}
                            backgroundColor='#aa5'
                            onChangeText={(text) => { setUserName(text) }}
                        />
                    </View>

                    <View style={styles.textInputSection}>
                        <Hideo
                            iconClass={MaterialIcons}
                            iconName={'phone'}
                            iconColor={'white'}
                            iconBackgroundColor={'#f2c06b'}
                            inputStyle={styles.contentIcon}
                            placeholder="*申報人聯絡電話"
                            maxLength={10}
                            onChangeText={(text) => { setPhoneNumber(text) }}
                            keyboardType='number-pad'
                            backgroundColor='#aa5'
                        />
                    </View>

                    <View style={styles.textInputSection}>
                        <Hideo
                            iconClass={MaterialIcons}
                            iconName={'place'}
                            iconColor={'white'}
                            iconBackgroundColor={'#f2a59d'}
                            inputStyle={[styles.contentIcon, { lineHeight: 30 }]}
                            placeholder="*欲修繕地點/附近地址"
                            backgroundColor='#aa5'
                            onChangeText={text => setReportPlace(text)}
                            multiline={true}
                        />
                    </View>

                    <View style={{ backgroundColor: '#D5D2C9', marginVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <RNPickerSelect
                            style={{
                                ...customPickerStyles,
                            }}
                            placeholder={{ label: "修繕_申報項目/類別", value: null, color: 'gray' }}
                            onValueChange={(btopic) => setbtopic(btopic)}
                            items={[
                                { label: "人行道-不平", value: "人行道不平" },
                                { label: "水溝堵塞", value: "水溝堵塞" },
                                { label: "公園設施-故障", value: "公園設施故障" },
                                { label: "紅綠燈-故障", value: "紅綠燈-故障" },
                                { label: "路不平", value: "路不平" },
                                { label: "路面積水", value: "路面積水" },
                                { label: "路燈-故障", value: "路燈故障" },
                                { label: "路樹傾倒", value: "路樹傾倒" },
                                { label: "環境髒亂", value: "環境髒亂" },
                                { label: "漏水", value: "漏水" },
                                { label: "其他", value: "其他" },
                            ]}
                        />
                        <Ionicons style={{ marginRight: 5 }} name="chevron-down-outline" size={20} color="gray" />
                    </View>

                    <View style={styles.textInputSection}>
                        <Hideo
                            iconClass={MaterialIcons}
                            iconName={'content-paste'}
                            iconColor={'white'}
                            iconBackgroundColor={'#f2c06b'}
                            inputStyle={[styles.contentIcon, { lineHeight: 30 }]}
                            placeholder="*請詳述申報事由-修繕原因"
                            maxLength={50}
                            onChangeText={(text) => { setcontent(text) }}
                            multiline={true}

                        />
                    </View>

                    <View>
                        <Text style={{ color: "#FF0000", textAlign: 'center' }}>有*號之欄位必須要填寫</Text>
                    </View>

                    <View style={styles.imageSection}>
                        <View>
                            <TouchableOpacity
                                style={styles.btnPicture}
                                onPress={pickImage}
                            >
                                <Text
                                    style={styles.btnPictureText}>
                                    上傳 故障/修繕 照片</Text>
                            </TouchableOpacity>
                        </View>
                        {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />}
                    </View>

                    <View style={styles.bottomBarInner}>
                        <TouchableOpacity
                            style={styles.btnSend}
                            // onPress={() => repairAct()}
                            onPress={() => uploadImage()}
                        >
                            <Text style={styles.btnSendText}>
                                送出提報 / 報修</Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAwareScrollView>
            </View >

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFBF0',
    },
    containerInner: {
        flex: 1,
        backgroundColor: '#FEFBF0',
        marginHorizontal: '4%',
        marginTop: '4%',
    },
    textInputSection: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 5,
    },
    contentIcon: {
        color: '#464949',
        backgroundColor: '#F2EAD7',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    contentInput: {
        backgroundColor: '#F2EAD7',
        color: '#484744',
        width: '88%',
        paddingHorizontal: '5%',
        fontSize: 20,
        fontWeight: 'normal',
    },
    imageSection: {
        width: '100%',
    },
    btnPictureText: {
        fontSize: 16,
        color: '#4169E1',
        fontWeight: 'bold',
        paddingVertical: 8,
    },
    bottomBarInner: {
        width: '100%',
        height: 40,
        marginVertical: 5,
    },
    btnSend: {
        backgroundColor: "#dd978f",
        width: '100%',
        height: 40,
        justifyContent: 'center',
        borderRadius: 10,
    },
    btnSendText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
    },
    textInputSae: {
        paddingLeft: '5%',
        paddingRight: '5%'
    },
});
const customPickerStyles = StyleSheet.create({
    inputIOS: {
        marginRight: '42%',//'57%',
        width: '96%',
        paddingLeft: '4%',
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#585A56',
    },
    placeholder: {
        color: '#97958F',
    },
    inputAndroid: {
        fontSize: 15,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});