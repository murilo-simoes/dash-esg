export function validarCNPJ(cnpj) {
    // Remover caracteres que não são dígitos
    cnpj = cnpj.replace(/\D/g, '');

    // Verificar se o CNPJ tem 14 dígitos
    if (cnpj.length !== 14) {
        return false;
    }

    // Calcular o primeiro dígito verificador
    let soma = 0;
    let peso = 5;
    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpj.charAt(i)) * peso;
        peso--;
        if (peso === 1) {
            peso = 9;
        }
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 > 9) {
        digito1 = 0;
    }

    // Calcular o segundo dígito verificador
    soma = 0;
    peso = 6;
    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpj.charAt(i)) * peso;
        peso--;
        if (peso === 1) {
            peso = 9;
        }
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 > 9) {
        digito2 = 0;
    }

    // Verificar se os dígitos verificadores estão corretos
    if (parseInt(cnpj.charAt(12)) !== digito1 || parseInt(cnpj.charAt(13)) !== digito2) {
        return false;
    }

    return true;
}

export function validarPorcentagem(str) {
    // Remover o símbolo de porcentagem
    let valor = parseFloat(str);

    // Verificar se o valor é um número válido
    if (isNaN(valor)) {
        return false;
    }

    // Verificar se o valor está dentro do intervalo válido (0 a 100)
    if (valor < 0 || valor > 100) {
        return false;
    }

    return true;
}