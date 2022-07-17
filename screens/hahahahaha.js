            // {/* 作者照片 */}
            // {/* <Image source={post.blogAuther.photoURL} /> */}
            // {/* 作者名稱 */}
            // <Text>{post.blogAuther.authorName || '使用者'}</Text>
            // <Text>{post.blogItems}</Text>
            // <Text>{post.blogDate?.toDate().toLocaleDateString()}</Text>
            // <Text>{passProps.blogTitle}</Text>
            // <Text>{passProps.blogContext}</Text>
            // <Text>讚{post.likedBy?.length || 0} 留言{post.commentsCount || 0}</Text>
            // <View>
            //     <TouchableOpacity
            //         style={{ backgroundColor: '#DCDCDC', width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
            //         onPress={() => blogLike()}
            //     >
            //         {isLiked ?
            //             <Ionicons name="heart" size={30} color="red" /> :
            //             <Ionicons name="heart-outline" size={30} color="black" />}

            //     </TouchableOpacity>
            // </View>
            // <View>
            //     <TouchableOpacity
            //         style={{ backgroundColor: '#DCDCDC', width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
            //         onPress={() => blogCollect()}
            //     >
            //         {isCollected ?
            //             <Ionicons name="bookmark" size={30} color="black" /> :
            //             <Ionicons name="bookmark-outline" size={30} color="black" />}

            //     </TouchableOpacity>
            // </View>




            // <View style={styles.comment}>
            //     <TextInput
            //         style={styles.inputTextComment}
            //         placeholder={'留言'}
            //         multiline={true}
            //         textAlignVertical='top'
            //         value={commentContent}
            //         onChangeText={(text) => setCommentContent(text)}
            //     //placeholderTextColor={'#C7D6D8'} //#B0C4DE
            //     //maxLength={12}
            //     />
            //     <TouchableOpacity
            //         style={styles.btnComment}
            //         onPress={() => onSubmit()}

            //     >
            //         <Text>送出</Text>

            //     </TouchableOpacity>

            //     {/* <Button
            //     style={styles.btnComment}
            //     onPress={() => onSubmit()}
            //     title="送出"
            //     type="clear"
            //     color="black"
            //     loading={isLoading}
            // /> */}

            // </View>

            // <View>
            //     {/* <Image source="" /> */}
            //     <Text>共 {post.commentsCount || 0} 則留言</Text>
            //     {/* <Text>使用者名稱 {new Date().toLocaleString()}</Text>
            // <Text>留言內容</Text> */}

            //     <FlatList
            //         data={comments}
            //         renderItem={(cases) => renderComment(cases.item)}
            //         keyExtractor={(cases) => cases.key}
            //     />