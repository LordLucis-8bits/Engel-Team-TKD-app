import React, { useMemo, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminEstatisticasScreen() {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarAlunos();
    }, []);

    const carregarAlunos = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await axios.get(`${API_URL}/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlunos(res.data);
        } catch (err) {
            Alert.alert("Erro", "Erro ao carregar dados");  
        } finally {
            setLoading(false);
        }
    };

    const totaisFaixa = useMemo(() => {
        const counts = {};
        alunos.forEach(aluno => {
            counts[aluno.faixa] = (counts[aluno.faixa] || 0) + 1;
        });
        return counts;
    }, [alunos]);

    const totaisTipoFaixas = useMemo(() => {
        const counts = {};
        alunos.forEach(aluno => {
            counts[aluno.tipoFaixa] = (counts[aluno.tipoFaixa] || 0) + 1;
        });
        return counts;
    }, [alunos]);


    const totaisSexo = useMemo(() => {
        const counts = {};
        alunos.forEach(aluno => {
            counts[aluno.sexo] = (counts[aluno.sexo] || 0) + 1;
        });
        return counts;
    }, [alunos]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#1E90FF" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            
            <Text style={styles.titulo}>Estatísticas</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitulo}>Total de Atletas: {alunos.length}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.card}>Por faixa:</Text>
                {Object.entries(totaisFaixa).map(([total, faixa]) => (
                    <View key={faixa} style={styles.linha}>
                        <Text style={styles.label}>{faixa}</Text>
                        <Text style={styles.valor}>{total}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.card}>Tipos de faixas:</Text>
                {Object.entries(totaisTipoFaixas).map(([total, tipoFaixa]) => (
                    <View key={tipoFaixa} style={styles.linha}>
                        <Text style={styles.label}>{tipoFaixa}</Text>
                        <Text style={styles.valor}>{total}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.card}>Por sexo:</Text>
                {Object.entries(totaisSexo).map(([total, sexo]) => (
                    <View key={sexo} style={styles.linha}>
                        <Text style={styles.label}>{sexo}</Text>
                        <Text style={styles.valor}>{total}</Text>
                    </View>
                ))}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#000" },
    titulo: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    card: { backgroundColor: "#111", borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: "#222" },
    cardTitulo: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 10 },
    linha: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderColor: "#222" },
    label: { color: "#aaa", fontSize: 15 },
    valor: { color: "#00C853", fontSize: 15, fontWeight: "bold" },
});

