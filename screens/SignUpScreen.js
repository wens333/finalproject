import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
// Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
// 鍵盤不擋畫面
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// 資料庫
import firebase from 'firebase';
// Firebase Authentication
import 'firebase/auth';
import RNPickerSelect from 'react-native-picker-select';//下拉表單

export default function SignUpScreen(props) {
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [selection, setSelection] = useState(3);
    const [watch, setWatch] = useState(false);
    const [btopic, setbtopic] = useState("");

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

    const changeWatch = () => {
        setWatch(previousState => !previousState);
    }

    const onSignUp = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(mail, password)
            .then((userCredential) => {
                console.log(userCredential)

                // 資料庫寫入
                firebase.firestore().collection('user').doc().set({
                    mail: mail,
                    password: password,
                    name: name,
                    phone: phone,
                    topic: btopic,
                    sex: (selection === 1) ? "男生" : (selection === 2) ? "女生" : "不提供",
                    id: userCredential.user.uid
                })
            })
            .then((result) => {
                // 芝麻小事
                props.navigation.navigate('首頁')
                setMail('')
                setPassword('')
                setPhone('')
                setName('')
                console.log('註冊成功');
            })
            .catch(function (error) {
                console.log(error.message)
            });
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView style={{ width: '100%' }}>
                <View style={styles.containerInner}>

                    {/* old
                    <View style={styles.logoTitle}>
                        <TouchableOpacity>
                            <Text
                                style={styles.txtSignUp}>
                                LOGO(之後放 Image)</Text>
                        </TouchableOpacity>
                        <Text>註冊頁面(Test)</Text>
                    </View> */}
                    <View style={styles.logoTitle}>
                        <Image
                            style={{ width: 300, height: 200 }}
                            source={require('../images/logo.png')}
                        />
                        {/* <TouchableOpacity>
                            <Text
                                style={styles.txtSignUp}>
                                LOGO(之後放 Image)</Text>
                        </TouchableOpacity>
                        <Text>註冊頁面(Test)</Text> */}
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

                    {/* old
                    <View style={styles.textInputSection}>
                        <Ionicons style={styles.textInputIcon} name={"mail-outline"} size={25} />
                        <TextInput
                            style={styles.TextInput}
                            placeholder={'電子郵件'}
                            placeholderTextColor={'#B0C4DE'}
                            onChangeText={(text) => setMail(text)}
                            value={mail}
                            autoCapitalize={'none'} />
                    </View> */}

                    <View style={styles.textInputSection}>
                        <Ionicons style={styles.textInputIcon} name={"lock-closed-outline"} size={25} />
                        <TextInput
                            style={styles.TextInput}
                            placeholder={'密碼'}
                            placeholderTextColor={'#C7D6D8'}
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

                    {/* old
                    <View style={styles.textInputSection}>
                        <Ionicons style={styles.textInputIcon} name={"lock-closed-outline"} size={25} />
                        <TextInput
                            style={styles.TextInput}
                            placeholder={'密碼'}
                            placeholderTextColor={'#B0C4DE'}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            maxLength={12} />
                    </View> */}

                    <View style={styles.textInputSection}>
                        <Ionicons style={styles.textInputIcon} name={"person-outline"} size={25} />
                        <TextInput
                            style={styles.TextInput}
                            placeholder={'姓名'}
                            placeholderTextColor={'#C7D6D8'}
                            // onChangeText={(text) => setUserName(text)}    //check
                            onChangeText={(text) => setName(text)}
                            value={name}
                        />
                    </View>

                    {/* old
                    <View style={styles.textInputSection}>
                        <Ionicons style={styles.textInputIcon} name={"person-outline"} size={25} />
                        <TextInput
                            style={styles.TextInput}
                            placeholder={'姓名'}
                            placeholderTextColor={'#B0C4DE'}
                            onChangeText={(text) => setName(text)}
                            value={name}
                        />
                    </View> */}

                    <View style={styles.textInputSection}>
                        <Ionicons style={styles.textInputIcon} name={"call-outline"} size={25} />
                        <TextInput
                            style={styles.TextInput}
                            placeholder={'手機電話'}
                            placeholderTextColor={'#C7D6D8'}
                            onChangeText={(text) => setPhone(text)}
                            value={phone}
                        // value={phoneNum} 
                        />
                    </View>

                    {/* old
                    <View style={styles.textInputSection}>
                        <Ionicons style={styles.textInputIcon} name={"call-outline"} size={25} />
                        <TextInput
                            style={styles.TextInput}
                            placeholder={'手機電話'}
                            placeholderTextColor={'#B0C4DE'}
                            onChangeText={(text) => setPhone(text)}
                            value={phone}
                        />
                    </View> */}

                    <View style={styles.RadioButtonSection}>
                        <Ionicons style={styles.textInputIcon} name={"transgender-outline"} size={25} />

                        <View style={styles.btnGenderGroup}>
                            <TouchableOpacity style={[styles.btnGender, selection === 1 ? { backgroundColor: "#6B7280" } : null]} onPress={() => setSelection(1)}>
                                {selection === 1 ? <Image
                                    style={styles.rbSelectedImg}
                                    source={require('../images/rb_selected.png')}
                                /> : <Image
                                    style={styles.rbUnselectedImg}
                                    source={require('../images/rb_unselected.png')}
                                />}
                                <Text style={[styles.btnGenderText, selection === 1 ? { color: "white" } : null]}>男生</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.btnGender, selection === 2 ? { backgroundColor: "#6B7280" } : null]} onPress={() => setSelection(2)}>
                                {selection === 2 ? <Image
                                    style={styles.rbSelectedImg}
                                    source={require('../images/rb_selected.png')}
                                /> : <Image
                                    style={styles.rbUnselectedImg}
                                    source={require('../images/rb_unselected.png')}
                                />}
                                <Text style={[styles.btnGenderText, selection === 2 ? { color: "white" } : null]}>女生</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.btnGender, selection === 3 ? { backgroundColor: "#6B7280" } : null]} onPress={() => setSelection(3)}>
                                {selection === 3 ? <Image
                                    style={styles.rbSelectedImg}
                                    source={require('../images/rb_selected.png')}
                                /> : <Image
                                    style={styles.rbUnselectedImg}
                                    source={require('../images/rb_unselected.png')}
                                />}

                                <Text style={[styles.btnGenderText, selection === 3 ? { color: "white" } : null]}>不提供</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.textInputSection}>
                        <Ionicons style={styles.textInputIcon} name={"home-outline"} size={25} />
                        <RNPickerSelect
                            style={{
                                ...customPickerStyles,
                            }}
                            placeholder={{ label: "居住里", value: null, color: 'gray' }}
                            onValueChange={(btopic) => setbtopic(btopic)}
                            items={[
                                { label: "龍濱里", value: "龍濱里" },
                                { label: "仁愛里", value: "仁愛里" },
                                { label: "龍門里", value: "龍門里" },
                                { label: "埔心里", value: "埔心里" },
                                { label: "菓林里", value: "菓林里" },

                            ]}
                        />
                        <Ionicons style={{ marginRight: 5 }} name="chevron-down-outline" size={20} color="white" />
                    </View>

                    {/* <View style={{ backgroundColor: '#5EAEDF', marginVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 10, }}>
                        <RNPickerSelect
                            style={{
                                ...customPickerStyles,
                            }}
                            placeholder={{ label: "里名稱", value: null }}
                            onValueChange={(btopic) => setbtopic(btopic)}
                            items={[
                                { label: "龍濱里", value: "龍濱里" },
                                { label: "仁愛里", value: "仁愛里" },
                                { label: "龍門里", value: "龍門里" },
                                { label: "埔心里", value: "埔心里" },
                                { label: "菓林里", value: "菓林里" },

                            ]}
                        />
                        <Ionicons style={{ marginRight: 5 }} name="chevron-down-outline" size={20} color="white" />
                    </View> */}

                    <View
                        style={styles.divBackLogIn}>
                        <TouchableOpacity
                            style={styles.btnBackLogIn}
                            onPress={() => props.navigation.pop()}>
                            <Text
                                style={styles.txtBackLogIn}>
                                返回登入頁面</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.btnSignUp}
                        // style={isDisabled ? styles.btnSignUp : styles.btnDisableSignUp}
                        // disabled={isDisabled ? false : true}
                        onPress={() => onSignUp()}>
                        <Text
                            style={styles.txtSignUp}>
                            {/* style={isDisabled ? styles.txtSignUp : styles.txtDisableSignUp}> */}
                            註冊</Text>
                    </TouchableOpacity>
                    <View>

                        {/* <Button
                            title='Go Home(Test)'
                            // onPress={() => props.navigation.navigate('首頁')}
                            activeOpacity={0.6}
                        /> */}

                    </View>

                    {/* old
                    <View
                        style={styles.divBackLogIn}>
                        <TouchableOpacity
                            style={styles.btnBackLogIn}
                            onPress={() => props.navigation.pop()}>
                            <Text
                                style={styles.txtBackLogIn}>
                                返回登入頁面</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.btnSignUp}
                        onPress={() => onSignUp()}>
                        <Text
                            style={styles.txtSignUp}>
                            註冊</Text>
                    </TouchableOpacity>
                    <View>

                        <Button
                            title='Go Home(Test)'
                            // onPress={() => props.navigation.navigate('首頁')}
                            activeOpacity={0.6}
                        />

                    </View> */}

                    <StatusBar style="auto" />
                </View>
                {/* </ScrollView> */}
            </KeyboardAwareScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFEBA4',
        alignItems: 'center',
        // marginTop: 50,
        // marginBottom: 50,
        // justifyContent: 'center',
    },
    containerInner: {
        flex: 1,
        backgroundColor: '#FFEBA4', //#FFEBA4 #FEF5D4
        alignItems: 'center',
        marginTop: 80, //放LOGO後要調高度
        marginBottom: 50,
        // justifyContent: 'center',
    },
    logoTitle: {
        alignItems: 'center',
        // backgroundColor: '#FEF5D4', //#FEF5D4 #FFEBA4
        // padding: 30,
        // paddingLeft: 60,
        // paddingRight: 60,
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
    RadioButtonSection: {
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
    btnGenderGroup: {
        width: '85%',
        flexDirection: 'row',
        alignItems: "center",
        // borderBottomWidth: 1,
        // borderBottomColor: '#6B7280'
    },
    btnGender: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        borderRadius: 10,
        // borderRightWidth: 0.25,
        // borderLeftWidth: 0.25,
        // borderColor: '#6B7280'
    },
    btnGenderText: {
        textAlign: 'center',
        paddingVertical: 16,
        fontSize: 14
    },
    rbSelectedImg: {
        width: 20,
        height: 20,
        margin: 5
    }, rbUnselectedImg: {
        width: 20,
        height: 20,
        margin: 5,
    },

    divBackLogIn: {
        width: '75%',
        alignItems: 'flex-end',
        // justifyContent: 'flex-end',
        textAlign: "right",
        // backgroundColor: 'gray',
        paddingBottom: 5,
    },
    btnBackLogIn: {
        padding: 5,

    },
    txtBackLogIn: {
        color: '#4169E1',
        fontSize: 15,
    },
    btnSignUp: {
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
    txtSignUp: {
        color: '#4169E1', //#6499C3 #6490C3
        fontSize: 20,
        fontWeight: '500',
    },
});
const customPickerStyles = StyleSheet.create({
    inputIOS: {
        // backgroundColor: '#55a',
        marginRight: '57%',//'57%',
        // width: '96%',
        paddingLeft: '2%',
        // paddingRight: 80,
        paddingVertical: 15,
        fontSize: 18,
        // fontWeight: 'bold',
        color: '#fff',
    },
    placeholder: {
        color: '#C7D6D8',
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


    // inputIOS: {
    //     marginRight: '42%',//'57%',
    //     width: '96%',
    //     paddingLeft: '4%',
    //     paddingVertical: 10,
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     color: '#585A56',
    // },
    // placeholder: {
    //     color: '#C7D6D8',
    // },
    // inputAndroid: {
    //     fontSize: 15,
    //     paddingHorizontal: 10,
    //     paddingVertical: 8,
    //     borderWidth: 1,
    //     borderColor: 'blue',
    //     borderRadius: 8,
    //     color: 'black',
    //     paddingRight: 30, // to ensure the text is never behind the icon
    // },
});
// old
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FFEBA4',
//         alignItems: 'center',
//         // marginTop: 50,
//         // marginBottom: 50,
//         // justifyContent: 'center',
//     },
//     containerInner: {
//         flex: 1,
//         backgroundColor: '#FFEBA4',
//         alignItems: 'center',
//         marginTop: 150, //放LOGO後要調高度
//         marginBottom: 50,
//         // justifyContent: 'center',
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
//     RadioButtonSection: {
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
//     btnGenderGroup: {
//         width: '85%',
//         flexDirection: 'row',
//         alignItems: "center",
//         // borderBottomWidth: 1,
//         // borderBottomColor: '#6B7280'
//     },
//     btnGender: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: "center",
//         borderRadius: 10,
//         // borderRightWidth: 0.25,
//         // borderLeftWidth: 0.25,
//         // borderColor: '#6B7280'
//     },
//     btnGenderText: {
//         textAlign: 'center',
//         paddingVertical: 16,
//         fontSize: 14
//     },
//     rbSelectedImg: {
//         width: 20,
//         height: 20,
//         margin: 5
//     }, rbUnselectedImg: {
//         width: 20,
//         height: 20,
//         margin: 5,
//     },

//     divBackLogIn: {
//         width: '75%',
//         alignItems: 'flex-end',
//         // justifyContent: 'flex-end',
//         textAlign: "right",
//         // backgroundColor: 'gray',
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
//     txtSignUp: {
//         color: '#6499C3',
//         fontSize: 20,
//         fontWeight: '500',
//     },
// });