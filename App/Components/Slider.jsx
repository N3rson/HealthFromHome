import React from 'react'
import { View, FlatList, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import stretching from './../../assets/images/groundstretching.jpg'
import pushup from './../../assets/images/pushup.jpg'
import situps from './../../assets/images/situps.jpg'
import lunges from './../../assets/images/stretching.jpg'
import toeTouch from './../../assets/images/toetouch.jpg'

export default function Slider() {
    const navigation = useNavigation();
    const dataList = [
        { source: stretching, id: 'AoCWVt3h8IMTwLETUhoF' },
        { source: pushup, id: 'zhnVq4nb533giQha7RAz' },
        { source: situps, id: 'xuPmVnfrcEbyIDwsyMD2' },
        { source: lunges, id: 'e1rNXuXcNpGwz1BNPCPS' }, 
        { source: toeTouch, id: 'orx2oV0arMzW98dAPC1s' }
    ];

    return (
        <View>
            <FlatList
                data={dataList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('ExerciseInfoScreen', { exerciseId: item.id })}>
                        <Image 
                            source={item.source} 
                            className="h-[180px] w-[290px] mr-3 rounded-2xl object-contain"
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}