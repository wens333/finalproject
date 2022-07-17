// kailun

// import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, TextInput, FlatList, Keyboard, KeyboardEvent, KeyboardAvoidingView, SafeAreaView, ActivityIndicator } from 'react-native';
// import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CommentTextInput from '../src/components/TextInput/CommentTextInput'
import firebase from 'firebase';



export default function BlogDetailScreen(props) {

    const [image, setimage] = useState(null);
    const [post, setPost] = useState({ blogAuther: {}, });
    const [commentContent, setCommentContent] = useState("");
    //印出留言
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [displayName, setDisplayName] = useState("");
    const [keyboardStatus, setKeyboardStatus] = useState(undefined);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [userSex, setUserSex] = useState('')

    //-------------------判斷是否為本人抓出他的名字並存到資料庫------------
    useEffect(() => {
        firebase.firestore().collection('user').where('id', '==', firebase.auth().currentUser.uid).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                setDisplayName(doc.data().name)
                setUserSex(
                    doc.data().sex === "男生" ? "blue" :
                        doc.data().sex === "女生" ? "pink" : "gray"
                )
            });
        });
    }, [])

    // 將文章類別、標題、內文 變成物件 傳值
    const { navigation } = props
    const passProps = props.route.params.passProps || 'nothing get'

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);

        };
    }, []);

    const _keyboardDidShow = (e) => {
        setKeyboardStatus('Keyboard Shown');
        setKeyboardHeight(e.endCoordinates.height);
    }
    const _keyboardDidHide = (e) => {
        setKeyboardStatus('Keyboard Hidden');
        setKeyboardHeight(0);
    }

    const docKey = passProps.key
    useEffect(() => {
        console.log(passProps.key)
        firebase.firestore()
            .collection("testBlogAdd")
            .doc(docKey)
            .onSnapshot(docSnapshot => {
                const data = docSnapshot.data();
                //console.log(data)
                setPost(data)
            });
    }, [])


    useEffect(() => {
        const commentData = firebase.firestore()
            .collection("testBlogAdd")
            .doc(docKey)
            .collection('comments')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const commentArray = [];
                querySnapshot.forEach(doc => {
                    commentArray.push({
                        ...doc.data(),
                        key: doc.id
                    });
                });
                //console.log(commentArray)
                setComments(commentArray)
            });
        return () => commentData();
    }, [])

    useEffect(() => {

        firebase.firestore().collection('user').where('id', '==', comments).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                setDisplayName(doc.data().name)

            });

        });
    }, [])

    const isCollected = post.collectedBy?.includes(firebase.auth().currentUser.uid)
    const isLiked = post.likedBy?.includes(firebase.auth().currentUser.uid)

    const blogCollect = () => {
        console.log('已收藏')
        const userId = firebase.auth().currentUser.uid;
        //console.log(userId)
        if (isCollected) {
            firebase.firestore().collection('testBlogAdd').doc(docKey).update({
                // 新增
                collectedBy: firebase.firestore.FieldValue.arrayRemove(userId),
            })
        } else {
            firebase.firestore().collection('testBlogAdd').doc(docKey).update({
                // 新增
                collectedBy: firebase.firestore.FieldValue.arrayUnion(userId),
            })
        }
    };

    const blogLike = () => {
        const userId = firebase.auth().currentUser.uid;
        //console.log(userId)
        if (isLiked) {
            firebase.firestore().collection('testBlogAdd').doc(docKey).update({
                // 新增
                likedBy: firebase.firestore.FieldValue.arrayRemove(userId),
            })
        } else {
            firebase.firestore().collection('testBlogAdd').doc(docKey).update({
                // 新增
                likedBy: firebase.firestore.FieldValue.arrayUnion(userId),
            })
        }
    };

    const onSubmit = () => {
        setIsLoading(true);
        const firestore = firebase.firestore();
        const batch = firestore.batch();
        const postRef = firestore.collection('testBlogAdd').doc(docKey);
        batch.update(postRef, {
            commentsCount: firebase.firestore.FieldValue.increment(1)
        })
        const commentRef = postRef.collection('comments').doc()
        batch.set(commentRef, {
            content: commentContent,
            createdAt: firebase.firestore.Timestamp.now(),
            author: {
                uid: firebase.auth().currentUser.uid,
                displayName: displayName || "",
                photoURL: firebase.auth().currentUser.photoURL || "",
            }
        })

        batch.commit().then(() => {
            setCommentContent('');
            setIsLoading(false);
        });
    };
    // console.log(post.blogPhotoURL)

    const renderComment = (cases) => {
        return (
            <View style={styles.commentSection}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="person-circle" size={25} color="gray" style={{ marginRight: 5 }} />
                        <Text
                            style={styles.allCommentsTitleText}
                        >
                            {cases.author.displayName || '使用者'}</Text>
                    </View>
                    <Text
                        style={styles.allCommentsTimeText}
                    >
                        {cases.createdAt.toDate().toLocaleDateString()}</Text>
                </View>
                <Text
                    style={styles.allCommentsContentText}
                >
                    {cases.content}</Text>
            </View>

            // <View style={styles.commentSection}>
            //     <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            //         {/* <Image>{cases.author.photoURL}</Image> */}
            //         <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            //             <Text style={styles.allCommentsTimeText}>{displayName || '使用者'}</Text>
            //             <Text style={styles.allCommentsTimeText}>{cases.createdAt.toDate().toLocaleString()}</Text>

            //         </View>


            //     </View>
            //     <View><Text style={styles.allCommentsTitleText}>{cases.content}</Text></View>
            // </View>
        )
    };

    return (

        <View style={styles.container}>
            {/* <KeyboardAwareScrollView style={{ width: '100%' }}> */}
            <View style={styles.containerInner}>

                <KeyboardAwareScrollView
                    style={{ width: '100%' }}
                >
                    <View>

                        <View style={[styles.headerSection, { justifyContent: 'space-between' }]}>
                            <View style={styles.profileSection}>
                                <Ionicons name="person-circle" size={45} color="pink" />
                                <Text
                                    style={[styles.profileText, { paddingLeft: 10 }]}>{post.blogAuther.authorName}</Text>
                            </View>
                            <Text>{post.blogDate?.toDate().toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.textSection}>

                            <Text
                                style={styles.titleText}
                            >
                                {passProps.blogTitle}</Text>
                        </View>

                        <View style={styles.textSection}>

                            <Text
                                style={styles.categoryText}
                            >
                                {passProps.blogItems}</Text>
                        </View>

                        <View style={[styles.textSection, { marginTop: 20, marginBottom: 50 }]}>

                            <Text
                                style={[styles.contentText, { marginBottom: 30 }]}
                            >
                                {passProps.blogContext}</Text>
                            {/* {Image && <Image source={require('./../images/carrotPhoto.jpg')} style={{ width: 200, height: 200 }} />} */}
                            <Image
                                style={{ width: 200, height: 200 }}
                                source={{ uri: passProps.blogPhotoURL }}
                            />
                        </View>


                        <View style={[styles.textSection, { paddingVertical: 5 }]}>
                            {/* <Image source="" /> */}
                            {/* <Text>共 {post.commentsCount || 0} 則留言</Text> */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, paddingVertical: 2 }}>
                                <Text
                                    style={{ fontSize: 16 }}
                                >
                                    全部留言</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                                    <Ionicons name="heart" size={16} color="#b45f50" style={{ marginRight: 5 }} />
                                    <Text
                                        style={{ fontSize: 20, marginRight: 5 }}
                                    >
                                        {post.likedBy?.length || 0} </Text>
                                    <Ionicons name="chatbox-ellipses" size={16} color="#50A684" style={{ marginRight: 5 }} />
                                    <Text
                                        style={{ fontSize: 20, marginRight: 5 }}
                                    >
                                        {post.commentsCount || 0} </Text>
                                </View>
                            </View>
                            <FlatList
                                data={comments}
                                renderItem={(cases) => renderComment(cases.item)}
                                keyExtractor={(cases) => cases.key}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>



                {/*
                {Image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

                <TouchableOpacity
                    style={styles.buttonContainer}
                // onPress={() => savedata()} 
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity> */}


            </View>

            {/* </KeyboardAwareScrollView > */}

            <KeyboardAvoidingView style={{ width: '100%', backgroundColor: '#F0FEFE' }} behavior={Platform.OS == "ios" ? "padding" : null} keyboardVerticalOffset={(Platform.OS === 'ios') ? 90 : -90}>

                <View style={styles.bottomBar}>
                    {/* <TextInput style={styles.commentInput} placeholder="Click here…" onSubmitEditing={Keyboard.dismiss} />
                <Text style={styles.commentInput}>{keyboardHeight} {keyboardStatus}</Text> */}

                    <View style={styles.bottomBarText}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder='留些什麼吧......'
                            placeholderTextColor={'#A2AAAC'} //#C7D6D8 #8F9698 
                            multiline={true}
                            textAlignVertical='top'
                            value={commentContent}
                            onChangeText={(text) => setCommentContent(text)}
                        />
                    </View>
                    <View style={styles.bottomBarInner}>
                        <TouchableOpacity
                            // style={}
                            onPress={() => blogLike()}
                        >
                            {isLiked ?
                                <Ionicons name="heart" size={25} color="#b45f50" /> :
                                <Ionicons name="heart-outline" size={25} color="black" />}
                            {/* <Ionicons name="heart" size={25} color="black" /> */}
                        </TouchableOpacity>
                        <TouchableOpacity
                            // style={{}}
                            onPress={() => blogCollect()}
                        >
                            {isCollected ?
                                <Ionicons name="bookmark" size={25} color="#50A6B4" /> :
                                <Ionicons name="bookmark-outline" size={25} color="black" />}
                            {/* <Ionicons name="bookmark" size={25} color="black" /> */}

                        </TouchableOpacity>
                        <TouchableOpacity
                            // style={styles.btnComment}
                            onPress={() => onSubmit()}
                        >
                            {
                                isLoading ? <ActivityIndicator animating={isLoading} /> : <Ionicons name={"chevron-forward-circle-outline"} size={25} />
                            }

                        </TouchableOpacity>
                    </View>
                </View>

            </KeyboardAvoidingView>
            <StatusBar style="auto" />
        </View>

        // <View style={styles.container}>
        //     {/* <KeyboardAwareScrollView style={{ width: '100%' }}> */}
        //     <View style={styles.containerInner}>
        //         {/* 作者照片 */}
        //         {/* <Image source={post.blogAuther.photoURL} /> */}
        //         {/* 作者名稱 */}
        //         {/* {image && <Image source={{ uri: "\'" + post.blogPhotoUrl + "\'" }} style={{ width: 200, height: 200 }} />} */}

        //         {/* <Image
        //             style={{ width: 200, height: 200 }}
        //             source={{ uri: post.blogPhotoUrl }}
        //         /> */}
        //         <Text>{post.blogAuther.authorName}</Text>
        //         <Text>{post.blogDate?.toDate().toLocaleDateString()}</Text>
        //         <Text>讚{post.likedBy?.length || 0} 留言{post.commentsCount || 0}</Text>
        //         <KeyboardAwareScrollView style={{ width: '100%' }}>
        //             <View>

        //                 <View style={styles.textSection}>

        //                     <Text
        //                         style={styles.titleText}
        //                     >
        //                         {/* 標題 */}
        //                         {passProps.blogTitle}</Text>
        //                 </View>

        //                 <View style={styles.textSection}>

        //                     <Text
        //                         style={styles.categoryText}
        //                     >
        //                         {/* 類別 */}
        //                         {passProps.blogItems}</Text>
        //                 </View>

        //                 <View style={styles.textSection, { marginVertical: 20 }}>
        //                     <Text
        //                         style={styles.contentText}
        //                     >
        //                         {/* 內文 */}
        //                         {passProps.blogContext}</Text>
        //                     <Image
        //                         style={{ width: 200, height: 200 }}
        //                         source={{ uri: passProps.blogPhotoURL }}
        //                     />




        //                 </View>


        //                 {/* 留言 */}
        //                 <View style={[styles.textSection, { borderTopWidth: 2, paddingVertical: 5 }]}>
        //                     {/* <Image source="" /> */}
        //                     {/* <Text>共 {post.commentsCount || 0} 則留言</Text> */}
        //                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingVertical: 2 }}>
        //                         <Text
        //                             style={{ fontSize: 16 }}
        //                         >
        //                             全部留言</Text>
        //                         <Text
        //                             style={{ fontSize: 16 }}
        //                         >
        //                             共 {post.commentsCount || 0} 則留言</Text>
        //                     </View>

        //                     <FlatList
        //                         data={comments}
        //                         renderItem={(cases) => renderComment(cases.item)}
        //                         keyExtractor={(cases) => cases.key}
        //                     />


        //                 </View>


        //             </View>
        //         </KeyboardAwareScrollView>



        //         {/*
        //                 {Image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

        //                 <TouchableOpacity
        //                     style={styles.buttonContainer}
        //                 // onPress={() => savedata()} 
        //                 >
        //                     <Text style={styles.buttonText}>Save</Text>
        //                 </TouchableOpacity> */}


        //     </View>

        //     {/* </KeyboardAwareScrollView > */}

        //     <KeyboardAvoidingView style={{ width: '100%' }} behavior='padding' keyboardVerticalOffset={90}>
        //         <View style={styles.bottomBar}>
        //             <View style={styles.bottomBarText}>
        //                 <TextInput
        //                     style={styles.commentInput}
        //                     placeholder='留些什麼吧......'
        //                     placeholderTextColor={'#A2AAAC'} //#C7D6D8 #8F9698 
        //                     multiline={true}
        //                     textAlignVertical='top'
        //                     value={commentContent}
        //                     onChangeText={(text) => setCommentContent(text)}
        //                 />
        //             </View>
        //             <View style={styles.bottomBarInner}>
        //                 <TouchableOpacity
        //                     // style={}
        //                     onPress={() => blogLike()}
        //                 >
        //                     {isLiked ?
        //                         <Ionicons name="heart" size={25} color="red" /> :
        //                         <Ionicons name="heart-outline" size={25} color="#DDDADA" />}

        //                 </TouchableOpacity>
        //                 <TouchableOpacity
        //                     // style={{}}
        //                     onPress={() => blogCollect()}
        //                 >
        //                     {isCollected ?
        //                         <Ionicons name="bookmark" size={25} color="black" /> :
        //                         <Ionicons name="bookmark-outline" size={25} color="black" />}

        //                 </TouchableOpacity>
        //                 <TouchableOpacity
        //                     style={styles.btnComment}
        //                     onPress={() => onSubmit()}
        //                 >
        //                     {
        //                         isLoading ? <ActivityIndicator animating={isLoading} /> : <Ionicons name={"chevron-forward-circle-outline"} size={25} />
        //                     }
        //                     {/* <Text>送出</Text> */}

        //                 </TouchableOpacity>
        //             </View>
        //         </View>
        //     </KeyboardAvoidingView>
        //     <StatusBar style="auto" />
        // </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFBF0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '94%',
        marginTop: '4%',
    },
    headerSection: {  //1026新增
        width: '100%',
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
    },
    profileSection: {  //1026新增
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileText: {  //1026新增
        fontSize: 20,
    },
    textSection: {
        width: '100%',
        marginTop: 5,
        marginBottom: 5,
    },
    titleText: {

        color: '#242322', //#484744
        fontSize: 32,
        fontWeight: '500',
        marginBottom: 5,
    },
    categoryText: {
        color: '#4169E1', //#242322
        fontSize: 16,
        fontWeight: '800',
    },
    contentText: {

        color: '#484744', //#242322
        fontSize: 20,
        fontWeight: 'normal',
    },
    commentSection: {
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    allCommentsTitleText: {
        color: '#484744', //#242322
        fontSize: 18,
        fontWeight: '500',
        paddingVertical: 1,
    },
    allCommentsTimeText: {
        color: '#484744', //#242322
        fontSize: 16,
        fontWeight: 'normal',
    },
    allCommentsContentText: {
        color: '#484744', //#242322
        fontSize: 18,
        fontWeight: 'normal',
    },
    commentInput: {
        color: '#242322',
        fontSize: 18,
        fontWeight: 'normal',
        lineHeight: 26,
    },
    bottomBar: {
        backgroundColor: "#F0FEFE",
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: '#F0F9FE',
        paddingHorizontal: '4%',

    },
    bottomBarText: {
        width: '67%',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    bottomBarInner: {
        width: '30%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FEFBF0',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     containerInner: {
//         flex: 1,
//         // backgroundColor: '#FFa888', //#FFEBA4
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '94%',
//         marginTop: '4%',
//     },
//     textSection: {
//         // backgroundColor: '#5EAEDF',
//         width: '100%',
//         // height: 49,
//         // borderWidth: 2,
//         // borderRadius: 10,
//         // borderColor: '#fff',
//         // flexDirection: 'row',
//         // alignItems: 'center',
//         marginTop: 5,
//         marginBottom: 5,
//     },
//     titleText: {

//         color: '#242322', //#484744
//         fontSize: 32,
//         fontWeight: '500',
//         height: 70,
//         // textAlign: 'left',
//         // width: '70%',
//         // paddingLeft: 5,
//         // paddingRight: 10,

//         // width: '100%',

//         // borderWidth: 1,
//         // borderColor: 'black',
//         // margin: 5,
//         // padding: 10,
//         // marginTop: 10
//     },
//     categoryText: {
//         color: '#4169E1', //#242322
//         fontSize: 16,
//         fontWeight: '800',
//     },
//     contentText: {

//         color: '#484744', //#242322
//         fontSize: 20,
//         fontWeight: 'normal',
//         // // width: '100%',
//         // fontSize: 20,
//         // borderWidth: 1,
//         // borderColor: 'black',
//         // // padding: 10
//     },
//     commentSection: {
//         paddingTop: 5,
//         paddingBottom: 5,
//         borderBottomWidth: 1,
//     },
//     allCommentsTitleText: {
//         color: '#484744', //#242322
//         fontSize: 20,
//         fontWeight: '500',
//         paddingVertical: 1,
//         paddingTop: 5,
//         // // width: '100%',
//         // fontSize: 20,
//         // borderWidth: 1,
//         // borderColor: 'black',
//         // // padding: 10
//     },
//     allCommentsTimeText: {
//         color: '#484744', //#242322
//         fontSize: 15,
//         fontWeight: 'normal',
//         // // width: '100%',
//         // fontSize: 20,
//         // borderWidth: 1,
//         // borderColor: 'black',
//         // // padding: 10
//     },
//     allCommentsContentText: {
//         color: '#484744', //#242322
//         fontSize: 18,
//         fontWeight: 'normal',
//         // // width: '100%',
//         // fontSize: 20,
//         // borderWidth: 1,
//         // borderColor: 'black',
//         // // padding: 10
//     },
//     commentInput: {
//         color: '#242322', //#242322
//         fontSize: 18,
//         fontWeight: 'normal',
//         lineHeight: 26,
//         paddingBottom: 10,

//     },
//     bottomBar: {
//         backgroundColor: "#F0FEFE", // #F3F0FE
//         width: '100%',
//         // height: 40,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         borderTopWidth: 2,
//         borderTopColor: '#F0F9FE',
//         // marginTop: 10,
//         paddingHorizontal: '4%',

//     },
//     bottomBarText: {
//         // backgroundColor: "#d5d555",
//         width: '67%',
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 2,
//     },
//     bottomBarInner: {
//         // backgroundColor: "#d5d",
//         width: '30%',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
// });
