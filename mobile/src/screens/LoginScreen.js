import { useState } from "react";
import { Text, TextInput, StyleSheet, Image, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { useRouter } from "expo-router";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

    const handleLogin = async () => {
        const emailFormatado = email.trim().toLowerCase();

        if (!validarEmail(emailFormatado)) {
            Alert.alert("Erro", "Email inválido");
            return;
        }
        if (!senha) {
            Alert.alert("Erro", "Digite a senha");
            return;
        }

        setLoading(true);
        try {
            console.log(`Tentando logar em: ${API_URL}/auth/login`);
            const response = await axios.post(`${API_URL}/auth/login`, { 
            email: emailFormatado,
            senha });

            const { token, tipo, id } = response.data;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('tipo', tipo);

            if (tipo === 'aluno' && id) {
                await AsyncStorage.setItem('id', id.toString());
            }
            setEmail('');
            setSenha('');

            if (tipo === 'admin') {
                router.replace('/admin/dashboard');
            } else if (tipo === 'aluno') {
                router.replace('/aluno/perfil');
            }
        } catch (err) {
            const mensagem =  err.response?.data?.error || err.mensagem || "Erro ao conectar o servidor.";
            Alert.alert('Erro:', mensagem);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                value={senha}
                onChangeText={setSenha}
                autoCapitalize="none"
                textContentType="password"
                secureTextEntry={true}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#1E90FF" style={{ marginTop: 10 }} />
            ) : ( 
                <>
                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.cadastroButton]} onPress={() => router.push('/cadastro')}>
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>
                </>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', padding: 20 },
    logo: { width: 220, height: 220, marginBottom: 40, resizeMode: 'contain' },
    input: { width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, color: '#000' },
    button: { width: '100%', backgroundColor: '#1E90FF', padding: 15, alignItems: 'center', borderRadius: 8, marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    cadastroButton: { backgroundColor: '#32CD32' }
});
