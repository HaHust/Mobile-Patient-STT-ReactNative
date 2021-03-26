import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  Image,
  StatusBar
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { AuthContext } from './navigations/AuthContext'

import Welcome from './screens/Welcome'
import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
import Loading from './screens/Loading'
import Option from './screens/Option'
import { TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('./assets/pictures/back.png')}
    />
  );
}

function HomeStack({navigation}) {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Dash" component={Dashboard}
        options={stylesHeaderBarDash(navigation)}
      />
    </Stack.Navigator>
  )
}
function OptionStack() {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Option" component={Option}
        options={stylesHeaderBarOption}
      />
    </Stack.Navigator>
  )
}

function BottomTabHome() {
  return (
    <Tab.Navigator
      screenOptions={stylesNavigation}
      tabBarOptions={{
        activeTintColor: '#0AC4BA',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Dash" component={HomeStack} options={{title:'Trang chủ'}}/>
      <Tab.Screen name="Option" component={OptionStack} options={{title:'Tùy chọn'}}/>
    </Tab.Navigator>
  )
}


function DrawerTab() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Dash" component={BottomTabHome} options={{title:'Trang chủ'}}/>
      <Drawer.Screen name="Option" component={OptionStack}options={{title:'Tùy chọn'}}/>
    </Drawer.Navigator>
  )
}







const App = () => {
  const [user, setUser] = useState(false)
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        {user ?
          (
            <DrawerTab />
          ) :
          (
            <Stack.Navigator >
              <Stack.Screen
                options={{ headerShown: false }}
                name="home"
                component={Welcome} />
              <Stack.Screen
                options={{
                  headerBackImage: () => (<Image style={{ width: 30, height: 30 }} source={require('./assets/pictures/back.png')} />),
                  headerStyle: { elevation: 0, borderBottomColor: '#FFF', height: 75 },
                  headerTitle: false,
                  headerLeftContainerStyle: {
                    alignContent: 'center',
                    marginLeft: 15,
                    marginTop: 20,
                  }
                }}
                name="Login"
                component={Login} />
              <Stack.Screen
                options={{ headerShown: false }}
                name="loading"
                component={Loading} />
            </Stack.Navigator >)
        }
      </NavigationContainer>
    </AuthContext.Provider >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});
const stylesNavigation = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;
    if (route.name == "Dash") {
      iconName = focused
        ? 'shield-home'
        : 'shield-home-outline';
    } else if (route.name == "Option") {
      iconName = focused ? 'gamepad-circle' : 'gamepad-circle-outline';
    }
    return <MCIcons name={iconName} size={size} color={color} />;
  },
})
const stylesHeaderBarOption = {
  title: 'Tùy chọn',
  headerStyle: {
    backgroundColor:'#0AC4BA'
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerTitleAlign: 'center'
}

const stylesHeaderBarDash = (navigation)=>({
  title: 'Trang chủ',
  headerStyle: {
    backgroundColor: '#0AC4BA',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    color:'#fff'
  },
  headerTitleAlign: 'center',
  headerRightContainerStyle:{marginRight:15},
  headerRight: () => (
    <TouchableOpacity>
      <MCIcons name={'account-search-outline'} size={30} color={'#fff'}/>
    </TouchableOpacity>
  ),
  headerLeftContainerStyle:{marginLeft:15},
  headerLeft: () => (
    <TouchableOpacity onPress={()=>navigation.openDrawer()}>
      <MCIcons name={'gesture-swipe-right'} size={30} color={'#fff'}/>
    </TouchableOpacity>
  ),
})
export default App;
