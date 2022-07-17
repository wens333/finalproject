// import { StatusBar } from 'expo-status-bar';
// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, TextInput, View, KeyboardAvoidingView, ScrollView, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import * as ImagePicker from 'expo-image-picker'
// import firebase from "firebase";
// import 'firebase/auth';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'



// export const ButtonAdd = (props) => {

//     const [btopic, setbtopic] = useState("");
//     const [title, setTitle] = useState("");
//     const [context, setContext] = useState("");
//     const { navigation } = props;

//     // ImagePicker
//     const [image, setImage] = useState(null);
//     const [result, setResult] = useState(null)
//     const [filename, setFilename] = useState(null)
//     // 每位會員第一次上傳照片需要跑兩次
//     const [count, setCount] = useState(0)

//     const [displayName, setDisplayName] = useState("");

//     //-------------------判斷是否為本人抓出他的名字並存到資料庫------------
//     useEffect(() => {

//         firebase.firestore().collection('user').where('id', '==', firebase.auth().currentUser.uid).get().then(querySnapshot => {
//             querySnapshot.forEach(doc => {
//                 // console.log(doc.data().name)
//                 setDisplayName(doc.data().name)
//             });
//         });
//     }, [])

//     //-------------------------------------------------------------------------

//     useEffect(() => {
//         (async () => {
//             if (Platform.OS !== 'web') {
//                 const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//                 if (status !== 'granted') {
//                     alert('Sorry, we need camera roll permissions to make this work!');
//                 }
//             }
//         })();
//     }, []);
//     //-----------------------------------------------------------------------

//     //--------------------新增貼文->選取圖片---------------------------------
//     const randomImageName = () => {
//         const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//         let result1 = Math.random().toString(36).substring(0, 8);
//         return result1.substring(result1.lastIndexOf('.') + 1)
//     }

//     const BlogPickImage = async () => { // async () 

//         let result = await ImagePicker.launchImageLibraryAsync({ // await
//             mediaTypes: ImagePicker.MediaTypeOptions.All,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//         });

//         setResult(result)

//         console.log(result)

//         if (!result.cancelled) {
//             setImage(result.uri);
//         }

//         // setFilename(image.substring(image.lastIndexOf('/') + 1))
//         setFilename(randomImageName())
//         // const filename = image.substring(image.lastIndexOf('/') + 1);
//         const file = {
//             uri: image,
//             name: filename,
//             type: 'image/jpg'
//         }

//         const formData = new FormData();
//         formData.append("file", file)

//         const metadata = {
//             contentType: 'image/jpg',
//         };
//     };
//     //--------------------新增貼文->選取圖片-------------------------


//     //儲存一開始新增的貼文資料------------------------------------------------------


//     //---------------儲存圖片與貼文內容到資料庫---------------------------
//     const UploadPost = async () => {
//         if (!result.cancelled) {
//             setImage(result.uri);
//         }
//         setFilename(image.substring(image.lastIndexOf('/') + 1))

//         const file = {
//             uri: image,
//             name: filename,
//             type: 'image/jpg'
//         }

//         const formData = new FormData();
//         formData.append("file", file)

//         const metadata = {
//             contentType: 'image/jpg',
//         };


//         const documentRef = firebase.firestore().collection('testBlogAdd').doc()

//         const blob = await new Promise((resolve, reject) => {
//             const xhr = new XMLHttpRequest();
//             xhr.onload = function () {
//                 resolve(xhr.response);
//             };
//             xhr.onerror = function () {
//                 reject(new TypeError("Network request failed"));
//             };
//             xhr.responseType = "blob";
//             xhr.open("GET", image, true);
//             xhr.send(null);
//         });
//         const bloRef = firebase.storage().ref().child('blogPicture').child(filename);

//         const task = bloRef.put(blob, { contentType: 'image/jpg' });

