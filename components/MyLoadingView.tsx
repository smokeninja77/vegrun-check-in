import { Dimensions, View, Animated, StyleSheet, Easing, Text } from "react-native";
import CloudSvg from "@/assets/images/cloud.svg";
import SunSvg from "@/assets/images/sun.svg";
import { useEffect, useRef } from "react";
import * as React from "react";
import LottieView from "lottie-react-native";

const MyLoadingView = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  };

  useEffect(() => {
    startRotation();
  }, []);

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const animatedStyle = {
    transform: [{ rotate: rotationInterpolate }],
  };

  return (
    <>
      <View style={styles.loadingContainer}>
        <View style={{flex:1, alignItems: 'center' }}>
          <LottieView
              source={require('@/assets/lottie.json')}
              autoPlay
              loop
              style={{width: 350, height: 300, backgroundColor: 'transparent'}}
          />
          <Text style={{fontSize: 16, fontWeight: 'semi', marginTop: -75, marginLeft: 3, color: '#fff'}}>...</Text>
        </View>
      </View>
    </>
  );
};

export default MyLoadingView;

const styles = StyleSheet.create({
  loadingContainer: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    position: "absolute",
    zIndex: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  sunWrap: {
    justifyContent: "center",
  },
});
