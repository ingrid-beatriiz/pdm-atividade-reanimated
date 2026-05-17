import DraggableItem from "@/components/DraggableItem";
import { useState, useRef } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function GostoNaoGosto() {
  const items = [
    "Maçã", 
    "Banana", 
    "Laranja", 
    "Uva", 
    "Abacate", 
    "Pera", 
    "Java 17", 
    "Spring Boot", 
    "Arquitetura Hexagonal", 
    "React", 
    "Node.js", 
    "Sequelize", 
    "Bugs", 
    "Deploy na Sexta"];
  
  // Estados para armazenar as coordenadas de cada zona
  const [gostoBounds, setGostoBounds] = useState(null);
  const [naoGostoBounds, setNaoGostoBounds] = useState(null);
  
  // Referências para acessar os elementos visuais
  const gostoRef = useRef(null);
  const naoGostoRef = useRef(null);

  // Função que captura as medidas exatas da tela
  const measureZones = () => {
    if (gostoRef.current) {
      gostoRef.current.measure((x, y, width, height, pageX, pageY) => {
        setGostoBounds({
          left: pageX,
          right: pageX + width,
          top: pageY,
          bottom: pageY + height,
          centerX: pageX + width / 2,
          centerY: pageY + height / 2,
        });
      });
    }
    if (naoGostoRef.current) {
      naoGostoRef.current.measure((x, y, width, height, pageX, pageY) => {
        setNaoGostoBounds({
          left: pageX,
          right: pageX + width,
          top: pageY,
          bottom: pageY + height,
          centerX: pageX + width / 2,
          centerY: pageY + height / 2,
        });
      });
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Arraste para Gosto ou Não Gosto</Text>

        {/* Área de itens arrastáveis */}
        <View style={styles.dragArea}>
          {items.map((item, index) => (
            <DraggableItem 
              key={index} 
              item={item} 
              gostoBounds={gostoBounds} 
              naoGostoBounds={naoGostoBounds} 
            />
          ))}
        </View>

        <View style={styles.dropZones} onLayout={measureZones}>
          <View ref={gostoRef} style={styles.dropZone}>
            <Text style={styles.zoneTitle}>👍 Gosto</Text>
          </View>
          <View ref={naoGostoRef} style={[styles.dropZone, { backgroundColor: "#FFE66D" }]}>
            <Text style={styles.zoneTitle}>👎 Não Gosto</Text>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  safeArea: { flex: 1 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginVertical: 20, color: "#333" },
  dragArea: 
  { flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-around", 
    paddingHorizontal: 40, 
    marginBottom: 40 , 
    zIndex: 10, 
    elevation: 10},
  dropZones: { flex: 1, flexDirection: "row", paddingHorizontal: 20 },
  dropZone: { flex: 1, marginHorizontal: 10, backgroundColor: "#A8E6CF", borderRadius: 20, justifyContent: "center", alignItems: "center", minHeight: 150, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  zoneTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
});