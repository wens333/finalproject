import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card } from 'react-native-shadow-cards';
// 資料庫
import firebase from 'firebase';
// Firebase Authentication
import 'firebase/auth';
// 程式碼初始化太多次，故有此方案產生
import { initializeFirestore } from '../useCodeManyTimes/initializeFirestore';
import HomePollScreen from './HomePollScreen';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function ProfileScreen(props) {
    // 資料庫
    useEffect(() => {
        initializeFirestore()
    }, [])
    // 使用者資料
    const [userUID, setUserUID] = useState('');
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userMail, setUserMail] = useState('')
    const [userSex, setUserSex] = useState("gray")
    const [getFixingMessage, setGetFixingMessage] = useState([])
    firebase
        .auth()
        .onAuthStateChanged(function (user) {
            if (user) {
                setUserUID(user.uid)
                // 使用者已登入，可以取得資料
                // 姓名 & 性別
                firebase.firestore().collection("user").where("id", "==", user.uid)
                    .get()
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            setUserName(doc.data().name)
                            setUserPhone(doc.data().phone)
                            setUserMail(doc.data().mail)
                            setUserSex(
                                (doc.data().sex === "男生") ? "blue" :
                                    (doc.data().sex === "女生") ? "pink" : "gray"
                            )
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
            } else {
                // 使用者未登入
                console.log('尚未登入')
            }
        });

    const onLogout = () => {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            // console.log((firebase.auth().currentUser === null) ? "無人登入" : "尚未登出")
            props.navigation.navigate('登入')
        }).catch((error) => {
            // An error happened.
            console.log(error.message);
        });
    }

    const fixScreen = () => {
        props.navigation.push('修繕狀況', { passProps: userUID })
    }

    const blogArticleScreen = () => {
        props.navigation.push('看板', { passProps: userUID })
    }

    const activityScreen = () => {
        props.navigation.push('活動', { passProps: userUID })
    }

    const pollScreen = () => {
        props.navigation.push('投票', { passProps: userUID })
    }

    const blogScreen = () => {
        props.navigation.push('我的收藏', { passProps: userUID })
    }

    if (!(userUID === "aa9tVklivRWdKuuu6fMN8U9va5g2")) {
        return (
            <View style={styles.container}>
                <View style={styles.containerInner}>

                    <View style={styles.headerBackground}>
                        <View style={styles.headerSetting}>
                            <View style={styles.header}>
                                <View style={styles.identification}>
                                    <Ionicons name="body" size={22} color="#F59031" />
                                    {/* 依據是里長還里民帳號更改文字內容 */}
                                    <Text style={styles.headerLeft}>{userUID === "aa9tVklivRWdKuuu6fMN8U9va5g2" ? "里長" : "里民"}
                                    </Text>
                                </View>
                                {/* 登出程式 */}
                                <TouchableOpacity
                                    onPress={() => onLogout()}
                                    style={styles.logOut}
                                >
                                    {/* <View style={styles.logOut}> */}
                                    <Text style={styles.headerRight}>登出</Text>
                                    <Ionicons name="log-out-outline" size={22} color='#F59031' />
                                    {/* </View> */}

                                </TouchableOpacity>
                            </View>

                            <View style={styles.individualInfo}>
                                <Card style={styles.viewTitle}>

                                    <View style={styles.namePhoto} >
                                        <Ionicons name="person-circle" size={60} color={userSex} style={styles.iconTitle} />

                                        <Text style={styles.txtName}>{userName}</Text>
                                    </View>
                                    <View style={styles.phoneMail}>
                                        {/* 新增電話信箱 */}
                                        <Text style={{ fontSize: 18 }}>電話：{userPhone}</Text>
                                        <Text style={{ fontSize: 18 }}>信箱：{userMail}</Text>
                                    </View>

                                </Card>

                            </View>

                        </View>
                    </View>
                    <KeyboardAwareScrollView>
                        <View style={styles.village}>

                            <View style={{ alignItems: 'center', borderRightWidth: 2, paddingRight: '20%', marginRight: '20%', borderRightColor: '#D6D5D5' }}>
                                <Image source={require('./../images/village.png')} style={{ width: 50, height: 50 }} />
                                {/* 資料庫載入里長名字 or 寫死 ? */}
                                <Text style={{ fontSize: 18, marginTop: '15%' }}>長庚里</Text>
                            </View>


                            <View style={{ alignItems: 'center' }}>
                                <Image source={require('./../images/old.png')} style={{ width: 50, height: 50 }} />
                                {/* 資料庫載入里名 or 寫死 ? */}
                                <Text style={{ fontSize: 18, marginTop: '15%' }}>蔡明達</Text>
                            </View>

                        </View>


                        <View style={{ backgroundColor: '#F3F3F3', height: '34%', marginTop: '2%' }}>


                            <TouchableOpacity
                                style={styles.btnRender}
                                // 里民 -> 連結到篩選的資料而非所有文章
                                onPress={() => blogArticleScreen()}
                            >
                                <View style={styles.btnSetting}>
                                    <View style={styles.iconText}>
                                        <Ionicons name="newspaper-outline" size={25} color="black" />
                                        <Text style={styles.btnText}>
                                            {userUID === "aa9tVklivRWdKuuu6fMN8U9va5g2" ? "看板審核" : "我的文章"}
                                        </Text>
                                    </View>
                                    <View style={styles.rightArrow}>
                                        <Ionicons name="chevron-forward-outline" size={25} color="#A09F9C" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.borderRender}></View>

                            <TouchableOpacity
                                // 里民 -> 連結到篩選的資料

                                style={styles.btnRender}
                                onPress={() => blogScreen()}
                            >
                                <View style={styles.btnSetting}>
                                    <View style={styles.iconText}>
                                        <Ionicons name="bookmarks-outline" size={25} color="black" />
                                        <Text style={styles.btnText}>我的收藏</Text>
                                    </View>
                                    <View style={styles.rightArrow}>
                                        <Ionicons name="chevron-forward-outline" size={25} color="#A09F9C" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.borderRender}></View>

                            <TouchableOpacity
                                style={styles.btnRender}
                                // 里民 -> 連結到篩選的資料而非所有投票
                                onPress={() => pollScreen()}
                            >
                                <View style={styles.btnSetting}>
                                    <View style={styles.iconText}>
                                        <Ionicons name="hand-right-outline" size={25} color="black" />
                                        <Text style={styles.btnText}>我的投票</Text>
                                    </View>
                                    <View style={styles.rightArrow}>
                                        <Ionicons name="chevron-forward-outline" size={25} color="#A09F9C" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.borderRender}></View>

                            <TouchableOpacity
                                style={styles.btnRender}
                                // 里民 -> 連結到篩選的資料而非所有活動
                                onPress={() => activityScreen()}
                            >
                                <View style={styles.btnSetting}>
                                    <View style={styles.iconText}>
                                        <Ionicons name="walk" size={25} color="black" />
                                        <Text style={styles.btnText}>我的活動</Text>
                                    </View>
                                    <View style={styles.rightArrow}>
                                        <Ionicons name="chevron-forward-outline" size={25} color="#A09F9C" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.borderRender}></View>

                            <TouchableOpacity
                                style={styles.btnRender}
                                // 里民 -> 連結到篩選的資料而非所有活動
                                onPress={() => fixScreen()}
                            >
                                <View style={styles.btnSetting}>
                                    <View style={styles.iconText}>
                                        <Ionicons name="construct-outline" size={25} color="black" />
                                        <Text style={styles.btnText}>修繕進度</Text>
                                    </View>
                                    <View style={styles.rightArrow}>
                                        <Ionicons name="chevron-forward-outline" size={25} color="#A09F9C" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }
    else {
        return (
            <View style={styles.container}>
                <View style={styles.containerInner}>

                    <View style={styles.headerBackground}>
                        <View style={styles.headerSetting}>
                            <View style={styles.header}>
                                <View style={styles.identification}>
                                    <Ionicons name="body" size={22} color="#F59031" />
                                    {/* 依據是里長還里民帳號更改文字內容 */}
                                    <Text style={styles.headerLeft}>{userUID === "aa9tVklivRWdKuuu6fMN8U9va5g2" ? "里長" : "里民"}
                                    </Text>
                                </View>
                                {/* 登出程式 */}
                                <TouchableOpacity
                                    onPress={() => onLogout()}
                                    style={styles.logOut}
                                >
                                    {/* <View style={styles.logOut}> */}
                                    <Text style={styles.headerRight}>登出</Text>
                                    <Ionicons name="log-out-outline" size={22} color='#F59031' />
                                    {/* </View> */}

                                </TouchableOpacity>
                            </View>

                            <View style={styles.individualInfo}>
                                <Card style={styles.viewTitle}>

                                    <View style={styles.namePhoto} >


                                        <Ionicons name="person-circle" size={60} color={userSex} style={styles.iconTitle} />
                                        <Text style={styles.txtName}>{userName}</Text>
                                    </View>
                                    <View style={styles.phoneMail}>
                                        {/* 新增電話信箱 */}
                                        <Text style={{ fontSize: 18 }}>電話：{userPhone}</Text>
                                        <Text style={{ fontSize: 18 }}>信箱：{userMail}</Text>
                                    </View>

                                </Card>

                            </View>

                        </View>
                    </View>
                    <KeyboardAwareScrollView>
                        <View style={styles.village}>

                            <View style={{ alignItems: 'center', borderRightWidth: 2, paddingRight: '20%', marginRight: '20%', borderRightColor: '#D6D5D5' }}>
                                <Image source={require('./../images/village.png')} style={{ width: 50, height: 50 }} />
                                {/* 資料庫載入里長名字 or 寫死 ? */}
                                <Text style={{ fontSize: 18, marginTop: '15%' }}>長庚里</Text>
                            </View>


                            <View style={{ alignItems: 'center' }}>
                                <Image source={require('./../images/old.png')} style={{ width: 50, height: 50 }} />
                                {/* 資料庫載入里名 or 寫死 ? */}
                                <Text style={{ fontSize: 18, marginTop: '15%' }}>蔡明達</Text>
                            </View>

                        </View>


                        <View style={{ backgroundColor: '#F3F3F3', height: '34%', marginTop: '2%' }}>


                            <TouchableOpacity
                                style={styles.btnRender}
                                // 里民 -> 連結到篩選的資料而非所有文章
                                onPress={() => blogArticleScreen()}
                            >
                                <View style={styles.btnSetting}>
                                    <View style={styles.iconText}>
                                        <Ionicons name="newspaper-outline" size={25} color="black" />
                                        <Text style={styles.btnText}>
                                            {userUID === "aa9tVklivRWdKuuu6fMN8U9va5g2" ? "看板審核" : "我的文章"}
                                        </Text>
                                    </View>
                                    <View style={styles.rightArrow}>
                                        <Ionicons name="chevron-forward-outline" size={25} color="#A09F9C" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.borderRender}></View>

                            {/* <TouchableOpacity
                            // 里民 -> 連結到篩選的資料

                            style={styles.btnRender}
                            onPress={() => blogScreen()}
                        >
                            <View style={styles.btnSetting}>
                                <View style={styles.iconText}>
                                    <Ionicons name="bookmarks-outline" size={25} color="black" />
                                    <Text style={styles.btnText}>我的收藏</Text>
                                </View>
                                <View style={styles.rightArrow}>
                                    <Ionicons name="chevron-forward-outline" size={25} color="#A09F9C" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.borderRender}></View> */}

                            <TouchableOpacity
                                style={styles.btnRender}
                                // 里民 -> 連結到篩選的資料而非所有投票
                                onPress={() => pollScreen()}
                            >
                                <View style={styles.btnSetting}>
                                    <View style={styles.iconText}>
                                        <Ionicons name="hand-right-outline" size={25} color="black" />
                                        <Text style={styles.btnText}>投票統計</Text>
                                    </View>
                                    <View style={styles.rightArrow}>
                                        <Ionicons name="chevron-forward-outline" size={25} color="#A09F9C" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.borderRender}></View>

                            <TouchableOpacity
                                style={styles.btnRender}
                                // 里民 -> 連結到篩選的資料而非所有活動
                                onPress={() => activityScreen()}
                            >
                                <View style={styles.btnSetting}>
                                    <View style={styles.iconText}>
                                        <Ionicons name="walk" size={25} color="black" />
                                        <Text style={styles.btnText}>報名狀況</Text>
                                    </View>
                                    <View style={styles.rightArrow}>
                                        <Ionicons name="chevron-forward-outline" size={25} color="#A09F9C" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.borderRender}></View>

                            <TouchableOpacity
                                style={styles.btnRender}
                                // 里民 -> 連結到篩選的資料而非所有活動
                                onPress={() => fixScreen()}
                            >
                                <View style={styles.btnSetting}>
                                    <View style={styles.iconText}>
                                        <Ionicons name="construct-outline" size={25} color="black" />
                                        <Text style={styles.btnText}>修繕進度</Text>
                                    </View>
                                    <View style={styles.rightArrow}>
                                        <Ionicons name="chevron-forward-outline" size={25} color="#A09F9C" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF3CB',
    },
    containerInner: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        marginTop: '8%', //change
    },
    headerBackground: {
        height: 215, //change
        backgroundColor: '#FEF3CB',
        marginBottom: '20%'
    },
    headerSetting: {
        position: 'relative',
        top: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '4%'
    },
    identification: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logOut: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    headerLeft: {
        fontSize: 16,
        marginLeft: '4%',
        color: '#F59031',
        fontWeight: 'bold'
    },
    headerRight: {
        fontSize: 16,
        marginRight: '4%',
        color: '#F59031',
        fontWeight: 'bold'
    },
    individualInfo: {
        alignItems: 'center',
        marginVertical: '5%'
    },
    viewTitle: {
        justifyContent: 'center',
        width: '94%',
        backgroundColor: 'white', //#FEFCF4
        alignItems: "center",
        paddingVertical: '8%'

    },
    namePhoto: {
        alignItems: 'center',
        marginBottom: '2%'
    },
    phoneMail: {
        //backgroundColor: 'green',
    },
    iconTitle: {
        //backgroundColor: '#000555',
        //margin: '2%',
        // paddingLeft: 12
    },
    txtName: {
        fontSize: 28,
        marginTop: '3%'

    },
    village: {
        flexDirection: 'row',
        marginHorizontal: '4%',
        paddingVertical: '3%',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: '2%'
    },
    btnRender: {
        paddingHorizontal: '3%',
        paddingVertical: '4%',
        backgroundColor: 'white'
    },
    borderRender: {
        backgroundColor: '#D6D5D5', //#D6D5D5
        height: '1%',
        marginHorizontal: '4%'
    },
    btnSetting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnText: {
        fontSize: 18,
        marginLeft: '8%',
    },
    iconText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightArrow: {
        //backgroundColor: 'green',
        //justifyContent: 'center',
    },

});