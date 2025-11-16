import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { fetchProduct } from '../../services/products';
import '@/global.css';

export default function QrReader() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [hasScanned, setHasScanned] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

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
      setError(err.message);
      setResult(null);
    }

    setTimeout(() => {
      setHasScanned(false);
    }, 1500);
  };

  const toggleCameraFacing = () =>
    setFacing((current) => (current === 'back' ? 'front' : 'back'));

  const FieldBox = ({ label, value }) => (
    <View className="bg-white shadow p-3 rounded-lg mb-3 border border-gray-300 w-full">
      <Text className="text-gray-600 font-semibold">{label}</Text>
      <Text className="text-black text-lg">{String(value)}</Text>
    </View>
  );

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

  if (!showCamera) {
    return (
      <GluestackUIProvider>
        <View className="flex flex-col items-center mt-12 px-5 w-full">
          <Text className="text-xl font-bold mb-4">Lector de códigos</Text>

          <TouchableOpacity
            className="bg-blue-500 px-8 py-4 rounded-lg"
            onPress={() => setShowCamera(true)}
          >
            <Text className="text-xl font-bold text-white">Abrir cámara</Text>
          </TouchableOpacity>

          {result && (
            <ScrollView
              style={{ width: '100%', marginTop: 20, maxHeight: 525 }}
              showsVerticalScrollIndicator={false}
            >
              <View>
                <Text className="text-xl font-bold mb-3">
                  Producto detectado
                </Text>
                {Object.entries(result).map(([key, value]) => (
                  <FieldBox key={key} label={key} value={value} />
                ))}
              </View>
            </ScrollView>
          )}

          {error && <Text className="text-red-500 mt-5">{error}</Text>}
        </View>
      </GluestackUIProvider>
    );
  }

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
          className="absolute top-10 right-5 bg-black/40 px-4 py-2 rounded-lg"
          onPress={toggleCameraFacing}
        >
          <Text className="text-white text-lg">Voltear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="absolute top-10 left-5 bg-black/40 px-4 py-2 rounded-lg"
          onPress={() => setShowCamera(false)}
        >
          <Text className="text-white text-lg">Cerrar</Text>
        </TouchableOpacity>

        <View className="absolute bottom-0 w-full bg-black/50 pt-3 pb-8 px-5">
          <ScrollView
            style={{ maxHeight: 300 }}
            showsVerticalScrollIndicator={false}
          >
            {lastScan && (
              <Text className="text-white text-center mb-3 text-lg">
                Código: {lastScan.data}
              </Text>
            )}

            {result &&
              Object.entries(result).map(([key, value]) => (
                <FieldBox key={key} label={key} value={value} />
              ))}

            {error && (
              <Text className="text-red-400 mt-3 text-center">{error}</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </GluestackUIProvider>
  );
}
