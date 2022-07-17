import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import firebase from 'firebase';
// 打字不要擋畫面
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function BlogUpdateScreen(props) {
    const passProps = props.route.params.passProps || 'nothing get'
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")

    // 利用文章 ID 搜尋，得到文章內容後顯示於 TextInput 裡面
    useEffect(() => {
        firebase
            .firestore()
            .collection("testBlogAdd")
            .doc(passProps)
            .get()
            .then((doc) => {
                setContent(doc.data().blogContext)
                setTitle(doc.data().blogTitle)
            })
    }, [])
    function updateContent() {
        firebase
            .firestore()
            .collection("testBlogAdd")
            .doc(passProps)
            .update({
                blogTitle: title,
                blogContext: content
            })
            .then(() => {
                props.navigation.pop()
            })
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerInner}>
                <KeyboardAwareScrollView>
                    <View style={{ flexDirection: "row" }}>
                        <View style={styles.textInputSection}>
                            <TextInput
                                style={styles.titleInput}
                                placeholder='標題'
                                placeholderTextColor={'#C0BEB6'}
                                autoFocus={true}
                                multiline={true}
                                maxLength={10}
                                blurOnSubmit={true}
                                textAlignVertical='top'
                                onChangeText={(text) => setTitle(text)}
                                value={title}
                            />

                            <TouchableWithoutFeedback
                                onPress={Keyboard.dismiss}
                            >
                                <View style={styles.textInputSection}>
                                    <TextInput
                                        style={styles.contentInput}
                                        placeholder='內容...'
                                        placeholderTextColor={'#C0BEB6'} //#D9D7CD
                                        multiline={true}
                                        textAlignVertical='top'
                                        onChangeText={(text) => setContent(text)}
                                        value={content}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <KeyboardAvoidingView style={{ width: '100%' }} behavior='padding' keyboardVerticalOffset={120}>
                    <View style={styles.bottomBarInner}>
                        <TouchableOpacity
                            style={{ marginRight: 0 }}
                            onPress={() => Keyboard.dismiss()}
                        >
                            <Image
                                style={{ width: 30, height: 30 }}
                                source={require('../images/keyboard.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
            <View>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => updateContent()}
                >
                    <Text style={styles.buttonText}>更 新 文 章</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFBF0',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    containerInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: '4%',
    },
    textInputSection: {
        width: '100%',
        marginTop: 5,
        marginBottom: 5,
    },
    // input: {
    //     height: 300,
    //     width: 300,
    //     margin: 12,
    //     borderWidth: 1,
    //     padding: 10,
    // },
    titleInput: {
        color: '#242322',
        fontSize: 32,
        fontWeight: '500',
        height: 100,
    },
    contentInput: {
        color: '#484744', //#242322
        fontSize: 20,
        fontWeight: 'normal',
    },
    buttonContainer: {
        backgroundColor: '#aa5',
        backgroundColor: '#222',
        borderRadius: 5,
        padding: 10,
        margin: 20
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
    },
    bottomBarInner: {
        width: '100%',
        height: 30,
        flexDirection: 'row',
        justifyContent: "flex-end",
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 5

    },
});