//         task.on('state_changed',
//             (snapshot) => {
//                 console.log(snapshot.totalBytes)
//             },
//             (err) => {
//                 console.log("-----" + err + "為空")
//             },
//             () => {
//                 task.snapshot.ref.getDownloadURL().then((downloadURL) => {
//                     documentRef.set({
//                         blogItems: btopic,
//                         blogTitle: title,
//                         blogContext: context,
//                         blogPhotoURL: downloadURL || 'nothing get',
//                         blogDate: firebase.firestore.Timestamp.now(),
//                         blogAuther: {
//                             // autherName: firebase.auth().currentUser.displayName || "",
//                             authorName: displayName || "",
//                             //firebase.auth().currentUser.photoURL || '',
//                             userPhotoURL: firebase.auth().currentUser.photoURL || 'havent get',
//                             uid: firebase.auth().currentUser.uid,
//                             email: firebase.auth().currentUser.email
//                         }
//                     }).then(() => {
//                         // 「跳轉頁面」 

//                         console.log("新增成功");
//                         navigation.navigate("BlogScreen")
//                         console.log(downloadURL)
//                         console.log('Nice')
//                         // Alert.alert("修繕表單", "我們已收到修繕表單，感謝您用心填報，謝謝=)", [
//                         //     { text: "OK", onPress: () => console.log("ok Pressed") },
//                         // ])


//                     })
//                 });
//             })
//     };
//     //---------------------儲存圖片與貼文內容到資料庫----------------

//     //............儲存格式...............
//     // name: userName,
//     // phone: phoneNumber,
//     // topic: btopic,
//     // phoneUrl: downloadURL,
//     // datetime: firebase.firestore.Timestamp.now(),  //放入firebase當下的時間
//     // address: reportPlace,
//     // content: content,
//     //.............儲存格式...............                    


//     //儲存一開始新增的貼文-----------------------------------------------------
//     //     const saveAddData = () => {
//     //     firebase.firestore().collection("testBlogAdd").add({
//     //         blogItems: btopic,
//     //         blogTitle: title,
//     //         blogContext: context,
//     //         blogDate: firebase.firestore.Timestamp.now(),
//     //         blogAuther: {
//     //             // autherName: firebase.auth().currentUser.displayName || "",
//     //             authorName: displayName || "",
//     //             photoURL: firebase.auth().currentUser.photoURL || '',
//     //             uid: firebase.auth().currentUser.uid,
//     //             email: firebase.auth().currentUser.email
//     //         }
//     //     })
//     //         .then(function () {
//     //             console.log("新增成功");
//     //             navigation.navigate("BlogScreen")


//     //         })
//     //     console.log('是saveAddData!!')
//     // };
//     //儲存一開始新增的貼文資料------------------------------------------------------


//     return (
//         <View style={styles.container}>
//             {/* <KeyboardAwareScrollView style={{ width: '100%' }}> */}
//             <View style={styles.containerInner}>
//                 <KeyboardAwareScrollView style={{ width: '100%' }}>
//                     <View>

//                         <RNPickerSelect
//                             style={{
//                                 ...customPickerStyles,
//                                 iconContainer: {
//                                     top: 10,
//                                     left: 58,
//                                 },
//                             }}
//                             placeholder={{ label: "類別", value: null, color: 'gray' }}
//                             onValueChange={(btopic) => setbtopic(btopic)}
//                             items={[
//                                 { label: "種植", value: "種植" },
//                                 { label: "生活", value: "生活" },
//                                 { label: "日常", value: "日常" },
//                                 { label: "商家", value: "商家" },
//                                 { label: "美食", value: "美食" },
//                             ]}
//                             Icon={() => {
//                                 return <Ionicons name="chevron-down-outline" size={20} color="gray" />;
//                             }}
//                         />

//                         {/* <KeyboardAwareScrollView style={{ width: '100%' }}> */}
//                         <View style={styles.textInputSection}>
//                             <TextInput
//                                 style={styles.titleInput}
//                                 placeholder='標題'
//                                 placeholderTextColor={'#C0BEB6'} //##D9D7CD #B5B3AB #ACAAA2
//                                 autoFocus={true}
//                                 multiline={true}
//                                 maxLength={20}
//                                 blurOnSubmit={true}
//                                 // onSubmitEditing={ }
//                                 textAlignVertical='top'
//                                 onChangeText={(text) => setTitle(text)}
//                             />
//                         </View>
//                         {/* </KeyboardAwareScrollView> */}

