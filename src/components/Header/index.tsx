import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Header = (): React.JSX.Element => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTxt}>PowerPlay</Text>
      <View style={styles.profile}>
        <Text style={styles.profileTxt}>P</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#75a0e6',
    color: '#fff',
  },
  headerTxt: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  profile: {
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTxt: {
    color: '#75a0e6',
    fontWeight: '600',
    fontSize: 16,
  },
});
