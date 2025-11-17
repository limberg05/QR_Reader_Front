import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { fetchProduct, createProduct } from '../../services/products';
import '@/global.css';

export default function QrReader() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [hasScanned, setHasScanned] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

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
    MediaLibrary.requestPermissionsAsync();
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

    setTimeout(() => {
      setHasScanned(false);
    }, 1500);
  };

  const toggleCameraFacing = () =>
    setFacing((current) => (current === 'back' ? 'front' : 'back'));

  // -----------------------------
  // CREAR PRODUCTO
  // -----------------------------
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

  // -----------------------------
  // COMPONENTE: PRODUCTO MOSTRADO
  // -----------------------------
  const ProductView = ({ product, darkMode }) => (
    <View
      className={
        darkMode
          ? 'mt-4 bg-white/20 p-5 rounded-xl border border-white/20'
          : 'mt-4 bg-gray-100 p-5 rounded-xl border border-gray-300'
      }
    >
      <Text
        className={
          darkMode
            ? 'text-white text-center mb-4 text-xl font-bold'
            : 'text-gray-800 text-center mb-4 text-xl font-bold'
        }
      >
        Producto encontrado
      </Text>

      {Object.entries(product).map(([key, value]) => (
        <View className="mb-4" key={key}>
          <Text
            className={
              darkMode
                ? 'text-white mb-1 capitalize'
                : 'text-gray-700 mb-1 capitalize'
            }
          >
            {key}:
          </Text>

          <View
            className={
              darkMode
                ? 'bg-white rounded-lg px-3 py-2'
                : 'bg-white rounded-lg px-3 py-2'
            }
          >
            <Text className="text-black">{String(value)}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  //-------------------------------------------------------------------
  // COMPONENTE: FORMULARIO AGREGAR PRODUCTO
  //-------------------------------------------------------------------
  const AddProductForm = ({ darkMode }) => (
    <View
      className={
        darkMode
          ? 'mt-4 bg-white/20 p-5 rounded-xl border border-white/20'
          : 'mt-4 bg-gray-100 p-5 rounded-xl border border-gray-300'
      }
    >
      <Text
        className={
          darkMode
            ? 'text-white text-center mb-4 text-xl font-bold'
            : 'text-gray-800 text-center mb-4 text-xl font-bold'
        }
      >
        Producto no encontrado
      </Text>

      {[
        { label: 'Nombre:', value: newName, setter: setNewName },
        {
          label: 'Precio compra:',
          value: buyPrice,
          setter: setBuyPrice,
          numeric: true,
        },
        {
          label: 'Precio venta:',
          value: sellPrice,
          setter: setSellPrice,
          numeric: true,
        },
        { label: 'Stock:', value: stock, setter: setStock, numeric: true },
        { label: 'Marca:', value: marca, setter: setMarca },
        { label: 'Imagen URL:', value: imgurl, setter: setImgurl },
      ].map((field, index) => (
        <View className="mb-4" key={index}>
          <Text className={darkMode ? 'text-white mb-1' : 'text-gray-700 mb-1'}>
            {field.label}
          </Text>

          <TextInput
            className="bg-white rounded-lg px-3 py-2"
            keyboardType={field.numeric ? 'numeric' : 'default'}
            value={field.value}
            onChangeText={field.setter}
          />
        </View>
      ))}

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

  //-------------------------------------------------------------------
  // PERMISOS
  //-------------------------------------------------------------------
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

  //-------------------------------------------------------------------
  // VISTA SIN CÁMARA
  //-------------------------------------------------------------------
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

  //-------------------------------------------------------------------
  // VISTA CON CÁMARA
  //-------------------------------------------------------------------
  return (
    <GluestackUIProvider>
      <View style={{ flex: 1 }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
          autoFocus="on"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['all'] }}
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
