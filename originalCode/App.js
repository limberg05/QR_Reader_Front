import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export default function QrReader() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [lastScan, setLastScan] = useState(null);
  const [hasScanned, setHasScanned] = useState(false); // ✅ evita lecturas repetidas
  const cameraRef = useRef(null);

  // Solicitar permisos de cámara y galería
  useEffect(() => {
    if (!permission?.granted) requestPermission();
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
    })();
  }, [permission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        setCapturedImage(photo.uri);
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        setShowCamera(false);
      } catch (error) {
        Alert.alert('Error', 'No se pudo tomar la fotografía');
      }
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (hasScanned) return;
    console.log('✅ CÓDIGO DETECTADO:', type, data);
    setHasScanned(true);
    setLastScan({ type, data });
    setScannedCodes((prev) => [...prev, { type, data }]);

    setTimeout(() => {
      setLastScan(null);
      setHasScanned(false);
    }, 2000);
  };

  const toggleCameraFacing = () =>
    setFacing((current) => (current === 'back' ? 'front' : 'back'));

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No hay permisos de cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Dar permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showCamera) {
    return (
      <GluestackUIProvider>
        <View style={styles.fullScreen}>
          <CameraView
            style={StyleSheet.absoluteFillObject} // ✅ cámara ocupa toda la vista
            facing={facing}
            ref={cameraRef}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['all'], // ✅ acepta todos los tipos
            }}
          >
            {/* Overlay visual tipo iPhone */}
            <View style={styles.overlayFrame}>
              <View style={styles.frame} />
              {lastScan && (
                <View style={styles.overlayBox}>
                  <Text style={styles.overlayText}>📦 {lastScan.data}</Text>
                </View>
              )}
            </View>

            {/* Controles inferiores */}
            <View style={styles.cameraButtonContainer}>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.cameraButtonText}>🔄 Voltear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureInner} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => setShowCamera(false)}
              >
                <Text style={styles.cameraButtonText}>❌ Cerrar</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      </GluestackUIProvider>
    );
  }

  return (
    <GluestackUIProvider>
      <View style={styles.container}>
        <Text style={styles.title}>📸 Lector de códigos de barras</Text>

        {capturedImage && (
          <Image source={{ uri: capturedImage }} style={styles.preview} />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowCamera(true)}
        >
          <Text style={styles.buttonText}>📷 Abrir cámara</Text>
        </TouchableOpacity>

        {capturedImage && (
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={() => setCapturedImage(null)}
          >
            <Text style={styles.buttonText}>🧹 Limpiar imagen</Text>
          </TouchableOpacity>
        )}

        {scannedCodes.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Códigos escaneados:</Text>
            <FlatList
              data={scannedCodes}
              keyExtractor={(item, index) => `${item.data}-${index}`}
              renderItem={({ item }) => (
                <Text style={styles.resultText}>
                  {item.type} → {item.data}
                </Text>
              )}
            />
          </View>
        )}
      </View>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#222' },
  text: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 10 },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  clearButton: { backgroundColor: '#ff4d4d' },
  fullScreen: { flex: 1, backgroundColor: '#000' },

  // Cámara
  cameraButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 15,
  },
  cameraButton: { padding: 10 },
  cameraButtonText: { color: '#fff', fontSize: 16 },
  captureButton: {
    width: 70,
    height: 70,
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
  },

  // Overlay del escáner
  overlayFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#007BFF',
    borderRadius: 15,
  },
  overlayBox: {
    position: 'absolute',
    top: '30%',
    alignItems: 'center',
  },
  overlayText: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#00FF00',
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
  },

  preview: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  resultsContainer: {
    marginTop: 20,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    width: '90%',
  },
  resultsTitle: { fontWeight: 'bold', marginBottom: 5 },
  resultText: { color: '#333', fontSize: 14 },
});
