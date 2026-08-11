import { Animated, Dimensions, FlatList, StyleSheet, View } from "react-native";
import { useRef, useState } from "react";

import OnboardingItem from "../components/OnboardingItem";
import OnboardingNav from "../components/OnboardingNav";
import { colors } from "@/theme/colors";
import { slides } from "../data/slides";

const { width } = Dimensions.get("window");

const Onboarding = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={slides}
        ref={flatListRef}
        horizontal
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OnboardingItem item={item} width={width} />}
      />

      <OnboardingNav
        currentIndex={currentIndex}
        flatListRef={flatListRef}
        slides={slides}
        scrollX={scrollX}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: 80,
    paddingBottom: 60,
  },
});

export default Onboarding;
