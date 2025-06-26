import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    Alert,
    Image, Dimensions
} from 'react-native';
import axios from 'axios';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import Feather from '@expo/vector-icons/Feather';
import MyLoadingView from "@/components/MyLoadingView";
import LottieView from "lottie-react-native";
import {ImageStyle} from "expo-image";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const SHEET_URL = 'https://sheet.best/api/sheets/7a554dfc-95ef-466a-b93c-d1a4b9bdef34';

const fetchAllSheetData = async () => {
    const res = await axios.get(SHEET_URL);
    return res.data;
};

const patchCheckIn = async (id: string) => {
    const res = await axios.patch(`${SHEET_URL}/search?Id=${encodeURIComponent(id)}`, {
        'Check in': 'Yes',
    });
    return res.data;
};

const queryClient = new QueryClient();

export default function App() {
    const {top} = useSafeAreaInsets();
    return (
        <QueryClientProvider client={queryClient}>
            <View style={{ paddingTop: top, flex: 1, backgroundColor: 'transparent' }}>
                <CheckInScreen />
            </View>
        </QueryClientProvider>
    );
}

function CheckInScreen() {
    const queryClient = useQueryClient();
    const [searchBy, setSearchBy] = useState<'英文姓名 English Name' | '中文姓名 Chinese Name' | '手機號碼 Mobile Number' | '身份证号码 New IC No'>('手機號碼 Mobile Number');
    const [searchValue, setSearchValue] = useState('');
    const [allData, setAllData] = useState<any[]>([]);
    const [resultData, setResultData] = useState<any[]>([]);
    const [isMutating, setIsMutating] = useState(false);

    const { data, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['all'],
        queryFn: fetchAllSheetData,
    });

    useEffect(() => {
        if (data) {
            setAllData(data);
        }
    }, [data]);

    useEffect(() => {
        // if (!searchValue) {
        //     setResultData([]);
        //     return;
        // }

        const filtered = allData.filter((item) => {
            const fieldValue = item[searchBy] ?? '';

            if (searchBy === '手機號碼 Mobile Number') {
                const cleanedInput = searchValue.replace(/\D/g, '');
                const cleanedField = fieldValue.replace(/\D/g, '');
                return cleanedField.includes(cleanedInput);
            }

            if (searchBy === '身份证号码 New IC No'){
                const cleanedInput = searchValue.replace(/\D/g, '');
                const cleanedField = fieldValue.replace(/\D/g, '');
                return cleanedField.includes(cleanedInput);
            }

            return fieldValue.toLowerCase().includes(searchValue.toLowerCase());
        });

        setResultData(filtered);
    }, [searchValue, searchBy, allData]);

    const mutation = useMutation({
        mutationFn: patchCheckIn,
        onMutate: () => setIsMutating(true),
        onSettled: () => setIsMutating(false),
        onSuccess: () => {
            Alert.alert('Check-in success');
            queryClient.invalidateQueries({ queryKey: ['all'] });
            setResultData([]);
            setSearchValue('');
        },
    });

    const RadioButton = ({ label }: { label: typeof searchBy }) => (
        <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20, marginBottom: 10 }}
            onPress={() => {
                setSearchValue('');
                setSearchBy(label);
            }}
        >
            <View
                style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#555',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 6,
                }}
            >
                {searchBy === label && (
                    <View
                        style={{
                            height: 10,
                            width: 10,
                            borderRadius: 5,
                            backgroundColor: '#555',
                        }}
                    />
                )}
            </View>
            <Text>{label}</Text>
        </Pressable>
    );

    const renderItem = ({ item }: any) => (
        <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center', marginBottom: 5 }}>
            <View
                style={{
                    padding: 15,
                    backgroundColor: item['Check in'] === 'Yes' ? '#d4f4dd' : '#F4D4D5',
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 6,
                    flex: 1,
                }}
            >
                <Text>ID: {item['Id']}</Text>
                <Text style={{ fontWeight: 'bold' }}>
                    {item['中文姓名 Chinese Name']} {item['英文姓名 English Name']}
                </Text>
                <Text>IC: {item['身份证号码 New IC No'] ? item['身份证号码 New IC No'] : 'NA' }</Text>
                <Text>Mobile No.: {item['手機號碼 Mobile Number']}</Text>
                <Text>Category: {item['身分別'] ? item['身分別'] : 'NA'}</Text>
                <Text>Status: {item['Check in'] || 'Not Checked'}</Text>
            </View>

            {item['Check in'] !== 'Yes' && (
                <TouchableOpacity
                    style={[styles.button, styles.checkedIn]}
                    onPress={() => {
                        if (!item['Id']) {
                            Alert.alert('Id not found');
                            return;
                        }
                        mutation.mutate(item['Id']);
                    }}
                >
                    <Feather name="check-square" size={24} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <>
            <Image source={require('@/assets/images/bg.png')} style={{
                width: Dimensions.get('screen').width,
                height: Dimensions.get('screen').height,
                position: 'absolute',
                opacity: 0.2,
            }} />
            <View style={{ padding: 20, flex: 1, backgroundColor: 'transparent' }}>
                {/* 🔘 Radio */}
                <View style={{flexDirection: 'row', marginBottom: 15}}>
                    <View style={{ marginBottom: 15, flexWrap: 'wrap'}}>
                        <RadioButton label="手機號碼 Mobile Number" />
                        <RadioButton label="英文姓名 English Name" />
                        <RadioButton label="中文姓名 Chinese Name" />
                        <RadioButton label={"身份证号码 New IC No"} />
                    </View>

                        <Image source={require('@/assets/images/carrot.png')} style={{
                            // width: 50,
                            height: '100%',
                            flex: 1
                        } as ImageStyle} />

                </View>

                {/* 🔍 Input */}
                <TextInput
                    placeholder={searchBy}
                    placeholderTextColor="#888"
                    value={searchValue}
                    onChangeText={setSearchValue}
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 10,
                        borderRadius: 6,
                        marginBottom: 15,
                        height: 60,
                        backgroundColor: 'rgba(255,255,255, 0.75)',
                    }}
                />

                <TouchableOpacity
                    onPress={() => refetch()}
                    style={{
                        backgroundColor: '#FF9800',
                        padding: 15,
                        borderRadius: 6,
                        marginBottom: 15,
                    }}
                >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                        🔄 Refresh 更新
                    </Text>
                </TouchableOpacity>

                {/* 🔘 Search Button */}
                {/*<TouchableOpacity*/}
                {/*    onPress={() => {}} // not needed anymore*/}
                {/*    style={{*/}
                {/*        backgroundColor: searchValue ? '#8CCA00' : 'grey',*/}
                {/*        padding: 15,*/}
                {/*        borderRadius: 6,*/}
                {/*        marginBottom: 15,*/}
                {/*    }}*/}
                {/*    disabled={!searchValue}*/}
                {/*>*/}
                {/*    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Search 搜索</Text>*/}
                {/*</TouchableOpacity>*/}

                {/* 📄 Results */}
                {isLoading || isFetching ? (
                    <View style={{ backgroundColor: 'transparent', height: 200, alignItems: 'center' }}>
                        <LottieView
                            source={require('@/assets/loading.json')}
                            autoPlay
                            loop
                            style={{ width: 150, height: 150 }}
                        />
                        <Text style={{ fontSize: 16, marginTop: -10, marginLeft: 15 }}>Loading...</Text>
                    </View>
                ) : (
                    <>
                    {/*<Text style={{marginBottom: 15}}>Result:</Text>*/}
                    <FlatList
                        data={resultData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />
                    </>
                )}
            </View>
            {isMutating && <MyLoadingView />}
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    checkedIn: {
        backgroundColor: '#4CAF50',
    },
});
