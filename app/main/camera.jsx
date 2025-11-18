import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Constants from 'expo-constants';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { fetchProduct, createProduct } from '../../services/products';
import '@/global.css';

const BARCODE_TYPES = [
  'codabar',
  'code39',
  'code93',
  'code128',
  'datamatrix',
  'ean8',
  'ean13',
  'itf14',
  'pdf417',
  'qr',
  'upc_a',
  'upc_e',
];

export default function QrReader() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [hasScanned, setHasScanned] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  // FORM DATA
  const [newName, setNewName] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [stock, setStock] = useState('');
  const [marca, setMarca] = useState('');
  const [imgurl, setImgurl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();

    if (Constants.appOwnership !== 'expo') {
      MediaLibrary.requestPermissionsAsync().catch(() => {});
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (hasScanned) return;

    setHasScanned(true);
    setLastScan({ type, data });

    try {
      const productData = await fetchProduct(data);
      setResult(productData);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('NOT_FOUND');
      } else {
        setError(err.message);
      }
      setResult(null);
    }

    setTimeout(() => setHasScanned(false), 1500);
  };

  const toggleCameraFacing = () =>
    setFacing((current) => (current === 'back' ? 'front' : 'back'));

  const handleCreateProduct = async () => {
    try {
      setIsCreating(true);

      const created = await createProduct({
        barcode: lastScan?.data,
        name: newName,
        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
        stock: Number(stock),
        marca,
        imgurl,
      });

      setResult(created);
      setError(null);

      setNewName('');
      setBuyPrice('');
      setSellPrice('');
      setStock('');
      setMarca('');
      setImgurl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const ProductView = ({ product }) => (
    <View className="mt-4 bg-gray-100 p-5 rounded-xl border border-gray-300">
      <Text className="text-gray-800 text-center mb-4 text-xl font-bold">
        Producto encontrado
      </Text>

      {Object.entries(product).map(([key, value]) => (
        <View className="mb-4" key={key}>
          <Text className="text-gray-700 mb-1 capitalize">{key}:</Text>
          <View className="bg-white rounded-lg px-3 py-2">
            <Text className="text-black">{String(value)}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  // ----------------------------------------
  // FORMULARIO SIN RE-RENDERS (FIX REAL)
  // ----------------------------------------

  const AddProductForm = () => {
    let _newName = newName;
    let _buyPrice = buyPrice;
    let _sellPrice = sellPrice;
    let _stock = stock;
    let _marca = marca;
    let _imgurl = imgurl;

    return (
      <View className="mt-4 bg-gray-100 p-5 rounded-xl border border-gray-300">
        <Text className="text-gray-800 text-center mb-4 text-xl font-bold">
          Producto no encontrado
        </Text>

        {/* --- Nombre --- */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Nombre:</Text>
          <TextInput
            className="bg-white rounded-lg px-3 py-2"
            defaultValue={newName}
            onChangeText={(v) => (_newName = v)}
            onEndEditing={() => setNewName(_newName)}
          />
        </View>

        {/* --- Precio compra --- */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Precio compra:</Text>
          <TextInput
            className="bg-white rounded-lg px-3 py-2"
            keyboardType="numeric"
            defaultValue={buyPrice}
            onChangeText={(v) => (_buyPrice = v)}
            onEndEditing={() => setBuyPrice(_buyPrice)}
          />
        </View>

        {/* --- Precio venta --- */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Precio venta:</Text>
          <TextInput
            className="bg-white rounded-lg px-3 py-2"
            keyboardType="numeric"
            defaultValue={sellPrice}
            onChangeText={(v) => (_sellPrice = v)}
            onEndEditing={() => setSellPrice(_sellPrice)}
          />
        </View>

        {/* --- Stock --- */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Stock:</Text>
          <TextInput
            className="bg-white rounded-lg px-3 py-2"
            keyboardType="numeric"
            defaultValue={stock}
            onChangeText={(v) => (_stock = v)}
            onEndEditing={() => setStock(_stock)}
          />
        </View>

        {/* --- Marca --- */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Marca:</Text>
          <TextInput
            className="bg-white rounded-lg px-3 py-2"
            defaultValue={marca}
            onChangeText={(v) => (_marca = v)}
            onEndEditing={() => setMarca(_marca)}
          />
        </View>

        {/* --- Imagen URL --- */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Imagen URL:</Text>
          <TextInput
            className="bg-white rounded-lg px-3 py-2"
            defaultValue={imgurl}
            onChangeText={(v) => (_imgurl = v)}
            onEndEditing={() => setImgurl(_imgurl)}
          />
        </View>

        <TouchableOpacity
          className="bg-green-600 py-3 rounded-lg mt-2"
          onPress={handleCreateProduct}
        >
          <Text className="text-white text-center font-bold text-lg">
            {isCreating ? 'Guardando...' : 'Agregar producto'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // PERMISOS
  if (!permission?.granted) {
    return (
      <View>
        <Text>No hay permisos de cámara</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Dar permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // VISTA SIN CÁMARA
  if (!showCamera) {
    return (
      <GluestackUIProvider>
        <View className="flex flex-col items-center mt-40 px-5 w-full">
          <Text className="text-xl font-bold mb-4">Lector de códigos</Text>

          <TouchableOpacity
            className="bg-blue-500 px-8 py-4 rounded-lg"
            onPress={() => setShowCamera(true)}
          >
            <Text className="text-xl font-bold text-white">Abrir cámara</Text>
          </TouchableOpacity>

          <ScrollView style={{ width: '100%', marginTop: 20, maxHeight: 525 }}>
            {result && <ProductView product={result} />}

            {error === 'NOT_FOUND' && <AddProductForm />}

            {error !== 'NOT_FOUND' && error && (
              <Text className="text-red-500 mt-5 text-center">{error}</Text>
            )}
          </ScrollView>
        </View>
      </GluestackUIProvider>
    );
  }

  // VISTA CON CÁMARA
  return (
    <GluestackUIProvider>
      <View style={{ flex: 1 }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
          autoFocus="on"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
        />

        <TouchableOpacity
          className="absolute top-20 right-5 bg-black/40 px-4 py-2 rounded-lg"
          onPress={toggleCameraFacing}
        >
          <Text className="text-white text-lg">Voltear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="absolute top-20 left-5 bg-black/40 px-4 py-2 rounded-lg"
          onPress={() => setShowCamera(false)}
        >
          <Text className="text-white text-lg">Cerrar</Text>
        </TouchableOpacity>

        <View className="absolute bottom-0 w-full bg-black/50 pt-3 pb-8 px-5">
          <ScrollView style={{ maxHeight: 300 }}>
            {lastScan && (
              <Text className="text-white text-center mb-3 text-lg">
                Código: {lastScan.data}
              </Text>
            )}

            {result && <ProductView product={result} />}

            {error === 'NOT_FOUND' && <AddProductForm />}

            {error !== 'NOT_FOUND' && error && (
              <Text className="text-red-400 mt-3 text-center">{error}</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </GluestackUIProvider>
  );
}
