import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
// 資料庫
import firebase from 'firebase';

export default function HomePollScreen(props) {
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

    // Firbase Firestore
    const [users, setUsers] = useState([]);

    React.useEffect(() => {
        firebase
            .firestore()
            .collection("poll")
            .onSnapshot((collectionSnapshot) => {
                const data = collectionSnapshot.docs.map(docSnapshot => {
                    const id = docSnapshot.id
                    return { ...docSnapshot.data(), id }
                })
                setUsers(data)
            });
    }, [])

    const showNoticeDetail = (cases) => {
        if (!cases.member.find(user => user === userUID)) {
            props.navigation.push('線上投票詳細內容', { passProps: cases })
        }
        else {
            // console.log('')
            Alert.alert(
                "投票已完成",
                "一人一票，票票等值。",
                [
                    { text: "OK", onPress: () => console.log(userUID) },
                ]
            );
        }
    }

    const renderActivity = (cases) => {
        return (
            <TouchableOpacity
                style={styles.pollContainer}
                onPress={() => showNoticeDetail(cases)}
            >
                {/* <Text style={styles.pollTextTitle}>{cases.title}</Text> */}

                <View style={styles.pollContainerView}>
                    <View style={styles.imageSection}>
                        {Image && <Image source={require('./../images/homePollicon.png')} style={styles.image} />}
                    </View>
                    <View style={styles.txtSection}>
                        <Text style={styles.pollTextTitle}>{cases.title}</Text>
                    </View>
                </View>

            </TouchableOpacity>


        )
    };

    return (
        <View style={styles.container}>
            {/* RN FB IO */}
            <FlatList
                data={users}
                renderItem={(cases) => renderActivity(cases.item)}
                keyExtractor={(cases) => cases.id}
                style={{ paddingVertical: 5, backgroundColor: 'rgba(255,255,255,0.1)' }}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFBF0',
    },
    pollSection: {
        backgroundColor: '#FEFBF0',
        width: '100%',
        paddingVertical: 5,
    },
    pollContainer: {
        backgroundColor: '#F4Cd6c',
        marginHorizontal: '5%',
        borderWidth: 2,
        borderRadius: 10,
        marginVertical: 5,

    },
    pollContainerView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageSection: {
        width: '30%'
    },
    image: {
        width: 95,
        height: 95,
    },
    txtSection: {
        width: '65%',
        marginLeft: '3%',
    },
    pollTextTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
});