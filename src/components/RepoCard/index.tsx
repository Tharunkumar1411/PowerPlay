// components/RepoList.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {Image, Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type Repo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  html_url: string;
  owner: {login: string; avatar_url: string};
};

const RepoCard = React.memo(
  ({
    data,
    isEnabled,
    setRepoList,
  }: {
    data: Repo;
    isEnabled: boolean;
    setRepoList: React.Dispatch<React.SetStateAction<Repo[]>>;
  }) => {
    const [bookmarked, setBookmarked] = React.useState(false);

    useEffect(() => {
      (async () => {
        if (!isEnabled) {
          const markedRepos = await AsyncStorage.getItem('bookmarkedRepos');
          const filter: Repo[] | undefined = JSON.parse(
            markedRepos ?? '',
          )?.filter((i: Repo) => i.id === data.id);

          if (filter && filter.length > 0) {
            setBookmarked(true);
          } else {
            setBookmarked(false);
          }
        }
      })();
    }, [data, isEnabled]);

    const onToggle = async () => {
      const markedRepos = await AsyncStorage.getItem('bookmarkedRepos');
      let updatedRepos: Array<Repo> = markedRepos
        ? JSON.parse(markedRepos)
        : [];
      if (bookmarked || isEnabled) {
        updatedRepos = updatedRepos.filter(repo => repo.id !== data.id);
      } else {
        updatedRepos.push(data);
      }
      await AsyncStorage.setItem(
        'bookmarkedRepos',
        JSON.stringify(updatedRepos),
      );
      if (isEnabled) setRepoList(updatedRepos);
      setBookmarked(!bookmarked);
    };

    return (
      <Pressable
        style={styles.card}
        onPress={() => Linking.openURL(data.html_url)}>
        <Image source={{uri: data.owner.avatar_url}} style={styles.avatar} />
        <View style={styles.cardContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {data.full_name}
          </Text>
          {!!data.description && (
            <Text style={styles.desc} numberOfLines={2}>
              {data.description}
            </Text>
          )}
          <View style={styles.metaRow}>
            {data.language ? (
              <Text style={styles.meta}>{data.language}</Text>
            ) : null}
            <Text style={styles.meta}>
              Updated {data.updated_at.slice(0, 10)}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={e => {
            e.preventDefault();
            onToggle();
          }}
          hitSlop={10}
          style={styles.bookmarkBtn}>
          <Icon
            name={bookmarked || isEnabled ? 'star' : 'star-outline'}
            size={22}
            color={bookmarked || isEnabled ? '#eab308' : '#9ca3af'}
          />
        </Pressable>
      </Pressable>
    );
  },
);

export default RepoCard;

const styles = StyleSheet.create({
  listContent: {padding: 16},
  cardContainer: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    position: 'relative',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  avatar: {width: 44, height: 44, borderRadius: 22},
  name: {fontSize: 16, fontWeight: '600', color: '#111'},
  desc: {marginTop: 2, color: '#555'},
  metaRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8},
  meta: {fontSize: 12, color: '#666'},
  bookmarkBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  emptyWrap: {flex: 1, alignItems: 'center', paddingTop: 48},
  emptyText: {color: '#777'},
});
