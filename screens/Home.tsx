//@ts-nocheck

import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Appbar, Chip, Button, ProgressBar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import CardItem from '../components/CardItem';
import { ComponentNavigationProps } from '../utils/types';
import { MD3Colors } from 'react-native-paper';

const categories = ["Technology", "Sports", "Politics", "Health", "Business"];
const API_KEY = "pub_246457783564a954467c0ea9699375febdfeb";
const Home = (props: ComponentNavigationProps) => {
  const theme = useTheme();
  const [nextPage, setNextPage] = useState("")
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const handleSelect = (val: string) => {
    setSelectedCategories((prev: string[]) => prev.find(p => p === val) ? prev.filter((cat) => cat !== val) : [...prev, val]);
  };
  const handlePress = async () => {
    const URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en${selectedCategories.length > 0 ?
      `&category=${selectedCategories.join()}` : ""}${nextPage?.length > 0 ? `&page=${nextPage}` : ""}`;

    try {
      setIsLoading(true)
      await fetch(URL).then((res) => res.json()).then((data) => {
        setNewsData((prev) => [...prev, ...data.results]);
        setNextPage(data.nextPage);
      });
      setIsLoading(false);
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Home"></Appbar.Content>
      </Appbar.Header>
      <View style={styles.filtersContainer}>
        {categories.map((cat) => (
          <Chip key={cat} mode="outlined" style={styles.chipItem} textStyle={{ fontWeight: "400", color: "white", padding: 1 }}
            showSelectedOverlay
            selected={selectedCategories.find((c) => cat === c) ? true : false}
            onPress={() => handleSelect(cat)}
          >
            {cat}
          </Chip>
        ))}
        <Button mode="elevated" style={styles.button}
          labelStyle={{ fontSize: 14, margin: "auto", color: theme.colors.error }}
          icon={"sync"}
          onPress={handlePress}>Refresh</Button>
      </View>
      <ProgressBar visible={isLoading} indeterminate color={MD3Colors.error50} />
      <FlatList
        keyExtractor={(item) => item.title}
        onEndReached={() => handlePress()}
        style={styles.flatList}
        data={newsData}
        renderItem={({ item }) => (
          <CardItem
            content={item.content}
            navigation={props.navigation}
            description={item.description}
            image_url={item.image_url}
            title={item.title}
          />
        )}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: "wrap",
    marginVertical: 10,
  },
  chipItem: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  button: {
    maxWidth: 400,
    padding: 0,
    maxHeight: 40,
  },
  flatList: {
    flex: 1,
    height: "auto",
  }
})