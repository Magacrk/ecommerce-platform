import { createContext, useState, useContext, ReactNode } from 'react';
import { CartItem } from './CartContext';
import CartNotification from '@/components/notifications/CartNotification';

interface NotificationContextType {
  showCartNotification: (item: CartItem) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  showCartNotification: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [cartNotificationItem, setCartNotificationItem] = useState<CartItem | null>(null);
  const [isCartNotificationVisible, setIsCartNotificationVisible] = useState(false);

  // Show cart notification with the added item
  const showCartNotification = (item: CartItem) => {
    setCartNotificationItem(item);
    setIsCartNotificationVisible(true);
  };

  // Hide cart notification
  const hideCartNotification = () => {
    setIsCartNotificationVisible(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        showCartNotification,
      }}
    >
      {children}
      
      {/* Cart notification */}
      <CartNotification
        item={cartNotificationItem}
        isVisible={isCartNotificationVisible}
        onClose={hideCartNotification}
      />
    </NotificationContext.Provider>
  );
};

// Custom hook for using notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 