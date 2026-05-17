import { useEffect, useRef } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export function DraggableItem({ item, gostoBounds, naoGostoBounds }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const initialX = useSharedValue(0);
  const initialY = useSharedValue(0);
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
    .onBegin(() => {
      scale.value = withSpring(1.05);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      // 1. Calcula a posição atual do centro do item
      const finalX = initialX.value + event.translationX;
      const finalY = initialY.value + event.translationY;

      let snapped = false;

      // 2. Verifica colisão com a zona "Gosto"
      if (
        gostoBounds &&
        finalX > gostoBounds.left &&
        finalX < gostoBounds.right &&
        finalY > gostoBounds.top &&
        finalY < gostoBounds.bottom
      ) {
        translateX.value = withSpring(gostoBounds.centerX - initialX.value);
        translateY.value = withSpring(gostoBounds.centerY - initialY.value);
        snapped = true;
      }
      // 3. Verifica colisão com a zona "Não Gosto"
      else if (
        naoGostoBounds &&
        finalX > naoGostoBounds.left &&
        finalX < naoGostoBounds.right &&
        finalY > naoGostoBounds.top &&
        finalY < naoGostoBounds.bottom
      ) {
        translateX.value = withSpring(naoGostoBounds.centerX - initialX.value);
        translateY.value = withSpring(naoGostoBounds.centerY - initialY.value);
        snapped = true;
      }

      if (!snapped) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value }
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <View 
          ref={itemRef} 
          style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={styles.itemText}>{item}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 80,
    height: 80,
    backgroundColor: "#FF6B6B",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DraggableItem;