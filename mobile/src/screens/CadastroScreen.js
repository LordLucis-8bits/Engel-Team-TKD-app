import React, { useState } from "react";
import { Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, Image, View } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { API_URL } from "@env";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleDateChange, handleHeightChange, validateHeight, validateEmail, validatePassword, validateRequiredFields } from "../utils/validationUtils";

export default function CadastroScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erroAltura, setErroAltura] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    dataNascimento: "",
    sexo: "",
    faixa: "",
    tipoFaixa: "",
    categoria: "",
    altura: "",
    foto: null,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permissão negada", "Permita acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      if(asset.mimeType && asset.mimeType !== "image/jpeg" && asset.mimeType !== "image/png") {
        Alert.alert("Formato inválido", "Apenas PNG ou JPEG.");
        return;
      }
      handleChange("foto", asset.uri);
    }
  };

  const onHeightChange = (text) => {
    const digits = handleHeightChange(text);
    handleChange("altura", digits);
    const error = validateHeight(digits);
    setErroAltura(error);
  };

  const onDateChange = (text) => {
    const formatted = handleDateChange(text);
    handleChange("dataNascimento", formatted);
  }

  const handleSubmit = async () => {

    const requiredError = validateRequiredFields(formData);
    if (requiredError) {
      Alert.alert("Erro", requiredError);
      return;
    }

    const emailError = validateEmail(formData.email);
    if (!emailError) {
      Alert.alert("Erro", "Email inválido.");
      return;
    } 

    const passwordError = validatePassword(formData.senha);
    if (passwordError) {
      Alert.alert("Erro", passwordError);
      return;
    }
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "foto") {
        data.append(key, formData[key]);
      }
    });

    if (formData.foto) {
      data.append("foto", {
        uri: formData.foto,
        name: `foto_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
    }

    try {
      const response = await axios.post(
        `${API_URL}/alunos`, data, {
          headers: { 
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      const { id, token } = response.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("id", String(id));
      router.replace('/aluno/perfil');
    
    } catch (err) {
      let errorMsg = "Não foi possível cadastrar";
      
      if (err.response?.status === 409) {
        errorMsg = "Email já cadastrado";
      } else if (err.message === "Network Error") {
        errorMsg = "Erro de conexão";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      Alert.alert("Erro", errorMsg);
      
    } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll}>

        <Image
          source={
            formData.foto
              ? { uri: formData.foto }
              : require("../../assets/default-photo-user.png")
          }
          style={styles.avatar}
        />

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Selecionar Foto</Text>
        </TouchableOpacity>

        <TextInput style={styles.input} placeholder="Nome" value={formData.nome} onChangeText={(t) => handleChange("nome", t)} />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={formData.email} onChangeText={(t) => handleChange("email", t)} />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={formData.senha} onChangeText={(t) => handleChange("senha", t)} />
        <TextInput style={styles.input} placeholder="Data de Nascimento (DD-MM-YYYY)" value={formData.dataNascimento} onChangeText={onDateChange} />

        <Picker selectedValue={formData.sexo} style={styles.input} onValueChange={(v) => handleChange("sexo", v)}>
          <Picker.Item label="Selecione o Sexo" value="" />
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Feminino" value="Feminino" />
        </Picker>
        
        <Picker
        selectedValue={formData.faixa}
        style={styles.input}
        onValueChange={(itemValue) => handleChange('faixa', itemValue)}
        >
        <Picker.Item label="Selecione a Cor da Faixa" value="" />
        <Picker.Item label="Branca" value="Branca" />
        <Picker.Item label="Amarela" value="Amarela" />
        <Picker.Item label="Verde" value="Verde" />
        <Picker.Item label="Verde escura" value="Verde escura" />
        <Picker.Item label="Azul" value="Azul" />
        <Picker.Item label="Azul escura" value="Azul escura" />
        <Picker.Item label="Vermelha" value="Vermelha" />
        <Picker.Item label="Vermelha escura" value="Vermelha escura" />
        <Picker.Item label="Preta" value="Preta" />
        </Picker>

        <Picker
        selectedValue={formData.tipoFaixa}
        style={styles.input}
        onValueChange={(itemValue) => handleChange('tipoFaixa', itemValue)}
        >
        <Picker.Item label="Selecione o Tipo de Faixa" value="" />
        <Picker.Item label="Preta" value="Preta" />
        <Picker.Item label="Colorida" value="Colorida" />
        </Picker>

        <Picker
        selectedValue={formData.categoria}
        style={styles.input}
        onValueChange={(itemValue) => handleChange('categoria', itemValue)}
        >
        <Picker.Item label="Selecione a Categoria" value="" />
        <Picker.Item label="Infantil" value="Infantil" />
        <Picker.Item label="Cadete" value="Cadete" />
        <Picker.Item label="Juvenil" value="Juvenil" />
        <Picker.Item label="Sub-21" value="Sub-21" />
        <Picker.Item label="Adulto" value="Adulto" />
        <Picker.Item label="Master" value="Master" />
        </Picker>

        <View style={[styles.alturaContainer, erroAltura && styles.inputErro]}>
          <TextInput
            style={styles.alturaInput}
            placeholder="Altura"
            keyboardType="numeric"
            value={formData.altura}
            onChangeText={onHeightChange}
          />
          <Text style={styles.alturaLabel}>cm</Text>
        </View>

        {erroAltura ? <Text style={styles.textErro}>{erroAltura}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.replace("/")}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scroll: { padding: 20, alignItems: "center" },
  input: { width: "100%", height: 50, backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 15, marginBottom: 10, borderWidth: 1, borderColor: "#ccc" },
  inputErro: { borderColor: "red" },
  button: { width: "100%", backgroundColor: "#32CD32", padding: 15, alignItems: "center", borderRadius: 8, marginTop: 10 },
  buttonDisabled: { opacity: 0.6 },
  cancelButton: { backgroundColor: "#555" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  avatar: { width: 100, height: 133, borderRadius: 10, marginBottom: 10, backgroundColor: "#eee" },
  alturaContainer: { width: "100%", flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 15, marginBottom: 5, borderWidth: 1, borderColor: "#ccc" },
  alturaInput: { flex: 1, height: 50 },
  alturaLabel: { fontWeight: "bold", color: "#555" },
  textErro: { color: "red", marginBottom: 10 }
});
