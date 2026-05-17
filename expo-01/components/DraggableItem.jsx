import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function DraggableItem({ item, gostoBounds, naoGostoBounds }) {

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const initialX = useSharedValue(0);
  const initialY = useSharedValue(0);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const itemRef = useRef(null);

  const updatePosition = (fx, fy, width, height, px, py) => {
    initialX.value = px + width / 2;
    initialY.value = py + height / 2;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (itemRef.current) {
        itemRef.current.measure(updatePosition);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);


  const gesture = Gesture.Pan()
    .onStart(() => {

      startX.value = translateX.value;
      startY.value = translateY.value;
      
      scale.value = withTiming(1.05, { duration: 100 });
    })
    .onUpdate((event) => {

      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd((_event) => {
  
      const visualX = initialX.value + translateX.value;
      const visualY = initialY.value + translateY.value;

      let snapped = false;

      if (
        gostoBounds &&
        visualX > gostoBounds.left &&
        visualX < gostoBounds.right &&
        visualY > gostoBounds.top &&
        visualY < gostoBounds.bottom
      ) {
        translateX.value = withSpring(gostoBounds.centerX - initialX.value);
        translateY.value = withSpring(gostoBounds.centerY - initialY.value);
        snapped = true;
      }
      else if (
        naoGostoBounds &&
        visualX > naoGostoBounds.left &&
        visualX < naoGostoBounds.right &&
        visualY > naoGostoBounds.top &&
        visualY < naoGostoBounds.bottom
      ) {
        translateX.value = withSpring(naoGostoBounds.centerX - initialX.value);
        translateY.value = withSpring(naoGostoBounds.centerY - initialY.value);
        snapped = true;
      }

      if (!snapped) {
        translateX.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(0, { duration: 300 });
      }
    })
    .onFinalize(() => {
  
      scale.value = withTiming(1, { duration: 100 });
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <View
          ref={itemRef}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.itemText}>{item}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  item: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: "#FF6B6B",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});

export default DraggableItem;