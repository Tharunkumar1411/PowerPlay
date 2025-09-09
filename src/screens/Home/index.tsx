import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getSeachRepo} from '../../api/home';

const Home = (): React.JSX.Element => {
  const [repoList, setRepoList] = React.useState<Array<object>>([]);
  const [pagination, setPagination] = React.useState<object>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    getSeachRepo(pagination)
      .then(res => {
        setRepoList(res);
      })
      .catch(err => {
        console.log('Error', err);
      });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeTxt}>Repo's {`(${repoList?.length})`}</Text>
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {},
  welcomeTxt: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginVertical: 10,
    marginHorizontal: 10,
  },
});