//                         <TouchableWithoutFeedback
//                             onPress={Keyboard.dismiss}
//                         >
//                             {/* <KeyboardAwareScrollView style={{ width: '100%' }}> */}
//                             <View style={styles.textInputSection}>
//                                 <TextInput
//                                     style={styles.contentInput}
//                                     placeholder='內容...'
//                                     placeholderTextColor={'#C0BEB6'} //#D9D7CD
//                                     multiline={true}
//                                     textAlignVertical='top'
//                                     onChangeText={(text) => setContext(text)}
//                                 />
//                             </View>
//                             {/* </KeyboardAwareScrollView> */}
//                         </TouchableWithoutFeedback>
//                         {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
//                     </View>
//                 </KeyboardAwareScrollView>

//                 {/* <View style={styles.bottomBar}> */}
//                 <KeyboardAvoidingView style={{ width: '100%' }} behavior='padding' keyboardVerticalOffset={110}>
//                     <View style={styles.bottomBarInner}>
//                         <TouchableOpacity
//                             style={{ marginLeft: 0 }}
//                             onPress={BlogPickImage}
//                         >
//                             <Image
//                                 style={{ width: 25, height: 25 }}
//                                 source={require('../images/pictureAdd.png')}
//                             />
//                         </TouchableOpacity>


//                         <TouchableOpacity
//                             style={{ marginRight: 0 }}
//                             onPress={() => Keyboard.dismiss()}
//                         >
//                             <Image
//                                 style={{ width: 30, height: 30 }}
//                                 source={require('../images/keyboard.png')}
//                             />
//                         </TouchableOpacity>
//                     </View>
//                 </KeyboardAvoidingView>
//                 {/* </View> */}


//                 {/* {Image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}

//                 <TouchableOpacity
//                     style={styles.buttonContainer}
//                     onPress={() => UploadPost()}
//                 >
//                     <Text style={styles.buttonText}>Save</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* </KeyboardAwareScrollView > */}
//             <StatusBar style="auto" />
//         </View >
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FEFBF0',
//     },
//     containerInner: {
//         flex: 1,
//         // backgroundColor: '#FFF', //#FFEBA4
//         alignItems: 'center',
//         justifyContent: 'center',
//         margin: '4%',
//     },
//     textInputSection: {
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
//     titleInput: {
//         // backgroundColor: '#aaa',
//         color: '#242322', //#484744
//         fontSize: 32,
//         fontWeight: '500',
//         height: 100,
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
//     contentInput: {
//         // backgroundColor: '#aaa',
//         color: '#484744', //#242322
//         fontSize: 20,
//         fontWeight: 'normal',
//         // // width: '100%',
//         // fontSize: 20,
//         // borderWidth: 1,
//         // borderColor: 'black',
//         // // padding: 10
//     },
//     // bottomBar: {
//     //     backgroundColor: "#A66",
//     //     width: '100%',
//     //     // flexDirection: 'row',
//     //     // justifyContent: 'space-between',
//     //     // marginTop: 10,
//     //     // width: '100%',
//     //     // flex: 1,
//     //     // alignItems: 'stretch',
//     // },
//     bottomBarInner: {
//         // backgroundColor: "#aaa",
//         width: '100%',
//         height: 30,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',

//         // marginTop: 10,
//         paddingHorizontal: 10,
//         marginTop: 10,
//         marginBottom: 5

//     },
//     buttonContainer: {
//         width: '100%',
//         backgroundColor: '#222',
//         borderRadius: 5,
//         padding: 10,
//         margin: 20
//     },
//     buttonText: {
//         fontSize: 20,
//         color: '#fff'
//     }

// });

// const customPickerStyles = StyleSheet.create({
//     inputIOS: {
//         width: 80,
//         fontSize: 16,
//         textAlign: 'center',
//         padding: 10,
//         borderWidth: 1,
//         borderColor: '#DCDCDC',
//         borderRadius: 8,
//         backgroundColor: '#DCDCDC',
//         paddingRight: 30, // to ensure the text is never behind the icon
//         fontWeight: 'bold',
//         // marginBottom: 5,
//         // marginLeft: 10,
//     },
//     inputAndroid: {
//         fontSize: 15,
//         paddingHorizontal: 10,
//         paddingVertical: 8,
//         borderWidth: 1,
//         borderColor: 'blue',
//         borderRadius: 8,
//         color: 'black',
//         paddingRight: 30, // to ensure the text is never behind the icon
//     },
// });