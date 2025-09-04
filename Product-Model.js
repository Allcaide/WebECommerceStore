// product.schema.js
// Este schema é simplificado, mas já preparado para crescer sem refazer tudo.
// Inclui apenas o core: identificação, variantes, preços, inventário e media.

const { Schema, model, Types } = require("mongoose");


// ---------------------------
// Subschema: Preço
// Mantém o preço atual, com suporte a promoções via compareAtAmount
// Guardar o historico de preços pode ser util, ver depois de MVP
const PriceSchema = new Schema({
currency: { type: String, default: "EUR" }, // Moeda principal
amount: { type: Number, required: true }, // Preço atual
compareAtAmount: { type: Number }, // Preço riscado (promoção)
}, { _id: false });


// ---------------------------
// Subschema: Inventário
// Guarda stock agregado, sem localização ainda (para simplificar no MVP).
// Futuro: podes expandir para inventário por armazém/loja.
const InventorySchema = new Schema({
track: { type: Boolean, default: true }, // Se deve ou não controlar stock
totalOnHand: { type: Number, default: 0 }, // Stock disponível total
safetyStock: { type: Number, default: 0 }, // Reserva mínima (evita vender até 0)
allowBackorder: { type: Boolean, default: false }, // Se permite vender sem stock
}, { _id: false });


// ---------------------------
// Subschema: Media
// Armazena imagens e vídeos associados ao produto/variante.
// MVP simples, mas já com roles (hero, gallery, thumbnail).
const MediaSchema = new Schema({
url: { type: String, required: true }, // URL da imagem/vídeo
alt: { type: String }, // Texto alternativo para acessibilidade/SEO
role: { type: String, enum: ["hero", "gallery", "thumbnail"], default: "gallery" }, // Tipo de media
order: { type: Number, default: 0 } // Ordem de apresentação
}, { _id: false });


// ---------------------------
// Subschema: Variante
// Representa uma versão específica do produto (ex: cor + tamanho).
// MVP cobre cor, tamanho, preço, inventário e media associada.
const VariantSchema = new Schema({
variantId: { type: String, required: true }, // Identificador interno da variante (ex: white-50x90)
sku: { type: String, required: true, unique: true }, // SKU único da variante
color: { type: String }, // Ex: Branco, Azul Marinho
size: { type: String }, // Ex: 50x90, Queen, XL
price: PriceSchema, // Preço da variante
inventory: InventorySchema, // Stock da variante
media: [MediaSchema], // Imagens específicas da variante
}, { _id: false });


// ---------------------------
// Schema principal: Produto
// Representa o artigo base. Pode ter variantes ou não.
// MVP cobre: identificação, descrição, categorias, variantes, media e status.
const ProductSchema = new Schema({
sku: { type: String, required: true, unique: true }, // SKU principal (produto base)
name: { type: String, required: true }, // Nome do produto (ex: "Toalha de Banho")
description: { type: String }, // Descrição curta ou longa
categories: [{ type: Types.ObjectId, ref: "Category" }], // Referência a categorias (pode crescer em hierarquias)
variants: [VariantSchema], // Lista de variantes (opcional, pode ser vazio ou organizar por cores ou tamanho)
media: [MediaSchema], // Imagens comuns do produto (ex: foto de coleção)
status: { type: String, enum: ["draft", "active", "archived"], default: "draft" }, // Estado do produto
}, {
timestamps: true // Guarda automaticamente createdAt e updatedAt
});



module.exports = model("Product", ProductSchema);
