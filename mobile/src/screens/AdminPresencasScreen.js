import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView, Alert, View } from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminPresencasScreen() {
    const [aulas, setAulas] = useState([]);
    const [aulaSelecionada, setAulaSelecionada] = useState(null);
    const [alunos, setAlunos] = useState([]);

    useEffect(() => {
        carregarAulas();
    }, []);
    
    const carregarAulas = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await axios.get(`${API_URL}/aulas`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            setAulas(res.data);

        } catch (err) {
            Alert.alert("Erro", "erro ao carrega aula")
        };
    } 

    const carregarAlunos = async (aula_Id) => {
        try {  
            const token = await AsyncStorage.getItem("token");
            const res = await axios.get(`${API_URL}/aulas/${aula_Id}/alunos`, {     
                headers: { Authorization: `Bearer ${token}` } 
            });

            setAlunos(res.data);
   
        } catch (err) { 
            Alert.alert("Erro", "Erro ao carregar alunos"); 
        }   
    };

    const marcarPresenca = async (aula_Id, aluno_id, presente) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await axios.post(`${API_URL}/aulas/${aula_Id}/presencas`, 
                { aluno_id, presente },
                { headers: { Authorization: `Bearer ${token}` } }
        
            );
    
        } catch (err) {
            Alert.alert("Erro", "Erro ao marcar presença");
        }
    };

    return (
        <ScrollView style={styles.container}>
            {!aulaSelecionada ? (
                <>
                <Text style={styles.titulo}>Selecionar uma Aula!</Text>
                {aulas.map((aula) => (
                    <TouchableOpacity 
                       key={aula.id}
                       style={styles.card}
                       onPress={() => {
                           setAulaSelecionada(aula);
                           carregarAlunos(aula.id);
                        }} 
                    >
                        <Text style={styles.cardTitulo}>{aula.titulo}</Text>
                        <Text style={styles.cardInfo}>{aula.data} — {aula.horario_inicio} às {aula.horario_fim}</Text>
                        <Text style={styles.turma}>{aula.tipo_faixa}</Text>
                    </TouchableOpacity>  
                ))}
               </>
            ) : (
                <>
                 <TouchableOpacity style={styles.botaoVoltar} onPress={() => setAulaSelecionada(null)}>
                    <Text style={styles.botaoVoltarTexto}>← Voltar</Text>
                 </TouchableOpacity>

                 <Text style={styles.titulo}>{aulaSelecionada.titulo}</Text>
                 <Text style={styles.subtitulo}>{aulaSelecionada.horario_inicio} às {aulaSelecionada.horario_fim}</Text>

                 {alunos.map((aluno) => (
                    <View key={aluno.id} style={styles.alunoCard}>
                        <Text style={styles.alunoNome}>{aluno.nome}</Text>
                        <View style={styles.botoes}>
                            <TouchableOpacity 
                               style={[styles.botaoPresenca, styles.presente]}
                               onPress={() => marcarPresenca(aulaSelecionada.id, aluno.id, true)}
                            >       
                               <Text style={styles.botaoTexto}>✅</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botaoPresenca, styles.faltou]}
                                onPress={() => marcarPresenca(aulaSelecionada.id, aluno.id, false)}
                            >
                                <Text style={styles.botaoTexto}>❌</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                 ))}
              </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#000" },
    titulo: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    subtitulo: { color: "#aaa", fontSize: 14, marginBottom: 20 },
    card: { backgroundColor: "#111", borderRadius: 12, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: "#222" },
    cardTitulo: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    cardInfo: { color: "#aaa", fontSize: 13, marginTop: 3 },
    turma: { color: "#00C853", fontSize: 13, marginTop: 5, fontWeight: "bold" },
    botaoVoltar: { marginBottom: 20 },
    botaoVoltarTexto: { color: "#1E90FF", fontSize: 16 },
    alunoCard: { backgroundColor: "#111", borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#222" },
    alunoNome: { color: "#fff", fontSize: 16 },
    botoes: { flexDirection: "row", gap: 10 },
    botaoPresenca: { padding: 8, borderRadius: 8 },
    presente: { backgroundColor: "#1a3d1a" },
    faltou: { backgroundColor: "#3d1a1a" },
    botaoTexto: { fontSize: 18 },
});