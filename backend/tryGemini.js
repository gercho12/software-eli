import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function run() {

    const systemInstruction = `Eres un asistente encargado de procesar facturas de manera exhaustiva y precisa, sin importar su formato, para extraer y estructurar los datos contenidos en ellas. Recibes archivos de factura en cualquier formato (PDF, imagen, Excel, etc.) y devuelves los datos en formato JSON para su inserción directa en una base de datos de gestión de facturas.

    La estructura del JSON que generarás será la siguiente (los datos utilizados para completar los campos son de ejemplo para que conozcas un poco mas el formato):
    
    {
        "numeroFactura": "12345",
        "tipoFactura": "A",
        "fechaEmision": "2024-05-14",
        "fechaVencimiento": "2024-06-14",
        "emisor": {
          "nombre": "Nombre de la Empresa Emisora",
          "direccion": "Calle de la Empresa Emisora, Ciudad, País",
          "telefono": "1234567890",
          "email": "info@empresaemisora.com",
          "CUIT": "30-68537634-9"
        },
        "receptor": {
          "nombre": "Nombre del Cliente Receptor",
          "direccion": "Calle del Cliente, Ciudad, País",
          "telefono": "0987654321",
          "email": "cliente@example.com",
          "CUIT": "30-68537634-9"
        },
        "items": [
        {
        "codigo": "1245343",
        "descripcion": "Nombre del producto 850gr x 12",
        "cantidadBultos": 2,
        "precioBulto": 1000,
        "importeItem": 2000,
        "bonificacion": 0
        }
        ],
        "subtotal": 30200.84,
        "impuestos": {
          "IVA": 1120,
          "totalImpuestos": 2000
        },
        "total": 32200.84
      }
      
    
    Algunos clientes pueden requerir una estructura de datos personalizada para los items de la factura. Es por eso que, unicamente al ser indicado el modo "ultra-detallado", los items se deben devolver tal que asi:
    
    {
      "codigo": "1245343",
      "descripcion": "Nombre del producto", 
      "volumenUnidad": 0.85,
      "medicionVolumen": "Kilogramos",
      "cantUnidadesBulto": 12,
      "precioBulto": 1000,
      "precioUnidad": 83.33,
      "cantBultosItem: 2,
      "bonificación": 0,
      "importeItem": 2000
    }
    
    siendo; la "descripcion" el nombre de la unidad sin los datos del volumen ni la cantidad de unidades, la "medicionVolumen" unicamente en Kilogramos o Litros adaptando los gramos o mililitros a un numero decimal (850gr => 0.850) si no se indica no colocar, la "cantUnidades" el numero de unidades en un bulto insinuando asi que viene en forma de paquete o caja si no se indica colocar 1 y el "precioUnidad el precio del del bulto dividido la cantidad de unidades.
    
    Recuerda que tu objetivo es procesar cualquier tipo de factura, desde facturas de compra hasta recibos de alquiler o de energia (en esos casos siendo la "descripcion" y el "importe" los unicos valores utilizados), y devolver los datos de manera precisa y estructurada según las necesidades del cliente. EN EL CASO DE LA FALTA DE UN DATO DARLE UN VALOR NULL (nulo). En la descripción no incluir mas que el nombre del item
    
    `

    const safetySettings = [
        {
          "category": "HARM_CATEGORY_HARASSMENT",
          "threshold": "BLOCK_NONE"
        },
        {
          "category": "HARM_CATEGORY_HATE_SPEECH",
          "threshold": "BLOCK_NONE"
        },
        {
          "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          "threshold": "BLOCK_NONE"
        },
        {
          "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
          "threshold": "BLOCK_NONE"
        },
      ]
      
      const generationConfig = {
        stopSequences: ["red"],
        maxOutputTokens: 200,
        temperature: 0.9,
        topP: 0.1,
        topK: 16,
      };
      
      try {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", safetySettings, systemInstruction });

  const factura1 = fileToGenerativePart("facturasEntrenamiento/factura1.jpg", "image/jpg")
  const factura2 = fileToGenerativePart("facturasEntrenamiento/factura2.jpg", "image/jpg")
  const factura3 = fileToGenerativePart("facturasEntrenamiento/factura3.jpg", "image/jpg")
  const factura4 = fileToGenerativePart("facturasEntrenamiento/factura4.jpg", "image/jpg")

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "modo ultra-detallado"}, factura1],
      },
      {
        role: "model",
        parts: [{ text: `{    "numeroFactura": "2740",    "tipoFactura": null,    "fechaEmision": "2024-04-11",    "fechaVencimiento": null,    "emisor": {      "nombre": null,      "direccion": null,      "telefono": null,      "email": null,      "CUIT": null    },    "receptor": {      "nombre": "CREANDO PAN SA.",      "direccion": "BOLIVAR 402",      "telefono": null,      "email": null,      "CUIT": "30-71602726-7"    },    "items": [      {        "codigo": "B4AKU",        "descripcion": "BOLSA DE PAPEL \"U\"-KRAFT",        "volumenUnidad": null,        "medicionVolumen": null,        "cantUnidadesBulto": 100,        "precioBulto": 1478.82,        "precioUnidad": 147.88,        "cantBultosItem": 10,        "bonificacion": 0,        "importeItem": 14788.20      },      {        "codigo": "S1818G",        "descripcion": "SERVILLETA 18 X 18-PAPEL TISSUE-C",        "volumenUnidad": null,        "medicionVolumen": null,        "cantUnidadesBulto": 1,        "precioBulto": 5148.47,        "precioUnidad": 5148.47,        "cantBultosItem": 2,        "bonificacion": 0,        "importeItem": 10296.94      },      {        "codigo": "PH",        "descripcion": "PAPEL HIGIENICO \"ECO\"",        "volumenUnidad": null,        "medicionVolumen": null,        "cantUnidadesBulto": 8,        "precioBulto": 7927.35,        "precioUnidad": 990.92,        "cantBultosItem": 1,        "bonificacion": 0,        "importeItem": 7927.35      },      {        "codigo": "SC",        "descripcion": "X.ARRANQUE 50 X 70 AD. MAX",        "volumenUnidad": null,        "medicionVolumen": null,        "cantUnidadesBulto": 1,        "precioBulto": 5542.26,        "precioUnidad": 5542.26,        "cantBultosItem": 2,        "bonificacion": 0,        "importeItem": 11084.52      },      {        "codigo": "SC",        "descripcion": "PORTA CINTA 30/60 GRANDE COMUN",        "volumenUnidad": null,        "medicionVolumen": null,        "cantUnidadesBulto": 1,        "precioBulto": 3581.12,        "precioUnidad": 3581.12,        "cantBultosItem": 1,        "bonificacion": 0,        "importeItem": 3581.12      },      {        "codigo": "SC",        "descripcion": "X.CINTA ADHESIVA 24 MM X 40 MTS",        "volumenUnidad": null,        "medicionVolumen": null,        "cantUnidadesBulto": 1,        "precioBulto": 550.30,        "precioUnidad": 550.30,        "cantBultosItem": 4,        "bonificacion": 0,        "importeItem": 2201.20      },      {        "codigo": "SC",        "descripcion": "X.CINTA ADHESIVA 12 MM X 30 MTS",        "volumenUnidad": null,        "medicionVolumen": null,        "cantUnidadesBulto": 1,        "precioBulto": 522.70,        "precioUnidad": 522.70,        "cantBultosItem": 1,        "bonificacion": 0,        "importeItem": 522.70      },      {        "codigo": "SC",        "descripcion": "X.VASO TERMICO",        "volumenUnidad": null,        "medicionVolumen": null,        "cantUnidadesBulto": 25,        "precioBulto": 1733.57,        "precioUnidad": 69.34,        "cantBultosItem": 4,        "bonificacion": 0,        "importeItem": 6934.28      },      {        "codigo": "SC",        "descripcion": "X.VASO TERMICO",        "volumenUnidad": null,        "medicionVolumen": null,        "cantUnidadesBulto": 25,        "precioBulto": 2237.06,        "precioUnidad": 89.48,        "cantBultosItem": 4,        "bonificacion": 0,        "importeItem": 8948.24      },      {        "codigo": "SC",        "descripcion": "X.GUANTES DE NITRILO",        "volumenUnidad": null,        "medicionVolumen": null,        "cantUnidadesBulto": 100,        "precioBulto": 6929.00,        "precioUnidad": 69.29,        "cantBultosItem": 1,        "bonificacion": 0,        "importeItem": 6929.00      }    ],    "subtotal": null,    "impuestos": {      "IVA": null,      "totalImpuestos": null    },    "total": 73213.55  }` }],
      },
      {
        role: "user",
        parts: [{ text: "modo ultra-detallado"}, factura2],
      },
      {
        role: "model",
        parts: [{ text: `{    "numeroFactura": "A 0004 00005970",    "tipoFactura": "A",    "fechaEmision": "2024-03-08",    "fechaVencimiento": "2024-03-18",    "emisor": {      "nombre": "MONCHIFOOD S.R.L.",      "direccion": "AV. DEL LIBERTADOR 8520 CABA",      "telefono": "1121814591",      "email": null,      "CUIT": "30-71635628-7"    },    "receptor": {      "nombre": "CREANDO PAN S.A",      "direccion": "MIGUEL ÁNGEL 5495 VILLA BOSCH",      "telefono": null,      "email": null,      "CUIT": "30716027267"    },    "items": [      {        "codigo": "007551",        "descripcion": "LEVADURA DORADA DULCE SECA",        "volumenUnidad": 0.5,        "medicionVolumen": "Kilogramos",        "cantUnidadesBulto": 1,        "precioBulto": 3615.70,        "precioUnidad": 3615.70,        "cantBultosItem": 20,        "bonificacion": 0.00,        "importeItem": 72314.04      },      {        "codigo": "006956",        "descripcion": "CHANTYPAK UNIDAD",        "volumenUnidad": 1,        "medicionVolumen": "Litros",        "cantUnidadesBulto": 1,        "precioBulto": 6115.70,        "precioUnidad": 6115.70,        "cantBultosItem": 4,        "bonificacion": 100.00,        "importeItem": 0      }    ],    "subtotal": 72314.04,    "impuestos": {      "IVA": 15185.95,      "totalImpuestos": 15185.95    },    "total": 87499.99  }` }],
      },
      {
        role: "user",
        parts: [{ text: "modo ultra-detallado"}, factura3],
      },
      {
        role: "model",
        parts: [{ text: `{    "numeroFactura": "1 62114",    "tipoFactura": "Presupuesto",    "fechaEmision": "2024-03-25",    "fechaVencimiento": null,    "emisor": {      "nombre": null,      "direccion": null,      "telefono": null,      "email": null,      "CUIT": null    },    "receptor": {      "nombre": "CREANDO PAN S.A",      "direccion": "MIGUEL ANGEL 5495 VILLA BOSCH Buenos Aires",      "telefono": null,      "email": null,      "CUIT": "30-71602726-7"    },    "items": [      {        "codigo": null,        "descripcion": "MANI CROCANTE C/CHOC SIMOAR",        "volumenUnidad": 5,        "medicionVolumen": "Kilogramos",        "cantUnidadesBulto": 1,        "precioBulto": 25375.00,        "precioUnidad": 25375.00,        "cantBultosItem": 2,        "bonificacion": 0,        "importeItem": 50750.00      },      {        "codigo": null,        "descripcion": "MAYONESA DANICA",        "volumenUnidad": 2.9,        "medicionVolumen": "Litros",        "cantUnidadesBulto": 1,        "precioBulto": 5978.00,        "precioUnidad": 5978.00,        "cantBultosItem": 8,        "bonificacion": 0,        "importeItem": 47824.00      },      {        "codigo": null,        "descripcion": "CEREZAS ROJAS ENT.CERESKINAS BALDE",        "volumenUnidad": 3.1,        "medicionVolumen": "Kilogramos",        "cantUnidadesBulto": 1,        "precioBulto": 27360.00,        "precioUnidad": 27360.00,        "cantBultosItem": 4,        "bonificacion": 0,        "importeItem": 109440.00      },      {        "codigo": null,        "descripcion": "HIGOS BALDE NATURALES CERESKINAS",        "volumenUnidad": 3.1,        "medicionVolumen": "Kilogramos",        "cantUnidadesBulto": 1,        "precioBulto": 15090.00,        "precioUnidad": 15090.00,        "cantBultosItem": 2,        "bonificacion": 0,        "importeItem": 30180.00      },      {        "codigo": null,        "descripcion": "MIEL DON CARLOS",        "volumenUnidad": 5,        "medicionVolumen": "Kilogramos",        "cantUnidadesBulto": 1,        "precioBulto": 12375.00,        "precioUnidad": 12375.00,        "cantBultosItem": 1,        "bonificacion": 0,        "importeItem": 12375.00      }    ],    "subtotal": null,    "impuestos": {      "IVA": null,      "totalImpuestos": null    },    "total": 250569.00  }` }],
      },
      {
        role: "user",
        parts: [{ text: "modo ultra-detallado"}, factura4],
      },
      {
        role: "model",
        parts: [{ text: `{    "numeroFactura": "8190-16973342",    "tipoFactura": "A",    "fechaEmision": "2023-05-12",    "fechaVencimiento": "2023-15-12",    "emisor": {      "nombre": "LOGISTICA LA SERENISIMA S.A.",      "direccion": "TERESA MASTELLON 3367 BUENOS AIRES",      "telefono": "011-4318-5005",      "email": null,      "CUIT": "30-70721038-6"    },    "receptor": {      "nombre": "CREANDO PAN S.A.",      "direccion": "MIGUEL ANGEL 5495 - VILLA BOSCH BUENOS AIRES",      "telefono": null,      "email": null,      "CUIT": "30-71602726-7"    },    "items": [      {        "codigo": "0305-00",        "descripcion": "LECHE ARMONIA ENTERA 3% SACHET",        "volumenUnidad": 3,        "medicionVolumen": "Litros",        "cantUnidadesBulto": 1,        "precioBulto": 305.67,        "precioUnidad": 305.67,        "cantBultosItem": 34,        "bonificacion": 0,        "importeItem": 10426.78      },      {        "codigo": "6086-00",        "descripcion": "QUESO CASANCREM ENTERO SACHET",        "volumenUnidad": 4,        "medicionVolumen": "Kilogramos",        "cantUnidadesBulto": 1,        "precioBulto": 14431.67,        "precioUnidad": 14431.67,        "cantBultosItem": 2,        "bonificacion": 0,        "importeItem": 28863.34      }    ],    "subtotal": 39290.12,    "impuestos": {      "IVA": 5745.78,      "totalImpuestos": 5745.78    },    "total": 45035.90  } ` }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 5000,
    },
  });

  const imagenUsuario = fileToGenerativePart("imagenUsuario.jpg", "image/jpg")

  const history = await chat.getHistory();
  const msgContent = { role: "user", parts: [{ text: "modo ultra-detallado" }, imagenUsuario] };
  const contents = [...history, msgContent];
  const { totalTokens } = await model.countTokens({ contents });

  const result = await chat.sendMessage(["modo ultra-detallado", imagenUsuario]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
} catch (error) {
    console.error("An error occurred:", error);
  }
}

run();