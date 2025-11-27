import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AddProductForm = ({
  newName,
  setNewName,
  buyPrice,
  setBuyPrice,
  sellPrice,
  setSellPrice,
  stock,
  setStock,
  marca,
  setMarca,
  imgurl,
  setImgurl,
  error,
  isCreating,
  onCreateProduct,
}) => {
  const buyPriceRef = useRef(null);
  const sellPriceRef = useRef(null);
  const stockRef = useRef(null);
  const marcaRef = useRef(null);
  const imgurlRef = useRef(null);

  return (
    <View className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      <View className="flex-row items-center justify-center mb-4">
        <View className="bg-orange-100 p-2 rounded-full mr-2">
          <Ionicons name="alert-circle" size={24} color="#ea580c" />
        </View>
        <Text className="text-gray-800 text-lg font-bold">
          Producto no encontrado
        </Text>
      </View>

      <Text className="text-gray-600 text-center mb-5">
        Completa los datos para agregar este producto
      </Text>

      {/* Nombre */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-1">
          Nombre <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 text-gray-900"
          placeholder="Ej: Coca Cola 600ml"
          value={newName}
          onChangeText={setNewName}
          returnKeyType="next"
          onSubmitEditing={() => buyPriceRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>

      {/* Precios en row */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <Text className="text-gray-700 font-semibold mb-1">
            Precio Compra <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            ref={buyPriceRef}
            className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 text-gray-900"
            placeholder="0.00"
            keyboardType="numeric"
            value={buyPrice}
            onChangeText={setBuyPrice}
            returnKeyType="next"
            onSubmitEditing={() => sellPriceRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>

        <View className="flex-1">
          <Text className="text-gray-700 font-semibold mb-1">
            Precio Venta <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            ref={sellPriceRef}
            className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 text-gray-900"
            placeholder="0.00"
            keyboardType="numeric"
            value={sellPrice}
            onChangeText={setSellPrice}
            returnKeyType="next"
            onSubmitEditing={() => stockRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>
      </View>

      {/* Stock y Marca en row */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <Text className="text-gray-700 font-semibold mb-1">Stock</Text>
          <TextInput
            ref={stockRef}
            className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 text-gray-900"
            placeholder="0"
            keyboardType="numeric"
            value={stock}
            onChangeText={setStock}
            returnKeyType="next"
            onSubmitEditing={() => marcaRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>

        <View className="flex-1">
          <Text className="text-gray-700 font-semibold mb-1">Marca</Text>
          <TextInput
            ref={marcaRef}
            className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 text-gray-900"
            placeholder="Ej: Coca Cola"
            value={marca}
            onChangeText={setMarca}
            returnKeyType="next"
            onSubmitEditing={() => imgurlRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>
      </View>

      {/* URL Imagen */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-1">URL Imagen</Text>
        <TextInput
          ref={imgurlRef}
          className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 text-gray-900"
          placeholder="https://..."
          value={imgurl}
          onChangeText={setImgurl}
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={onCreateProduct}
        />
      </View>

      {error && error !== "NOT_FOUND" && (
        <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <Text className="text-red-600 text-center">{error}</Text>
        </View>
      )}

      <TouchableOpacity
        className={`py-4 rounded-xl flex-row items-center justify-center ${
          isCreating ? "bg-green-400" : "bg-green-600"
        }`}
        onPress={onCreateProduct}
        disabled={isCreating}
      >
        {isCreating ? (
          <>
            <ActivityIndicator color="white" size="small" />
            <Text className="text-white font-bold text-base ml-2">
              Guardando...
            </Text>
          </>
        ) : (
          <>
            <Ionicons name="add-circle" size={20} color="white" />
            <Text className="text-white font-bold text-base ml-2">
              Agregar producto
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddProductForm;
