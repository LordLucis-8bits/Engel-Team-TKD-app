import React, { useMemo, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, Modal } from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminAlunosScreen() {
  const [alunos, setAlunos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [modalVisible, setModalVisible] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState({});

  useEffect(() => {
    carregarAlunos();
  }, []);

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

  const abrirModal = (aluno) => {
    setAlunoSelecionado(aluno);
    setDadosEdicao(aluno);
    setEditando(false);
    setModalVisible(true);
  };

  const salvar = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${API_URL}/admin/${alunoSelecionado.id}`,
        dadosEdicao,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Sucesso", "Aluno atualizado");
      setModalVisible(false);
      carregarAlunos();
    } catch (err) {
      Alert.alert("Erro", "Falha ao salvar");
    }
  };

  const CampoEditavel = ({ label, campo }) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: "#888", fontSize: 12 }}>{label}</Text>
      {editando ? (
        <TextInput
          style={styles.inputEdit}
          value={dadosEdicao[campo]?.toString() || ""}
          onChangeText={(text) => setDadosEdicao({ ...dadosEdicao, [campo]: text })}
        />
      ) : (
        <Text style={styles.valor}>{alunoSelecionado?.[campo] || "-"}</Text>
      )}
    </View>
  );

  const alunosFiltrados = useMemo(() => {
    return alunos.filter(aluno => {
      const nomeMatch = aluno.nome.toLowerCase().includes(buscar.toLowerCase());
      let filtroMatch = true;
      if (filtro === "Masculino") filtroMatch = aluno.sexo === "Masculino";
      if (filtro === "Feminino") filtroMatch = aluno.sexo === "Feminino";
      if (filtro === "Faixa Preta") filtroMatch = aluno.tipoFaixa === "preta";
      if (filtro === "Faixa Colorida") filtroMatch = aluno.tipoFaixa === "colorida";
      return nomeMatch && filtroMatch;
    });
  }, [alunos, buscar, filtro]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar nome do aluno"
        placeholderTextColor="#aaa"
        value={buscar}
        onChangeText={setBuscar}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
        {["Todos", "Masculino", "Feminino", "Faixa Preta", "Faixa Colorida"].map(opcao => {
          const ativo = filtro === opcao;
          const cores = {
            "Todos": "#6C757D",
            "Masculino": "#096ef1",
            "Feminino": "#E91E63",
            "Faixa Preta": "#0f0d0d",
            "Faixa Colorida": "#FF9800"
          };
          return (
            <TouchableOpacity
              key={opcao}
              onPress={() => setFiltro(opcao)}
              style={[styles.filtroModerno, { backgroundColor: ativo ? cores[opcao] : "#111", borderColor: cores[opcao] }]}
            >
              <Text style={{ color: ativo ? "#fff" : cores[opcao], fontWeight: "600", fontSize: 13 }}>
                {opcao}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView>
        {alunosFiltrados.map((aluno) => (
          <TouchableOpacity key={aluno.id} style={styles.card} onPress={() => abrirModal(aluno)}>
            <Text style={styles.nome}>{aluno.nome}</Text>
            <Text style={styles.faixa}>{aluno.faixa} — {aluno.tipoFaixa}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <ScrollView>
            <View style={styles.modal}>
              <Image
                source={
                  alunoSelecionado?.fotoUrl
                    ? { uri: alunoSelecionado.fotoUrl }
                    : require("../../assets/default-photo-user.png")
                }
                style={styles.foto}
              />
              <CampoEditavel label="Nome" campo="nome" />
              <CampoEditavel label="Email" campo="email" />
              <CampoEditavel label="Sexo" campo="sexo" />
              <CampoEditavel label="Faixa" campo="faixa" />
              <CampoEditavel label="Categoria" campo="categoria" />
              <CampoEditavel label="Altura" campo="altura" />
              <CampoEditavel label="Cidade" campo="cidade" />
              <CampoEditavel label="Estado" campo="estado" />

              <View style={{ marginTop: 20 }}>
                {editando ? (
                  <TouchableOpacity style={styles.salvar} onPress={salvar}>
                    <Text style={styles.btnText}>Salvar</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.editar} onPress={() => setEditando(true)}>
                    <Text style={styles.btnText}>Editar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.fechar} onPress={() => setModalVisible(false)}>
                  <Text style={styles.btnText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#000" },
  searchInput: { borderBottomWidth: 1, borderColor: "#333", marginBottom: 10, color: "#fff", paddingVertical: 8 },
  filtroModerno: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 25, borderWidth: 1.5, marginRight: 10 },
  card: { padding: 15, borderBottomWidth: 1, borderColor: "#222" },
  nome: { fontWeight: "bold", color: "#fff" },
  faixa: { color: "#aaa", fontSize: 13 },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center" },
  modal: { backgroundColor: "#111", margin: 20, borderRadius: 12, padding: 20 },
  foto: { width: 120, height: 150, alignSelf: "center", marginBottom: 20, borderRadius: 8 },
  valor: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  inputEdit: { borderBottomWidth: 1, borderColor: "#1E90FF", fontSize: 16, paddingVertical: 4, color: "#fff" },
  editar: { backgroundColor: "#1E90FF", padding: 12, borderRadius: 8 },
  salvar: { backgroundColor: "#00C853", padding: 12, borderRadius: 8 },
  fechar: { backgroundColor: "#555", padding: 12, borderRadius: 8, marginTop: 10 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" }
});