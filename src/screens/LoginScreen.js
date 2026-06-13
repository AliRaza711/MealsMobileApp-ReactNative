import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🍳</Text>
        </View>
        <Text style={styles.title}>BiteSize</Text>
        <Text style={styles.subtitle}>Quick and easy meals tailored for the busy student.</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.replace('Home')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Cooking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#FFF2EE',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FA4A0C',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#FA4A0C',
    paddingVertical: 18,
    width: '100%',
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#FA4A0C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});