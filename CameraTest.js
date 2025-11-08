import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraTest() {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleScan = ({ type, data }) => {
    console.log('✅ Código detectado:', type, data);
    Alert.alert('Código detectado', `${type}: ${data}`);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>No hay permisos de cámara</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleScan}
        barcodeScannerSettings={{ barcodeTypes: ['all'] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
