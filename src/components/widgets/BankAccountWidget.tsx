/**
 * Bank Account Widget Component
 * Displays bank account information and balance
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WidgetView from "../WidgetView";
import { BaseWidgetProps } from "./WidgetFactory";

interface BankAccountData {
  accountNumber?: string;
  accountType?: string;
  balance?: number;
  lastUpdated?: string;
}

export const BankAccountWidget: React.FC<BaseWidgetProps> = ({
  title,
  data,
  lastUpdated,
  onPress,
}) => {
  // Type-safe data extraction
  const bankData = data as BankAccountData;
  
  // Default values for dummy widget
  const accountNumber = bankData?.accountNumber || "•••• 4321";
  const accountType = bankData?.accountType || "Checking Account";
  const balance = bankData?.balance || 12345.67;
  const lastUpdatedTime = bankData?.lastUpdated || "2:30 PM";

  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(balance);

  return (
    <WidgetView
      title={title}
      subtitle={`${accountType} ${accountNumber}`}
      headerIcon={<Text style={styles.icon}>💰</Text>}
      backgroundColor="#F8F9FA"
      minHeight={140}
      onPress={onPress}
    >
      <View style={styles.bankBalanceContainer}>
        <Text style={styles.bankBalanceLabel}>Available Balance</Text>
        <Text style={styles.bankBalanceAmount}>{formattedBalance}</Text>
        <Text style={styles.bankBalanceSubtext}>
          Last updated: {lastUpdatedTime}
        </Text>
      </View>
    </WidgetView>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
  bankBalanceContainer: {
    alignItems: "flex-start",
  },
  bankBalanceLabel: {
    fontSize: 13, // Footnote
    color: "#8E8E93",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bankBalanceAmount: {
    fontSize: 32, // Large display number
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  bankBalanceSubtext: {
    fontSize: 13, // Footnote
    color: "#8E8E93",
  },
});

