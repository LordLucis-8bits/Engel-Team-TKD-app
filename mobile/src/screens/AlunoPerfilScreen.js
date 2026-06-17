import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from '@env';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function AlunoPerfilScreen() {
    const [aluno, setAluno] = useState(null);
    const [editando, setEditando] = useState(false);
    const [dadosEditados, setDadosEditados] = useState({});
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    const router = useRouter();

    //================= BUSCAR DADOS =================
    useEffect(() => {

        const buscarDados = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const id = await AsyncStorage.getItem('id');

                if (!token || !id) {
                    Alert.alert("Erro", "Usuário não autenticado.");
                    router.replace('/');
                    return;
                }

                const response = await axios.get(`${API_URL}/alunos/perfil/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const dados = { ...response.data };

                if (dados.dataNascimento) {
                    dados.dataNascimento = dados.dataNascimento.split('T')[0];
                }
                setAluno(dados);
                setDadosEditados(dados);

            } catch (err) {
                Alert.alert("Erro", "Não foi possível carregar os dados.");
                console.log("Erro ao buscar perfil:", err);
            }
        };
        buscarDados();

    }, []);

    //================= EDITAR =================
    const handleEditar = () => setEditando(true);

    const handleChange = (field, value) => {
        setDadosEditados(prev => ({ ...prev, [field]: value }));
    };

    //================= SALVAR =================
    const handleSalvar = async () => {

        const camposPermitidos = Object.fromEntries(
            Object.entries(dadosEditados).filter(
                ([campo]) => !['id', 'senha'].includes(campo)
            )
        );

        try {

            const token = await AsyncStorage.getItem('token');
            const id = await AsyncStorage.getItem('id');

            let data = camposPermitidos;
            let headers = { Authorization: `Bearer ${token}` };

            //Upload de imagem
            if (selectedImageUri) {

                const formData = new FormData();

                Object.keys(camposPermitidos).forEach(key => {
                    formData.append(key, camposPermitidos[key]);
                });

                formData.append('foto', {
                    uri: selectedImageUri,
                    type: 'image/jpeg',
                    name: 'foto.jpg',
                });

                data = formData;
            }

            const response = await axios.put(
                `${API_URL}/alunos/${id}`,
                data,
                { headers }
            );

            setAluno(response.data);
            setEditando(false);
            setSelectedImageUri(null);

            Alert.alert("Sucesso", "Dados atualizados!");

        } catch (err) {
            Alert.alert("Erro", "Não foi possível atualizar.");
        }
    };

    const pickImage = async () => {

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permissão necessária');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImageUri(result.assets[0].uri);
        }
    };

    if (!aluno) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    const Campo = ({ campo, label }) => {

        const valor = dadosEditados[campo];
        const isSelect = ['faixa', 'tipoFaixa', 'categoria'].includes(campo);

        return (
            <View style={styles.campoLinha}>
                
                <Text style={styles.campoLabel}>{label}</Text>

                {editando ? (

                    isSelect ? (

                        <Picker
                            selectedValue={valor || ""}
                            style={styles.campoInput}
                            onValueChange={(value) => handleChange(campo, value)}
                        >

                            <Picker.Item label={`Selecione ${label}`} value="" />

                            {campo === 'faixa' && (
                                <>
                                    <Picker.Item label="Branca" value="Branca" />
                                    <Picker.Item label="Amarela" value="Amarela" />
                                    <Picker.Item label="Verde" value="Verde" />
                                    <Picker.Item label="Verde escura" value="Verde escura" />
                                    <Picker.Item label="Azul" value="Azul" />
                                    <Picker.Item label="Azul escura" value="Azul escura" />
                                    <Picker.Item label="Vermelha" value="Vermelha" />
                                    <Picker.Item label="Vermelha escura" value="Vermelha escura" />
                                    <Picker.Item label="Preta" value="Preta" />
                                </>
                            )}

                            {campo === 'tipoFaixa' && (
                                <>
                                    <Picker.Item label="Preta" value="Preta" />
                                    <Picker.Item label="Colorida" value="Colorida" />
                                </>
                            )}

                            {campo === 'categoria' && (
                                <>
                                    <Picker.Item label="Infantil" value="Infantil" />
                                    <Picker.Item label="Cadete" value="Cadete" />
                                    <Picker.Item label="Juvenil" value="Juvenil" />
                                    <Picker.Item label="Sub-21" value="Sub-21" />
                                    <Picker.Item label="Adulto" value="Adulto" />
                                    <Picker.Item label="Master" value="Master" />
                                </>
                            )}

                        </Picker>

                    ) : (

                        <TextInput
                            style={styles.campoInput}
                            value={valor ? String(valor) : ""}
                            onChangeText={(t) => handleChange(campo, t)}
                            keyboardType={campo === 'altura' ? 'numeric' : 'default'}
                        />

                    )

                ) : (
                    <Text style={styles.campoValor}>{valor || "-"}</Text>
                )}

            </View>
        );
    };

    return (

        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity onPress={editando ? pickImage : null}>
                    <Image
                        source={
                            selectedImageUri
                                ? { uri: selectedImageUri }
                                : aluno.fotoUrl
                                    ? { uri: aluno.fotoUrl }
                                    : require('../assets/default-photo-user.png')
                        }
                        style={styles.foto3x4}
                    />
                </TouchableOpacity>

                <Text style={styles.nomeAluno}>{aluno.nome}</Text>
                <Text style={styles.emailAluno}>{aluno.email}</Text>

            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitulo}>Dados Pessoais</Text>

                <Campo campo="email" label="Email" />
                <Campo campo="telefone" label="Telefone" />
                <Campo campo="dataNascimento" label="Data de Nascimento" />
                <Campo campo="sexo" label="Sexo" />

            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitulo}>Dados Esportivos</Text>

                <Campo campo="faixa" label="Faixa" />
                <Campo campo="tipoFaixa" label="Tipo de Faixa" />
                <Campo campo="categoria" label="Categoria" />
                <Campo campo="altura" label="Altura" />

            </View>

            {!editando ? (
                <TouchableOpacity style={styles.botaoEditar} onPress={handleEditar}>
                    <Text style={styles.textoBotao}>Editar</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
                    <Text style={styles.textoBotao}>Salvar</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.botaoSair}
                onPress={async () => {
                    await AsyncStorage.clear();
                    router.replace('/');
                }}
            >
                <Text style={styles.textoBotao}>Sair</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: { padding: 20, backgroundColor: '#000', flexGrow: 1, alignItems: 'center' },
    header: { alignItems: 'center', marginBottom: 25 },
    foto3x4: { width: 100, height: 133, borderRadius: 10, marginBottom: 20, backgroundColor: '#eee' },
    nomeAluno: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    emailAluno: { color: '#aaa' },
    card: { width: '100%', backgroundColor: '#111', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#222' },
    cardTitulo: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderColor: '#333', paddingBottom: 5 },
    campoLinha: { marginBottom: 12 },
    campoLabel: { color: '#aaa', fontSize: 12 },
    campoValor: { color: '#fff', fontSize: 16, fontWeight: '500' },
    campoInput: { backgroundColor: '#222', color: '#fff', padding: 10, borderRadius: 8, marginTop: 5 },
    botaoEditar: { marginTop: 20, backgroundColor: '#1E90FF', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' },
    botaoSalvar: { marginTop: 20, backgroundColor: '#32CD32', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' },
    botaoSair: { marginTop: 10, backgroundColor: '#FF6347', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' },
    textoBotao: { color: '#fff', fontWeight: 'bold' }
});
