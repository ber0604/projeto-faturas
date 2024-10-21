import fs from 'fs';
import pdfParse from 'pdf-parse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function processFatura(filePath: string) {
    try {
        return await extractDataFromPDF(filePath);
    } catch (error) {
        throw new Error(`Erro ao processar o PDF: ${error}`);
    }
}

async function extractDataFromPDF(filePath: string) {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    const faturaDados = extrairFatura(text);
    const energiaDados = extrairEnergiaDados(text);

    return saveFaturaData(faturaDados, energiaDados, filePath);
}

function extrairFatura(texto: string): { cliente: string | null, instalacao: string | null, mesReferencia: string | null, dataVencimento: string | null, valorFatura: string | null } {
    const linhas = texto.split('\n').map(linha => linha.trim());
    
    let cliente = null, instalacao = null, mesReferencia = null, dataVencimento = null, valorFatura = null;
  
    for (const [i, linha] of linhas.entries()) {
        if (linha.includes('Nº DO CLIENTE') && linhas[i + 1]) {
            const [clienteTemp, instalacaoTemp] = linhas[i + 1].split(/\s+/);
            cliente = clienteTemp || null;
            instalacao = instalacaoTemp || null;
        } else if (linha.includes('Vencimento') && linhas[i + 1]) {
            const [mesTemp, vencTemp, valorTemp] = linhas[i + 1].split(/\s+/);
            mesReferencia = mesTemp || null;
            dataVencimento = vencTemp || null;
            valorFatura = valorTemp || null;
        }
    }
  
    return { cliente, instalacao, mesReferencia, dataVencimento, valorFatura };
}

function extrairEnergiaDados(texto: string): Array<{ tipo: string, quantidade: string | null, valor: string | null }> {
    const linhas = texto.split('\n').map(linha => linha.trim());
    const dadosEnergia: Array<{ tipo: string, quantidade: string | null, valor: string | null }> = [];
  
    const tiposDeEnergia = new Set([
        'Energia Elétrica',
        'Energia SCEE s/ ICMS',
        'Energia compensada GD I',
        'Contrib Ilum Publica Municipal'
    ]);
  
    for (const linha of linhas) {
        const tipoEncontrado = [...tiposDeEnergia].find(tipo => linha.startsWith(tipo));
        if (tipoEncontrado) {
            const partes = linha.split(/\s+/);
            let quantidade = null, valor = null;
  
            switch (tipoEncontrado) {
                case 'Contrib Ilum Publica Municipal':
                    valor = partes.at(-1) || null;
                    break;
                case 'Energia SCEE s/ ICMS':
                case 'Energia compensada GD I':
                    quantidade = partes[4] || null;
                    valor = partes.at(-2) || null;
                    break;
                default:
                    quantidade = partes[2] || null;
                    valor = partes.at(-2) || null;
                    break;
            }
  
            dadosEnergia.push({ tipo: tipoEncontrado, quantidade, valor });
        }
    }
  
    return dadosEnergia;
}

interface FaturaEnergia {
    tipo: string;
    quantidade: string | null;
    valor: string | null;
}

async function saveFaturaData(faturaDados: any, faturaEnergiaDados: FaturaEnergia[], filePath : string) {
    const parseToFloat = (value: string | null): number | null => {
        return value ? parseFloat(value.replace(',', '.')) : null;
    };

    let energiaQuantidadeKwh: number | null = null;
    let energiaValor: number | null = null;
    let energiaSceeSemIcms: number | null = null;
    let energiaSceeSemIcmsValor: number | null = null;
    let energiaCompensadaGD: number | null = null;
    let energiaCompensadaGDValor: number | null = null;
    let contribuicaoIlumPublica: number | null = null;

    faturaEnergiaDados.forEach((item: FaturaEnergia) => {
        switch (item.tipo) {
            case 'Energia Elétrica':
                energiaQuantidadeKwh = item.quantidade ? parseInt(item.quantidade) : null;
                energiaValor = parseToFloat(item.valor);
                break;
            case 'Energia SCEE s/ ICMS':
                energiaSceeSemIcms = item.quantidade ? parseInt(item.quantidade) : null;
                energiaSceeSemIcmsValor = parseToFloat(item.valor);
                break;
            case 'Energia compensada GD I':
                energiaCompensadaGD = item.quantidade ? parseInt(item.quantidade) : null;
                energiaCompensadaGDValor = parseToFloat(item.valor);
                break;
            case 'Contrib Ilum Publica Municipal':
                contribuicaoIlumPublica = parseToFloat(item.valor);
        }
    });

    const registroExistente = await prisma.fatura.findFirst({
        where: {
            numeroCliente: faturaDados.cliente,
            mesReferencia: faturaDados.mesReferencia,
        },
    });

    if (registroExistente) {
        throw new Error(`Já existe um registro para o cliente ${faturaDados.cliente} no mês de referência ${faturaDados.mesReferencia}.`);
    }

    const fatura = await prisma.fatura.create({
        data: {
            numeroCliente: faturaDados.cliente,
            mesReferencia: faturaDados.mesReferencia,
            fileName: filePath.split('/')[1],
            dataVencimento: transformarParaDateTime(faturaDados.dataVencimento) || new Date(),
            valorFatura: parseToFloat(faturaDados.valorFatura) || 0,
            energiaQuantidadeKwh: energiaQuantidadeKwh ?? 0,
            energiaValor: energiaValor ?? 0,
            energiaSceeSemIcms: energiaSceeSemIcms ?? 0,
            energiaSceeSemIcmsValor: energiaSceeSemIcmsValor ?? 0,
            energiaCompensadaGD: energiaCompensadaGD ?? 0,
            energiaCompensadaGDValor: energiaCompensadaGDValor ?? 0,
            contribuicaoIlumPublica: contribuicaoIlumPublica ?? 0,
        },
    });

    return fatura;
}

function transformarParaDateTime(dataString: string): Date | null {
    const partes = dataString.split('/');
    if (partes.length !== 3) {
      console.error('Formato de data inválido. Use "dd/mm/aaaa".');
      return null;
    }
  
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const ano = parseInt(partes[2], 10);
  
    const data = new Date(ano, mes, dia);
  
    if (isNaN(data.getTime())) {
      console.error('Data inválida.');
      return null;
    }
  
    return data;
}