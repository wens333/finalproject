import React, { useState, Component } from 'react';
import { TextInput } from 'react-native';
// import PropsTypes from 'props-types'

//換行隨高度增長
class CommentTextInput extends Component {
    constructor(props) {
        super(props);
        this.state = { text: '', height: 0 };
    }
    render() {
        return (
            <TextInput
                {...this.props}
                multiline={true}
                onChangeText={(text) => {
                    this.setState({ text })
                }}
                onContentSizeChange={(event) => {
                    this.setState({ height: event.nativeEvent.contentSize.height })
                }}
                style={[this.props.style, { height: Math.max(40, this.state.height) }]}
                value={this.props.value}
            />
        );
    }
}

// App registration and rendering
// AppRegistry.registerComponent('AwesomeProject', () => UselessTextInput);


// function CommentTextInput(props) {
// constructor(props) {
//     super(props);
//     this.state = { text: '', height: 0 };
// }
// render() {
//     return (
//         <TextInput
//             {...this.props}
//             multiline={true}
//             onChangeText={(text) => {
//                 this.setState({ text })
//             }}
//             onContentSizeChange={(event) => {
//                 this.setState({ height: event.nativeEvent.contentSize.height })
//             }}
//             style={[styles.default, { height: Math.max(35, this.state.height) }]}
//             value={this.state.text}
//         />
//     );
// }

// const [comment, setComment] = useState({
//     commentText: '',
//     height: 0
// })

// return (
//     <TextInput
//         style={props.style}
//         placeholder={props.placeholder}
//         placeholderTextColor={props.placeholderTextColor} //#D9D7CD
//         multiline={props.multiline}
//         textAlignVertical={props.textAlignVertical}
//         value={props.value}
//     // onChangeText={(text) => setComment({ commentText: { text }, height: 8 })}
//     />

// )
// }

export default CommentTextInput