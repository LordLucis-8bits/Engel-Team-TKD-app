import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const cards = [
  { id: 1, titulo: "Alunos", icone: "👥", cor: "#1E90FF", rota: "/admin/alunos" }, 
  { id: 2, titulo: "Aulas", icone: "🥋", cor: "#FF9800", rota: "/admin/aulas" },
  { id: 3, titulo: "Estatísticas", icone: "📊", cor: "#00C853", rota: "/admin/estatisticas" },
  { id: 4, titulo: "Presenças", icone: "✅", cor: "#9C27B0", rota: "/admin/presencas" },
];

export default function AdminHomeScreen() {
  const router = useRouter();

  const handlerSair = async () => {
    await AsyncStorage.clear();
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.header}>
        <Image source={'../../assets/logo.png'} style={styles.logo}/>

        <Text style={styles.titulo}>Engel Team TKD</Text>
        <Text style={styles.subtitulo}>Painel Administrativo</Text>
      </View>

      <View style={styles.grade}>
        {cards.map((card) => (
          <TouchableOpacity 
          key={card.id} 
          style={[styles.card, { borderColor: card.cor }]}
          onPress={() => router.push(card.rota)}>

          <Text style={styles.icone}>{card.icone}</Text>
          <Text style={[styles.cardTitulo, { color: card.cor }]}>{card.titulo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.botaoSair} onPress={handleSair}>
        <Text style={styles.botaoSairTexto}>Sair</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#000", alignItems: "center", padding: 20 },
  header: { alignItems: "center", marginBottom: 30, marginTop: 20 },
  logo: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  titulo: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  subtitulo: { color: "#aaa", fontSize: 14 },
  grade: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "100%" },
  card: { width: "48%", backgroundColor: "#111", borderRadius: 16, padding: 25, alignItems: "center", marginBottom: 15, borderWidth: 1.5 },
  icone: { fontSize: 40, marginBottom: 10 },
  cardTitulo: { fontSize: 16, fontWeight: "bold" },
  botaoSair: { marginTop: 20, backgroundColor: "#FF6347", padding: 15, borderRadius: 8, width: "100%", alignItems: "center" },
  botaoSairTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
