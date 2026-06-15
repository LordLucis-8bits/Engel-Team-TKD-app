//Funções do campo de data de nascimento
//formata a data no formato dd-mm-yyyy, limitando a entrada a números e adicionando os hífens automaticamente 
export const handleDateChange = (text) => { 
    let digits = text.replace(/\D/g, "").slice(0, 8); 
    let day = digits.slice(0, 2); 
    let month = digits.slice(2, 4); 
    let year = digits.slice(4, 8); 

    if (month.length === 2) { 
        let m = parseInt(month); if (m > 12) month = "12"; 
        if (m === 0) month = "01"; 
    } 
    if (day.length === 2 && month.length === 2) { 
        let maxDays = getDaysInMonth(month, year || "2000"); 
        let d = parseInt(day); 
        if (d > maxDays) day = String(maxDays).padStart(2, "0"); 
        if (d === 0) day = "01"; 
    } 
    
    let formatted = day; 
    if (month) formatted += "-" + month; 
    if (year) formatted += "-" + year; 
    return formatted; 
    };

//verifica se um ano é bissexto, o que é necessário para determinar o número de dias em fevereiro
const isLeapYear = (year) => { 
    const y = parseInt(year); 
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; 
}; 

//retorna o número de dias em um mês específico, levando em consideração os anos bissextos para fevereiro
const getDaysInMonth = (month, year) => { 
    const m = parseInt(month); 
    if ([1, 3, 5, 7, 8, 10, 12].includes(m)) return 31; 
    if ([4, 6, 9, 11].includes(m)) return 30; 
    if (m === 2) return isLeapYear(year) ? 29 : 28; return 31; 
};
/////////////////////////////////////////////////////////////////////////////////////////

//Funções do campo de altura
//formata a altura, limitando a entrada a números e um máximo de 3 dígitos (para alturas entre 50cm e 250cm)
export const handleHeightChange = (text) => { 
    let digits = text.replace(/\D/g, "").slice(0, 3); 
    return digits; 
};

//valida a altura, garantindo que seja um número entre 50cm e 250cm
export const validateHeight = (altura) => { 
    if (!altura) return "Altura é obrigatória."; 
    const num = parseInt(altura, 10); 
    if (isNaN(num) || num < 50 || num > 250) { 
        return "Altura deve ser entre 50cm e 250cm."; 
    } 
    return null; 
}; 
////////////////////////////////////////////////////////////////////////////////////////

//Campos de email e senha
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (senha) => {
    if (senha.length < 6) {
        return "Senha deve ter no mínimo 6 caracteres.";
    }
    return "";
};
//////////////////////////////////////////////////////////////////////////////////////

//Validação de campos obrigatórios
export const validateRequiredFields = (formData) => {
  const requiredFields = {
    nome: "Nome",
    email: "Email",
    senha: "Senha",
    sexo: "Sexo",
    faixa: "Cor da Faixa",
    tipoFaixa: "Tipo de Faixa",
    categoria: "Categoria",
    altura: "Altura",
  };

  const isEmpty = (value) =>
    value == null || (typeof value === "string" && value.trim() === "");

  const emptyFields = Object.entries(requiredFields)
    .filter(([key]) => isEmpty(formData[key]))
    .map(([, label]) => label);

  return emptyFields.length > 0
    ? `Preencha: ${emptyFields.join(", ")}`
    : null;
};
