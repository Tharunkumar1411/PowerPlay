import React, {useEffect} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {getSeachRepo} from '../../api/home';
import RepoCard from '../../components/RepoCard';

import type {Repo} from '../../components/RepoCard';
import UseDebounce from '../../utils/debounce';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/Header';

const Home = (): React.JSX.Element => {
  const [repoList, setRepoList] = React.useState<Array<Repo>>([]);
  // const [pagination, setPagination] = React.useState<{
  //   page: number;
  //   limit: number;
  // }>({
  //   page: 1,
  //   limit: 10,
  // });
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [searchText, setSearchText] = React.useState<string>('');

  const debounce = UseDebounce(searchText, 500);

  useEffect(() => {
    if (debounce && !isEnabled) {
      getSeachRepo(searchText)
        .then(res => {
          setRepoList(res);
        })
        .catch(err => {
          console.log('Error', err);
        });
    }

    return () => {
      setRepoList([]);
    };
  }, [searchText, debounce, isEnabled]);

  useEffect(() => {
    (async () => {
      if (isEnabled) {
        const bookMarkedRepos = await AsyncStorage.getItem('bookmarkedRepos');
        setRepoList(bookMarkedRepos ? JSON.parse(bookMarkedRepos) : []);
      } else {
        setRepoList([]);
      }
    })();

    return () => {
      setRepoList([]);
    };
  }, [isEnabled]);

  const renderItem = React.useCallback(
    ({item}: {item: Repo}) => (
      <RepoCard data={item} isEnabled={isEnabled} setRepoList={setRepoList} />
    ),
    [isEnabled, setRepoList],
  );

  return (
    <SafeAreaView style={styles.rootContainer}>
      <ScrollView>
        <Header />
        <View style={styles.container}>
          <Text style={styles.welcomeTxt}>Repo {`(${repoList?.length})`}</Text>
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

        <View>
          <TextInput
            placeholder='Search Repo (eg: "react")'
            value={searchText}
            onChangeText={text => setSearchText(text)}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <FlatList
          data={repoList}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          onEndReachedThreshold={0.5}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;

const styles = StyleSheet.create({
  rootContainer: {flex: 1},
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
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
    display: 'flex',
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
