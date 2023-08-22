import { Dimensions, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { Card, Text, Title, useTheme } from 'react-native-paper'

type Props = {
    title: string
    image_url: string
    content: string

}

const DetailsCard = (props: Props) => {
    const theme = useTheme()
    return (
        <ScrollView>
            <Text style={{ color: "black", marginVertical: 10 }} variant='headlineMedium'>{props.title}</Text>
            <Card style={{ backgroundColor: theme.colors.background }} contentStyle={{ width: Dimensions.get("window").width }}>
                {props.image_url && (<Card.Cover source={{ uri: props.image_url }}></Card.Cover>)}
                <Card.Content>
                    <Text textBreakStrategy='highQuality' variant='headlineSmall' style={{ textAlign: "left", marginVertical: 10 }}>
                        {props.content}
                    </Text>
                </Card.Content>
            </Card>
        </ScrollView>
    )
}

export default DetailsCard

const styles = StyleSheet.create({})