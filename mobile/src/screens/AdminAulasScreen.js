import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal } from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminAulasScreen() {
    const [aulas, setAulas] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [novaAula, setNovaAula] = useState({
        titulo: "",
        data: "",
        horario_inicio: "",
        horario_fim: "",
        instrutor: "",
        tipo_faixa: "",
    });

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
            Alert.alert("Erro", "Erro ao carregar aulas");
        }
    };

    const handleChange = (field, value) => {
        setNovaAula(prev => ({ ...prev, [field]: value })); 
    };

    const criarAula = async () => {
      if (!novaAula.titulo || !novaAula.data || !novaAula.horario_inicio || !novaAula.horario_fim) {      
        Alert.alert("Erro", "Preencha todos os campos obrigatórios");
        return;
      }
      
      try { 
        const token = await AsyncStorage.getItem("token"); 

        await axios.post(`${API_URL}/aulas`, novaAula, {
          headers: { Authorization: `Bearer ${token}` }
        });
           
        Alert.alert("Sucesso", "Aula criada!");

        setModalVisible(false);  
        setNovaAula({ titulo: "", data: "", horario_inicio: "", horario_fim: "", instrutor: "", tipo_faixa: "" });  
        carregarAulas();

        
      } catch (err) {  
        Alert.alert("Erro", "Falha ao criar aula");
      }
    };

    const deletarAula = async (aula_id) => {
        
      try {
        const token = await AsyncStorage.getItem("token");
            
        await axios.delete(`${API_URL}/aulas/${aula_id}`, {     
          headers: { Authorization: `Bearer ${token}` }
        });
        
        carregarAulas();

      } catch (err) {   
        Alert.alert("Erro", "Falha ao deletar aula");
      }
    };

    return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.botaoCriar} onPress={() => setModalVisible(true)}>
        <Text style={styles.botaoTexto}>+ Nova Aula</Text>
      </TouchableOpacity>

      <ScrollView>
        {aulas.map((aula) => (
          <View key={aula.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.titulo}>{aula.titulo}</Text>
              <Text style={styles.info}>{aula.data} — {aula.horario_inicio} às {aula.horario_fim}</Text>
              <Text style={styles.info}>Instrutor: {aula.instrutor || "-"}</Text>
              <Text style={styles.turma}>{aula.tipo_faixa}</Text>
            </View>
            <TouchableOpacity onPress={() => deletarAula(aula.id)}>
              <Text style={styles.deletar}>Deletar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <ScrollView>
            <View style={styles.modal}>

              <Text style={styles.modalTitulo}>Nova Aula</Text>

              <TextInput
                style={styles.input}
                placeholder="Título"
                placeholderTextColor="#aaa"
                value={novaAula.titulo}
                onChangeText={(t) => handleChange("titulo", t)}
              />

              <TextInput
                style={styles.input}
                placeholder="Data (DD-MM-YYYY)"
                placeholderTextColor="#aaa"
                value={novaAula.data}
                onChangeText={(t) => handleChange("data", t)}
              />

              <TextInput
                style={styles.input}
                placeholder="Horário início (HH:MM)"
                placeholderTextColor="#aaa"
                value={novaAula.horario_inicio}
                onChangeText={(t) => handleChange("horario_inicio", t)}
              />

              <TextInput
                style={styles.input}
                placeholder="Horário fim (HH:MM)"
                placeholderTextColor="#aaa"
                value={novaAula.horario_fim}
                onChangeText={(t) => handleChange("horario_fim", t)}
              />

              <TextInput
                style={styles.input}
                placeholder="Instrutor"
                placeholderTextColor="#aaa"
                value={novaAula.instrutor}
                onChangeText={(t) => handleChange("instrutor", t)}
              />

              <Picker
                selectedValue={novaAula.tipo_faixa}
                style={styles.picker}
                onValueChange={(v) => handleChange("tipo_faixa", v)}
              >
                <Picker.Item label="Selecione a turma" value="" />
                <Picker.Item label="Colorida" value="colorida" />
                <Picker.Item label="Preta" value="preta" />
                <Picker.Item label="Infantil" value="infantil" />
                <Picker.Item label="Aulão" value="Aulão" />
              </Picker>

              <TouchableOpacity style={styles.botaoCriar} onPress={criarAula}>
                <Text style={styles.botaoTexto}>Criar Aula</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.botaoTexto}>Cancelar</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </View>
      </Modal>

    </View>
    );
};  

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#000" },
    botaoCriar: { backgroundColor: "#00C853", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 20 },
    botaoCancelar: { backgroundColor: "#555", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
    botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    card: { backgroundColor: "#111", borderRadius: 12, padding: 15, marginBottom: 12, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#222" },
    titulo: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    info: { color: "#aaa", fontSize: 13, marginTop: 3 },
    turma: { color: "#00C853", fontSize: 13, marginTop: 5, fontWeight: "bold" },
    deletar: { color: "#FF6347", fontWeight: "bold", fontSize: 14, padding: 5 },
    modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center" },
    modal: { backgroundColor: "#111", margin: 20, borderRadius: 12, padding: 20 },
    modalTitulo: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: { backgroundColor: "#222", color: "#fff", borderRadius: 8, padding: 12, marginBottom: 12 },
    picker: { backgroundColor: "#222", color: "#fff", marginBottom: 12 },
});