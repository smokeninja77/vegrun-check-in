import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'Vegrun Sentul',
    slug: 'vegrun-check-in',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/app-images/ios-app-icon.png',
    scheme: 'vegruncheckin',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.qatech.testrun',
        icon: "./assets/app-images/ios-app-icon.png",
    },
    android: {
        edgeToEdgeEnabled: true,
        package: 'com.qatech.testrun',
        adaptiveIcon: {
            foregroundImage: "./assets/app-images/android-app-icon.png",
            monochromeImage: "./assets/app-images/android-app-icon.png",
            backgroundColor: "#F5F5F2",
        },
    },
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png',
    },
    plugins: [
        'expo-router',
        [
            'expo-splash-screen',
            {
                ios: {
                    resizeMode: "cover",
                    imageWidth: 350,
                    image: "./assets/app-images/splash-icon.png",
                    backgroundColor: "#F5F5F2",
                },
                android: {
                    resizeMode: "contain",
                    imageWidth: 300,
                    image: "./assets/app-images/splash-icon.png",
                    backgroundColor: "#F5F5F2",
                },
                //dark:{}
            },
        ],
        'expo-font',
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        router: {},
        eas: {
            projectId: 'd959aa91-6560-47cf-b7e9-82e475d97e26',
        },
    },
    runtimeVersion: '1.0.0',
    updates: {
        url: 'https://u.expo.dev/d959aa91-6560-47cf-b7e9-82e475d97e26',
    },
});
