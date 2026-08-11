import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const useFirstLaunch = () => {
  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const isFirstLaunchFromStorage =
        await AsyncStorage.getItem("hasSeenOnboarding");

      if (!isFirstLaunchFromStorage) {
        await AsyncStorage.setItem("hasSeenOnboarding", "true");
        setLoading(false);
        setIsFirstLaunch(true);
        return;
      }

      setLoading(false);
      setIsFirstLaunch(false);
    };

    checkFirstLaunch();
  }, []);

  return { loading, isFirstLaunch };
};
