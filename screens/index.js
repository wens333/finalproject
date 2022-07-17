import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen';
import HomeCouponScreen from './HomeCouponScreen';
import HomePollScreen from './HomePollScreen';
import HomePollDetailScreen from './HomePollDetailScreen';

import ProfileScreen from './ProfileScreen';
import ProfileDetailScreen from './ProfileDetailScreen';
import ProfileActivityScreen from './ProfileActivityScreen';
import ProfileFixDetailScreen from './ProfileFixDetailScreen';
import ProfileActivityDetailScreen from './ProfileActivityDetailScreen';
import ProfilePollScreen from './ProfilePollScreen';
import ProfileBlogScreen from './ProfileBlogScreen';
import ProfileBlogArticleScreen from './ProfileBlogArticleScreen';
import ProfileBlogDetailScreen from './ProfileBlogDetailScreen';
import ProfileBlogCollectedScreen from './ProfileBlogCollectedScreen'
import BlogUpdateScreen from './BlogUpdateScreen';

import FormScreen from './FormScreen';
import FormDetailScreen from './FormDetailScreen';
import FormScreenRepair from './FormScreenRepair';
import FormActivityScreen from './FormActivityScreen';
import FormActivityDetailScreen from './FormActivityDetailScreen';

import BlogScreen from './BlogScreen';
import BlogDetailScreen from './BlogDetailScreen';
import BlogAddScreen from './BlogAddScreen';

import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

export const Stack = createStackNavigator();

export const HomeStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#FFEBA4' },
                headerBackTitle: '返回',
            }}
        >
            <Stack.Screen name="里民資訊平台-首頁" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="線上投票" component={HomePollScreen} />
            <Stack.Screen name="線上投票詳細內容" component={HomePollDetailScreen} />
            <Stack.Screen name="工務修繕提報" component={FormScreenRepair} />
            <Stack.Screen name="活動報名表單" component={FormActivityScreen} />
            <Stack.Screen name="活動詳細內容" component={FormActivityDetailScreen} />
        </Stack.Navigator>
    );
}

export const ProfileStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#FFEBA4' },
                headerBackTitle: '返回',
            }}
        >
            <Stack.Screen name="個人畫面_ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="修繕狀況" component={ProfileDetailScreen} />
            <Stack.Screen name="活動" component={ProfileActivityScreen} />
            <Stack.Screen name="投票" component={ProfilePollScreen} />
            <Stack.Screen name="看板" component={ProfileBlogArticleScreen} />
            <Stack.Screen name="我的收藏" component={ProfileBlogScreen} />
            <Stack.Screen name="文章" component={ProfileBlogDetailScreen} />
            <Stack.Screen name="收藏文章" component={ProfileBlogCollectedScreen} />
            <Stack.Screen name="修繕狀況詳細內容" component={ProfileFixDetailScreen} />
            <Stack.Screen name="報名狀況" component={ProfileActivityDetailScreen} />
            <Stack.Screen name="更新文章" component={BlogUpdateScreen} />
        </Stack.Navigator>
    );
}

// export const FormStack = () => {
//     return (
//         <Stack.Navigator>
//             <Stack.Screen name="FormScreen" component={FormScreen} />
//         </Stack.Navigator>
//     );
// }

export const BlogStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='BlogScreen'
            screenOptions={{
                headerStyle: { backgroundColor: '#FFEBA4' },
                headerBackTitle: '返回',
            }}
        >
            <Stack.Screen name="BlogScreen" component={BlogScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BlogDetailScreen" component={BlogDetailScreen} options={{ title: '文章' }} />
            <Stack.Screen name="BlogAddScreen" component={BlogAddScreen}
                options={{
                    title: '發文',
                }} />
        </Stack.Navigator>
    );
}

export const LoginStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='LoginScreen'
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        </Stack.Navigator>
    );
}