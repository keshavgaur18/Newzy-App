import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appbar, Chip, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { ComponentNavigationProps, NewsData } from '../utils/types';
import CardItem from '../components/CardItem';


const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@newsData');
    if (value !== null) {
      // value previously stored
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
    alert("something went wrong");
    return;
  }
};
const storeData = async (value: string) => {
  const data: NewsData[] = (await getData()) || [];

  const filtered = data.filter((news) => news.title !== value);

  try {
    const jsonValue = JSON.stringify(filtered);
    await AsyncStorage.setItem('@newsData', jsonValue)
  } catch (e) {
    // saving error
    return alert("something went wrong with storing the data");
  }
};
const Saved = (props: ComponentNavigationProps) => {
  const focused = useIsFocused();
  const [savedNews, setSavedNews] = useState([]);

  const deleteHandler = async (val: string) => {
    await storeData(val);
  };
  useEffect(() => {
    getData().then((data) => setSavedNews(data)).catch((err) => alert("error occured"));
  }, [focused, deleteHandler]);


  return (
    <ScrollView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Saved"></Appbar.Content>
      </Appbar.Header>
      <FlatList
        keyExtractor={(item) => item.title}
        data={savedNews}
        renderItem={({ item }) => (
          <CardItem
            handleDelete={deleteHandler}
            content={item.content}
            navigation={props.navigation}
            description={item.description || " "}
            image_url={item.image_url}
            title={item.title}
          />
        )}
      />
      {savedNews && savedNews.length > 0 && savedNews.map((data: NewsData) => (
        <CardItem content={data.content}
          description={data.description || ""}
          image_url={data.image_url}
          navigation={props.navigation}
          title={data.title}
        //  key={data.title}
        />
      ))}
    </ScrollView>
  );
};
export default Saved;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    display: 'flex',
    flex: 1,
    height: "auto",
  }
})