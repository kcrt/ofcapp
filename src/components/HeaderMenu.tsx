import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Link } from 'expo-router';
import * as Icons from '@expo/vector-icons';

export interface HeaderMenuProps {
  tintColor?: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
  { label: 'About', href: '/about', icon: 'information-circle' },
];

export default function HeaderMenu({ tintColor = '#fff' }: HeaderMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
        <Icons.Ionicons name="menu" size={24} color={tintColor} />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href} asChild>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => setMenuVisible(false)}
                >
                  <Icons.Ionicons name={item.icon as any} size={20} color="#333333" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    marginTop: 56, // Approximate header height
    marginRight: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333333',
  },
});
