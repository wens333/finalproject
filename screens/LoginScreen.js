import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image } from 'react-native';
// Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
// 鍵盤不擋畫面
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// 資料庫
import firebase from 'firebase';
// Firebase Authentication
import 'firebase/auth';
// 程式碼初始化太多次，故有此方案產生
import { initializeFirestore } from '../useCodeManyTimes/initializeFirestore';

export default function LoginScreen(props) {
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [watch, setWatch] = useState(false);

    // 資料庫
    useEffect(() => {
        initializeFirestore()
        //     const firebaseConfig = {
        //         apiKey: "AIzaSyCrThxivVSo-ICZRbrx5b29peEaX74j_5w",
        //         authDomain: "graduate-project-carrot.firebaseapp.com",
        //         projectId: "graduate-project-carrot",
        //         storageBucket: "graduate-project-carrot.appspot.com",
        //         messagingSenderId: "551700585027",
        //         appId: "1:551700585027:web:ba6f87bf32b698b65e12f6",
        //         measurementId: "G-Y32RRXQX0L"
        //     }
        //     if (!firebase.apps.length) {
        //         firebase.initializeApp(firebaseConfig);
        //     }
    }, [])

    //是否要顯示密碼
    const changeWatch = () => {
        setWatch(previousState => !previousState);
    }

    const onLogin = () => {
        firebase.auth()
            .signInWithEmailAndPassword(mail, password)
            .then(result => {
                setMail('')
                setPassword('')
                // props.navigation.navigate('首頁')
                props.navigation.navigate('首頁')
                // console.log(result);
                console.log('成功登入');
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    const onLogout = () => {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            console.log('成功登出');
            console.log((firebase.auth().currentUser === null) ? "無人登入" : "尚未成功登出")
        }).catch((error) => {
            // An error happened.
            console.log(error.message);
        });
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView style={{ width: '100%' }}>
                <View style={styles.containerInner}>

                    <View style={styles.logoTitle}>
                        <Image
                            style={{ width: 300, height: 200 }}
                            source={require('../images/logo.png')}
                        />
                        {/* <TouchableOpacity>
                            <Text
                                style={styles.txtLogIn}>
                                LOGO(之後放 Image)</Text>
                        </TouchableOpacity>
                        <Text>登入頁面(Test)</Text> */}
                    </View>
                    <View style={styles.textInputSection}>
                        <Ionicons style={styles.textInputIcon} name={"mail-outline"} size={25} />
                        <TextInput
                            style={styles.TextInput}
                            placeholder={'電子郵件'}
                            placeholderTextColor={'#C7D6D8'} //#B0C4DE
                            onChangeText={(text) => setMail(text)}
                            value={mail}
                            autoCapitalize={'none'} />
                    </View>

                    <View style={styles.textInputSection}>
                        <Ionicons style={styles.textInputIcon} name={"lock-closed-outline"} size={25} />
                        <TextInput
                            style={styles.TextInput}
                            placeholder={'密碼'}
                            placeholderTextColor={'#C7D6D8'} //#B0C4DE
                            secureTextEntry={watch === false ? true : false}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            maxLength={12} />

                        <TouchableOpacity
                            style={styles.btnWatch}
                            onPress={() => changeWatch()}>
                            {watch === false ? <Ionicons style={styles.textInputIconWatch} name={"eye-off-outline"} size={25} /> :
                                <Ionicons style={styles.textInputIconWatch} name={"eye-outline"} size={25} />}
                        </TouchableOpacity>
                    </View>

                    <View
                        style={styles.divForgetPassword}>
                        {/* <TouchableOpacity
                            style={styles.btnForgetPassword}
                        // onPress={() => props.navigation.push('SignUpScreen')}
                        >
                            <Text
                                style={styles.txtForgetPassword}>
                                我忘記密碼了&gt;&lt; </Text>
                        </TouchableOpacity> */}
                    </View>

                    <TouchableOpacity
                        style={styles.btnLogIn}
                        onPress={() => onLogin()}>
                        <Text
                            style={styles.txtLogIn}>
                            登入</Text>
                    </TouchableOpacity>

                    <View
                        style={styles.divGoSignUp}>
                        <TouchableOpacity
                            style={styles.btnGoSignUp}
                            onPress={() => props.navigation.push('SignUpScreen')}>
                            <Text
                                style={styles.txtGoSignUp}>
                                還沒註冊過嗎？快去註冊！</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 這個功能是之後放到ProfileScreen? by 喧 */}
                    {/* <TouchableOpacity
                        style={styles.btnSignOut}
                        onPress={() => onLogout()}
                        >
                        <Text
                            style={styles.txtSignOut}>
                            登出
                        </Text>
                    </TouchableOpacity> */}

                    {/* <View>

                        <Button
                            title='Go Home(Test)'
                            activeOpacity={0.6}
                        />

                    </View> */}

                    <StatusBar style="auto" />
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFEBA4', //#FFEBA4 #FEF5D4
        alignItems: 'center',
        // marginTop: 50,
        // marginBottom: 50,
        // justifyContent: 'center',
    },
    containerInner: {
        flex: 1,
        backgroundColor: '#FFEBA4', //#FFEBA4 #FEF5D4
        alignItems: 'center',
        marginTop: 100, //放LOGO後要調高度
        marginBottom: 50,
        // justifyContent: 'center',
    },
    logoTitle: {
        alignItems: 'center',
        // backgroundColor: '#FEF5D4', //#FEF5D4 #FFEBA4
        // padding: 60,
        // marginBottom: 20,
    },
    textInputSection: {
        width: '85%',
        height: 49,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#5EAEDF',
        marginTop: 5,
        marginBottom: 5,
    },
    textInputIcon: {
        width: '15%',
        padding: 10,
        paddingRight: 5,
        color: '#FFF',
    },
    TextInput: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'left',
        backgroundColor: '#5EAEDF',
        width: '70%',
        height: 45,
        borderRadius: 10,
        borderColor: '#fff',
        paddingLeft: 5,
        paddingRight: 10,
    },
    btnWatch: {
        width: '15%',
    },
    textInputIconWatch: {
        // width: '15%',
        padding: 10,
        paddingRight: 5,
        color: '#FFF',
    },
    divForgetPassword: {
        width: '85%',
        alignItems: 'flex-end',
        // justifyContent: 'flex-end',
        textAlign: "right",
        // backgroundColor: 'gray',
        paddingBottom: 5,
        marginBottom: 80,
    },
    btnForgetPassword: {
        padding: 5,

    },
    txtForgetPassword: {
        color: '#4169E1',
        fontSize: 15,
    },
    btnLogIn: {
        width: '70%',
        height: 49,
        borderWidth: 2,
        borderRadius: 25,
        borderColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#94D9E9',
        marginTop: 5,
        marginBottom: 5,
    },
    txtLogIn: {
        color: '#4169E1', //#6499C3 #6490C3
        fontSize: 20,
        fontWeight: '500',
    },
    divGoSignUp: {
        width: '85%',
        alignItems: 'center',
        // justifyContent: 'flex-end',
        textAlign: "right",
        // backgroundColor: 'gray',
    },
    btnGoSignUp: {
        padding: 5,

    },
    txtGoSignUp: {
        color: '#4169E1',
        fontSize: 15,
    },
    txtGoSignUp: {
        color: '#4169E1',
        fontSize: 15,
    },
    btnSignOut: {
        width: '70%',
        height: 49,
        borderWidth: 2,
        borderRadius: 25,
        borderColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#94D9E9',
        marginTop: 5,
        marginBottom: 5,
    },
});

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FFEBA4',
//         alignItems: 'center',
//     },
//     containerInner: {
//         flex: 1,
//         backgroundColor: '#FFEBA4',
//         alignItems: 'center',
//         marginTop: 240,
//         marginBottom: 50,
//     },
//     logoTitle: {
//         alignItems: 'center',
//     },
//     textInputSection: {
//         width: '75%',
//         height: 49,
//         borderWidth: 2,
//         borderRadius: 10,
//         borderColor: '#fff',
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#5EAEDF',
//         marginTop: 5,
//         marginBottom: 5,
//     },
//     textInputIcon: {
//         width: '15%',
//         padding: 10,
//         paddingRight: 5,
//         color: '#FFF',
//     },
//     TextInput: {
//         fontSize: 18,
//         color: '#fff',
//         textAlign: 'left',
//         backgroundColor: '#5EAEDF',
//         width: '84.5%',
//         height: 45,
//         borderRadius: 10,
//         borderColor: '#fff',
//         paddingLeft: 5,
//         paddingRight: 10,
//     },
//     divBackLogIn: {
//         width: '75%',
//         alignItems: 'flex-end',
//         textAlign: "right",
//         paddingBottom: 5,
//     },
//     btnBackLogIn: {
//         padding: 5,
//     },
//     txtBackLogIn: {
//         color: '#4169E1',
//         fontSize: 15,
//     },
//     btnSignUp: {
//         width: '70%',
//         height: 49,
//         borderWidth: 2,
//         borderRadius: 25,
//         borderColor: '#fff',
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#94D9E9',
//         marginTop: 5,
//         marginBottom: 5,
//     },
//     btnSignOut: {
//         width: '70%',
//         height: 49,
//         borderWidth: 2,
//         borderRadius: 25,
//         borderColor: '#fff',
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#94D9E9',
//         marginTop: 5,
//         marginBottom: 5,
//     },
//     txtSignUp: {
//         color: '#6499C3',
//         fontSize: 20,
//         fontWeight: '500',
//     },
//     txtSignOut: {
//         color: '#6499C3',
//         fontSize: 20,
//         fontWeight: '500',
//     },
// });
