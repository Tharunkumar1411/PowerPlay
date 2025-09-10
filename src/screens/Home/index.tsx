import React, {useEffect, useCallback, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';

import Header from '../../components/Header';
import RepoCard, {Repo} from '../../components/RepoCard';
import {getSeachRepo} from '../../api/home';
import useDebounce from '../../utils/debounce';

const Home = (): React.JSX.Element => {
  const [repoList, setRepoList] = useState<Repo[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [searchText, setSearchText] = useState('');

  const debounced = useDebounce(searchText, 500);

  useEffect(() => {
    if (isEnabled) return;

    const q = debounced?.trim();
    if (!q) {
      setRepoList([]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await getSeachRepo(q);
        if (!cancelled) setRepoList(res);
      } catch (e) {
        if (!cancelled) console.log('Search error', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debounced, isEnabled]);

  useEffect(() => {
    if (!isEnabled) return;

    (async () => {
      const raw = await AsyncStorage.getItem('bookmarkedRepos');
      setRepoList(raw ? JSON.parse(raw) : []);
    })();
  }, [isEnabled]);

  const toggleSwitch = () => setIsEnabled(v => !v);

  const renderItem = useCallback(
    ({item}: {item: Repo}) => (
      <RepoCard data={item} isEnabled={isEnabled} setRepoList={setRepoList} />
    ),
    [isEnabled],
  );

  return (
    <SafeAreaView style={styles.rootContainer}>
      <Header />
      <View style={styles.container}>
        <Text style={styles.welcomeTxt}>Repo ({repoList.length})</Text>
        <View style={styles.toogleContainer}>
          <Text>Book marked repos</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>

      {!isEnabled && (
        <View>
          <TextInput
            placeholder='Search Repo (eg: "react")'
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
            placeholderTextColor="#999"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      )}

      <FlatList
        data={repoList}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  rootContainer: {flex: 1},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  welcomeTxt: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  toogleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 10,
  },
  input: {
    color: '#000',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
});
