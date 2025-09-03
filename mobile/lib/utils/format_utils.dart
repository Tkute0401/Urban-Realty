class FormatUtils {
  static String formatPrice(int price) {
    if (price >= 10000000) {
      return "₹${(price / 10000000).toStringAsFixed(1)} Cr";
    } else if (price >= 100000) {
      return "₹${(price / 100000).toStringAsFixed(1)} L";
    } else if (price >= 1000) {
      return "₹${(price / 1000).toStringAsFixed(1)} K";
    } else {
      return "₹$price";
    }
  }
}
