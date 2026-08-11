import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { I_onboardingData } from "../onboarding-types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { RefObject } from "react";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const OnboardingNav = ({
  currentIndex,
  flatListRef,
  slides,
  scrollX,
}: {
  currentIndex: number;
  flatListRef: RefObject<FlatList<any> | null>;
  slides: I_onboardingData[];
  scrollX: Animated.Value;
}) => {
  const router = useRouter();

  const isLastIndex = currentIndex === slides.length - 1;
  const isFirstIndex = currentIndex === 0;

  const handleNext = () => {
    if (isLastIndex) {
      router.replace("/login");
      return;
    }
    if (currentIndex < slides.length - 1)
      flatListRef?.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
  };

  const handlePrevious = () => {
    if (currentIndex > 0)
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePrevious}
        accessibilityLabel="Move to the previous onboarding screen"
        style={({ pressed }) => [
          {
            transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
            backgroundColor: isFirstIndex
              ? "transparent"
              : "rgba(255,255,255,0.2)",
          },
          styles.button,
        ]}
        role="button"
        disabled={isFirstIndex}
      >
        <AntDesign
          name="left"
          size={24}
          color={isFirstIndex ? "transparent" : colors.white}
        />
      </Pressable>

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 24, 10],
            extrapolate: "clamp",
          });

          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: [
              "rgba(255,255,255,0.4)",
              colors.white,
              "rgba(255,255,255,0.4)",
            ],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  backgroundColor: dotColor,
                },
              ]}
            />
          );
        })}
      </View>

      <Pressable
        onPress={handleNext}
        accessibilityLabel="Move to the next onboarding screen"
        style={({ pressed }) => [
          {
            transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
            backgroundColor: colors.white,
          },
          styles.button,
        ]}
        role="button"
      >
        {isLastIndex ? (
          <MaterialIcons name="done" size={28} color={colors.primary} />
        ) : (
          <AntDesign name="right" size={24} color={colors.primary} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginTop: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OnboardingNav;
