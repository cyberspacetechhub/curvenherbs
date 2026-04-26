export const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString('en-NG')}`;

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateTime = (date: string) =>
  new Date(date).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const getWhatsAppOrderLink = (productName?: string, orderId?: string) => {
  const phone = '2348149838596';
  const message = productName
    ? `Hello Curvenherbs! I'd like to order: *${productName}*`
    : orderId
    ? `Hello Curvenherbs! I'm enquiring about Order #${orderId}`
    : `Hello Curvenherbs! I'd like to place an order.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export const getMainImage = (images: { url: string; isMain: boolean }[]) =>
  images.find(i => i.isMain)?.url ?? images[0]?.url ?? '/placeholder-product.jpg';

export const getDiscountPercent = (price: number, discountedPrice: number) =>
  Math.round(((price - discountedPrice) / price) * 100);

export const truncate = (text: string, length = 100) =>
  text.length > length ? `${text.slice(0, length)}...` : text;

export const ORDER_STATUS_COLOR: Record<string, string> = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Payment Received': 'bg-blue-100 text-blue-800',
  'Processing': 'bg-purple-100 text-purple-800',
  'Shipped': 'bg-indigo-100 text-indigo-800',
  'Out for Delivery': 'bg-pink-100 text-pink-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
};
