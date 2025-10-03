import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SquareButton from '@/components/SquareButton';

export default function SquareButtonTest() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>SquareButton Component Test</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default Mode</Text>
        <View style={styles.buttonRow}>
          <SquareButton title="計算" iconName="Ionicons.calculator" />
          <SquareButton title="設定" iconName="Ionicons.settings" />
          <SquareButton title="情報" iconName="Ionicons.information-circle" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Demo Mode</Text>
        <View style={styles.buttonRow}>
          <SquareButton title="計算" iconName="Ionicons.calculator" mode="demo" />
          <SquareButton title="デモ" iconName="Ionicons.flask" mode="demo" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Beta Mode</Text>
        <View style={styles.buttonRow}>
          <SquareButton title="新機能" iconName="Ionicons.flask" mode="beta" />
          <SquareButton title="テスト" iconName="Ionicons.beaker" mode="beta" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Important Mode</Text>
        <View style={styles.buttonRow}>
          <SquareButton title="警告" iconName="Ionicons.warning" mode="important" />
          <SquareButton title="注意" iconName="Ionicons.alert-circle" mode="important" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Mode</Text>
        <View style={styles.buttonRow}>
          <SquareButton title="新着" iconName="Ionicons.sparkles" mode="new" />
          <SquareButton title="最新" iconName="Ionicons.star" mode="new" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disabled State</Text>
        <View style={styles.buttonRow}>
          <SquareButton title="無効" iconName="Ionicons.ban" disabled />
          <SquareButton title="ロック" iconName="Ionicons.lock-closed" disabled />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333333',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#555555',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
});
