import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, TextInput, FlatList, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebase from 'firebase';

export default function BlogScreen(props) {
    const [btopic, setbtopic] = useState("");
    const { navigation } = props
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState();

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

    // 顯示資料庫 Data on Flatlist
    // useEffect(() => {
    //     // 目前實作收藏
    //     firebase.firestore().collection("testBlogAdd")
    //         .get().then((collectionSnapshot) => {
    //             const data = collectionSnapshot.docs.map(docSnapshot => {
    //                 const id = docSnapshot.id
    //                 return { ...docSnapshot.data(), id }
    //             })
    //             setUsers(data)
    //         })
    // }, [])

    useEffect(() => {

        const blogsubscriber = firebase.firestore()
            .collection('testBlogAdd')
            .onSnapshot(querySnapshot => {
                const users = [];
                querySnapshot.forEach(documentSnapshot => {

                    users.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id
                    });
                });
                // console.log(users);
                setUsers(users);
                setLoading(false);
            });



        return () => blogsubscriber();
    }, []);

    const catchTest = () => {
        firebase.firestore()
            .collection('testBlogAdd')
            .onSnapshot(querySnapshot => {
                const users = [];
                querySnapshot.forEach(documentSnapshot => {
                    users.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id
                    });
                });
                setUsers(users);
            });
    }

    //----------------------------------------顯示db資料 on Flatlist----------------------------------------------

    //-----------------------------------------篩選類別貼文---------------------------------------------------------
    const documentRef = firebase.firestore().collection('testBlogAdd')
    const whatType = (btopic) => {
        setbtopic(btopic)

        if (btopic == '種植') {
            console.log("Planting")
            documentRef.where("blogItems", "==", "種植").get().then((querySnapshot) => {
                const data = querySnapshot.docs.map(docSnapshot => {
                    const id = docSnapshot.id
                    return { ...docSnapshot.data(), id }
                })
                setUsers(data)

                // const users = [];
                // querySnapshot.forEach(doc => {
                //     users.push({
                //         ...doc.data(),
                //         key: doc.id
                //     })
                // });
                // setUsers(users)
                // console.log('Plant is here')
                // console.log(users)
                // console.log(users.length)
                // console.log('here is Plant')
            })

        }
        else if (btopic == '生活') {
            console.log("Life is still going on")
            documentRef.where("blogItems", "==", "生活").get().then(querySnapshot => {
                const users = [];
                querySnapshot.forEach(doc => {
                    users.push({
                        ...doc.data(),
                        key: doc.id
                    })
                });

                setUsers(users)
                console.log('Life is here')
                console.log(users)
                console.log(users.length)
                console.log('here is Life')

            });
        }
        else if (btopic == '日常') {

            console.log("My daily!")
            documentRef.where("blogItems", "==", "日常").get().then(querySnapshot => {
                const users = [];
                querySnapshot.forEach(doc => {
                    users.push({
                        ...doc.data(),
                        key: doc.id
                    })
                });
                setUsers(users)
                console.log('daily is here')
                console.log(users)
                console.log(users.length)
                console.log('here is daily')
            });
        }

        else if (btopic == '商家') {

            console.log("Welcom To Our Store!")
            documentRef.where("blogItems", "==", "商家").get().then(querySnapshot => {
                const users = [];
                querySnapshot.forEach(doc => {
                    users.push({
                        ...doc.data(),
                        key: doc.id
                    })
                });
                setUsers(users)
                console.log('Store is here')
                console.log(users)
                console.log(users.length)
                console.log('here is Store')
            });
        }

        else if (btopic == '美食') {

            console.log("Food is a healing thing!")
            documentRef.where("blogItems", "==", "美食").get().then(querySnapshot => {
                const users = [];
                querySnapshot.forEach(doc => {
                    users.push({
                        ...doc.data(),
                        key: doc.id
                    })
                });
                setUsers(users)
                console.log('Food is here')
                console.log(users)
                console.log(users.length)
                console.log('here is Food')
            });
        }

        else if (btopic == 'null') {
            documentRef.get().then(querySnapshot => {

                const users = [];
                querySnapshot.forEach(doc => {
                    users.push({
                        ...doc.data(),
                        key: doc.id
                    });
                });
                setUsers(users)
                // console.log('All type are in  here')
                // console.log(users)
                // console.log(users.length)
                // console.log('here are All Type')
            });

        }

    }

    // };
    //-----------------------------------------篩選類別貼文---------------------------------------------------------

    const [testTest, setTestTest] = useState([])
    const filterTitle = (query) => {
        catchTest()
        console.log(users)
        // let filterPost = []
        // users.forEach(doc => {
        //     filterPost.push(doc.blogTitle)
        // })
        // console.log('---1---');
        // console.log(filterPost);
        // console.log('---2---');
        //let searchSame = filterPost.filter(function (text, index, arr) {
        // console.log(query)
        // console.log(text)
        // console.log(text, index)
        // console.log(text === query)
        // return text === query;
        //});

        // let testTest = filterPost.filter(function (item, index, array) {
        //     return item.indexOf(query) != -1;
        // });

        // let filterBlogTitle = users.filter((item) => {
        //     return item.blogTitle === query
        // })

        // setUsers(filterBlogTitle)

        // filterPost.forEach(item => {
        //     if (item.indexOf(query) != -1) {
        //         // console.log(item)
        //         testTest.push(item)
        //     }
        // })
        // console.log(test)
        // setTestTest(testTest)

        // testTest.forEach(item => {
        // console.log(item)
        // })
        // console.log('025')
        // const result = searchSame[0]
        // console.log(result)

        // const searchTitle = firebase.firestore().collection('testBlogAdd');

        // console.log("搜尋文章")
        // searchTitle.orderBy("blogTitle").startAt(`%${query}%`).endAt(query + "\uf8ff").get().then(querySnapshot => {
        // searchTitle.where("blogTitle", 'in', testTest).get().then(querySnapshot => {
        //     const users = [];
        //     //     const users = [];
        //     querySnapshot.forEach(doc => {
        //         users.push({
        //             ...doc.data(),
        //             key: doc.id
        //         })
        //     });
        //     setUsers(users)
        //     // setTestTest([])
        //     // console.log('article is here')
        //     // console.log(users)
        //     // console.log(users.length)
        //     // console.log('here is article')
        // });

        firebase.firestore().collection('testBlogAdd').where("blogTitle", "==", query)
            .get()
            .then((querySnapshot) => {
                const test = [];
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());

                    test.push({
                        ...doc.data(),
                        key: doc.id
                    })
                });

                setUsers(test)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
    // - - - - - - - - - - - - - - - - - - - - - -


    //-------------------------------------------上傳圖片-----------------------------------------------------------

    //-------------------------------------------上傳圖片-----------------------------------------------------------




    //把貼文的標題與內文的資料傳送BlogDetailScreen去
    const showArticleDetail = (cases) => {
        navigation.push('BlogDetailScreen', { passProps: cases })
    }
    //把貼文的標題與內文的資料傳送BlogDetailScreen去

    //貼文顯示在畫面上的樣子
    const renderArticle = (cases) => {
        // console.log(documentSnapshot.id)

        return (
            < TouchableOpacity onPress={() => showArticleDetail(cases)} >

                <View style={styles.mainView}>
                    <View style={styles.imageSection}>
                        <Image
                            style={styles.image}
                            source={{ uri: cases.blogPhotoURL }}
                        />
                    </View>
                    <View style={styles.mainViewContainer}>
                        {/* <View style={styles.mainViewCategory}> */}
                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.TextCategory} >
                            {cases.blogItems}
                        </Text>
                        {/* </View> */}
                        <Text ellipsizeMode='tail' numberOfLines={2} style={styles.textTitle}>
                            {cases.blogTitle}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="heart" size={14} color="#b45f50" style={{ marginRight: 5 }} />
                            <Text
                                style={{ fontSize: 16, marginRight: 5 }}
                            >
                                {cases.likedBy?.length || 0}  </Text>
                            <Ionicons name="chatbox-ellipses" size={14} color="#50A6B4" style={{ marginRight: 5 }} />
                            <Text
                                style={{ fontSize: 16, marginRight: 5 }}
                            >
                                {cases.commentsCount || 0} </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.seperator} />

            </TouchableOpacity >
        )
    };



    //     <View>
    //     <View style={styles.mainView}>

    //         <Image
    //             style={{ width: 50, height: 60, marginRight: 10 }}
    //             source={{ uri: cases.blogPhotoURL }}
    //         />

    //         <Text ellipsizeMode='tail' numberOfLines={1} style={styles.mainViewTitle}>
    //             {cases.blogTitle}
    //         </Text>
    //         {/* <Text ellipsizeMode='tail' numberOfLines={1} style={styles.mainViewContent}>
    //             {cases.blogContext}
    //         </Text> */}
    //     </View>
    //     <View style={styles.seperator} />
    // </View>



    return (
        <View style={styles.container}>
            <View style={styles.containerTop}>

                <View style={styles.searchSection}>
                    <View style={styles.searchTextInputSection}>
                        <TouchableWithoutFeedback
                            onPress={Keyboard.dismiss}
                        >
                            <View style={{ flexDirection: 'row', width: '80%', alignItems: 'center' }}>
                                <Ionicons name="search-outline" size={20} color="gray" />
                                <TextInput
                                    style={{ fontSize: 16, marginLeft: 10, paddingVertical: 5 }}
                                    placeholder='搜尋'
                                    value={query}
                                    onChangeText={(queryText) => setQuery(queryText)}
                                // multiline='true'
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableOpacity style={{ width: 40, alignItems: 'center', justifyContent: 'center', marginRight: 5 }}
                            onPress={() => setQuery("")}>
                            <Ionicons name="close-outline" size={20} color="gray" />

                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.btnSearch}
                        onPress={() => filterTitle(query)}>
                        <Text style={{ fontWeight: 'bold' }}>搜尋</Text>
                    </TouchableOpacity>

                </View>

                <View style={{ backgroundColor: '#D5D2C9', paddingHorizontal: '3%', flexDirection: 'row' }}>
                    <RNPickerSelect
                        style={{
                            ...customPickerStyles,
                            iconContainer: {
                                top: 4,
                                // left: 58,
                                right: '81.5%',
                            },
                        }}
                        placeholder={{ label: "全部", value: 'null', color: 'gray' }}
                        onValueChange={(btopic) => whatType(btopic)}
                        items={[
                            { label: "種植", value: "種植" },
                            { label: "生活", value: "生活" },
                            { label: "日常", value: "日常" },
                            { label: "商家", value: "商家" },
                            { label: "美食", value: "美食" },
                        ]}
                        Icon={() => {
                            return <Ionicons name="chevron-down-outline" size={20} color="gray" />;
                        }}
                    />

                </View>

            </View>
            {/* show data from db on flatlist */}
            {/* <KeyboardAwareScrollView style={{ width: '100%' }}> */}

            <FlatList
                data={users}
                renderItem={(cases) => renderArticle(cases.item)}
                keyExtractor={(cases) => cases.key}
                style={{ backgroundColor: '#FEFBF0' }}
            />
            {/* </KeyboardAwareScrollView > */}


            < TouchableOpacity
                style={styles.btnAdd}
                // onPress={() => props.navigation.push('blogAdd')}
                onPress={() => navigation.navigate('BlogAddScreen')
                }
            >
                <Image
                    style={{ width: 30, height: 30 }}
                    source={require('../images/write.png')}
                />

            </TouchableOpacity >
            <StatusBar style="auto" />
        </View >);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFBF0',
    },
    containerTop: {
        backgroundColor: '#FFEBA4', //#FAD563 #DAA529 #DEB887 #FFE4B8 #97846C #655656
        paddingTop: 13,
    },
    searchSection: {
        // width: '94%',
        marginHorizontal: '3%',
        marginTop: 35, //搜尋離頂端距離 7  邱：13 蔡：35
        marginBottom: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',

        // borderRadius: 5,
        // flexDirection: 'row',
        // margin: 10,
        // // height: 35,
        // backgroundColor: '#CaffBB',  //#DCDCDC #FFEBA4 #C7BBBB
        // justifyContent: 'space-between',
        // alignItems: 'center',
        // paddingLeft: 10,
        // marginHorizontal: '3%',
    },
    searchTextInputSection: {
        backgroundColor: '#D5C489', //#C7BBBB #E9D796 #D5C489
        borderRadius: 5,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',

    },
    btnSearch: {
        width: '18%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#E9D796' //#C1B27C #AA5 #AEABA0 #C7B683 #D5C489
    },
    mainView: {
        backgroundColor: '#FEFBF0', //#FEFBF0
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '3%',
        paddingVertical: 10,
    },
    imageSection: {
        // backgroundColor: '#A5D',
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 20,
    },
    mainViewContainer: {
        // backgroundColor: '#A5D',
        justifyContent: 'space-between',
        width: '72%',
    },
    TextCategory: {
        // backgroundColor: '#a2a',
        color: '#4169E1', //#4169E1 #4560AE
        fontSize: 15,
        textAlign: 'right',
        alignItems: 'center',
    },
    textTitle: {
        fontSize: 20,
        width: '90%',
    },
    seperator: {
        height: 5,
        backgroundColor: '#D5D2C9' //#ddada5 #D9D7CD
    },
    // actionButtonIcon: {
    //     fontSize: 20,
    //     height: 22,
    //     color: 'white',
    // },
    btnAdd: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#D5D2C9',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
});

const customPickerStyles = StyleSheet.create({
    inputIOS: {
        marginRight: '92%',
        width: '96%',
        paddingLeft: '4%',
        paddingVertical: 6,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#585A56', //#97958F #797872 #585A56

    },
    placeholder: {
        color: '#97958F', //#98968F #ACA9A2 #B6B4AC 
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
    }
});