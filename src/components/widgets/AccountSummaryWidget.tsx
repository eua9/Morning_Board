/**
 * Account Summary Widget Component
 * Displays account summary information (alias for Bank Account widget)
 * 
 * This is a wrapper around BankAccountWidget for consistency with naming
 * used in some frontend discussions. The widget type "bank" is used in the API.
 */

import React from "react";
import { BankAccountWidget } from "./BankAccountWidget";
import { BaseWidgetProps } from "./WidgetFactory";

/**
 * AccountSummaryWidget - Alias for BankAccountWidget
 * Accepts the same props as BankAccountWidget
 * 
 * @example
 * <AccountSummaryWidget
 *   title="Account Summary"
 *   data={{ accountNumber: "•••• 4321", balance: 12345.67 }}
 * />
 */
export const AccountSummaryWidget: React.FC<BaseWidgetProps> = (props) => {
  // Delegate to BankAccountWidget
  return <BankAccountWidget {...props} />;
};

