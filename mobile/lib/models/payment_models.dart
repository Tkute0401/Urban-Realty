import 'package:json_annotation/json_annotation.dart';

part 'payment_models.g.dart';

/// Payment model
@JsonSerializable()
class Payment {
  final String id;
  final String userId;
  final String? propertyId;
  final String? projectId;
  final String? subscriptionId;
  final PaymentType type;
  final PaymentMethod method;
  final PaymentStatus status;
  final double amount;
  final String currency;
  final String? description;
  final String? reference;
  final String? transactionId;
  final String? gatewayTransactionId;
  final Map<String, dynamic> gatewayResponse;
  final Map<String, dynamic> metadata;
  final DateTime createdAt;
  final DateTime? processedAt;
  final DateTime? completedAt;
  final DateTime? failedAt;
  final String? failureReason;
  final String? receiptUrl;
  final String? invoiceUrl;
  final List<PaymentRefund> refunds;
  final PaymentFee? fee;
  final PaymentTax? tax;
  final PaymentDiscount? discount;

  const Payment({
    required this.id,
    required this.userId,
    this.propertyId,
    this.projectId,
    this.subscriptionId,
    required this.type,
    required this.method,
    required this.status,
    required this.amount,
    required this.currency,
    this.description,
    this.reference,
    this.transactionId,
    this.gatewayTransactionId,
    required this.gatewayResponse,
    required this.metadata,
    required this.createdAt,
    this.processedAt,
    this.completedAt,
    this.failedAt,
    this.failureReason,
    this.receiptUrl,
    this.invoiceUrl,
    this.refunds = const [],
    this.fee,
    this.tax,
    this.discount,
  });

  factory Payment.fromJson(Map<String, dynamic> json) => _$PaymentFromJson(json);
  Map<String, dynamic> toJson() => _$PaymentToJson(this);

  Payment copyWith({
    String? id,
    String? userId,
    String? propertyId,
    String? projectId,
    String? subscriptionId,
    PaymentType? type,
    PaymentMethod? method,
    PaymentStatus? status,
    double? amount,
    String? currency,
    String? description,
    String? reference,
    String? transactionId,
    String? gatewayTransactionId,
    Map<String, dynamic>? gatewayResponse,
    Map<String, dynamic>? metadata,
    DateTime? createdAt,
    DateTime? processedAt,
    DateTime? completedAt,
    DateTime? failedAt,
    String? failureReason,
    String? receiptUrl,
    String? invoiceUrl,
    List<PaymentRefund>? refunds,
    PaymentFee? fee,
    PaymentTax? tax,
    PaymentDiscount? discount,
  }) {
    return Payment(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      propertyId: propertyId ?? this.propertyId,
      projectId: projectId ?? this.projectId,
      subscriptionId: subscriptionId ?? this.subscriptionId,
      type: type ?? this.type,
      method: method ?? this.method,
      status: status ?? this.status,
      amount: amount ?? this.amount,
      currency: currency ?? this.currency,
      description: description ?? this.description,
      reference: reference ?? this.reference,
      transactionId: transactionId ?? this.transactionId,
      gatewayTransactionId: gatewayTransactionId ?? this.gatewayTransactionId,
      gatewayResponse: gatewayResponse ?? this.gatewayResponse,
      metadata: metadata ?? this.metadata,
      createdAt: createdAt ?? this.createdAt,
      processedAt: processedAt ?? this.processedAt,
      completedAt: completedAt ?? this.completedAt,
      failedAt: failedAt ?? this.failedAt,
      failureReason: failureReason ?? this.failureReason,
      receiptUrl: receiptUrl ?? this.receiptUrl,
      invoiceUrl: invoiceUrl ?? this.invoiceUrl,
      refunds: refunds ?? this.refunds,
      fee: fee ?? this.fee,
      tax: tax ?? this.tax,
      discount: discount ?? this.discount,
    );
  }
}

/// Payment method model
@JsonSerializable()
class PaymentMethod {
  final String id;
  final String userId;
  final PaymentMethodType type;
  final String name;
  final String? last4;
  final String? brand;
  final String? expiryMonth;
  final String? expiryYear;
  final bool isDefault;
  final bool isActive;
  final Map<String, dynamic> metadata;
  final DateTime createdAt;
  final DateTime updatedAt;

  const PaymentMethod({
    required this.id,
    required this.userId,
    required this.type,
    required this.name,
    this.last4,
    this.brand,
    this.expiryMonth,
    this.expiryYear,
    required this.isDefault,
    required this.isActive,
    required this.metadata,
    required this.createdAt,
    required this.updatedAt,
  });

  factory PaymentMethod.fromJson(Map<String, dynamic> json) => _$PaymentMethodFromJson(json);
  Map<String, dynamic> toJson() => _$PaymentMethodToJson(this);
}

/// Payment refund model
@JsonSerializable()
class PaymentRefund {
  final String id;
  final String paymentId;
  final double amount;
  final String reason;
  final PaymentRefundStatus status;
  final String? gatewayRefundId;
  final Map<String, dynamic> gatewayResponse;
  final DateTime createdAt;
  final DateTime? processedAt;
  final String? failureReason;

  const PaymentRefund({
    required this.id,
    required this.paymentId,
    required this.amount,
    required this.reason,
    required this.status,
    this.gatewayRefundId,
    required this.gatewayResponse,
    required this.createdAt,
    this.processedAt,
    this.failureReason,
  });

  factory PaymentRefund.fromJson(Map<String, dynamic> json) => _$PaymentRefundFromJson(json);
  Map<String, dynamic> toJson() => _$PaymentRefundToJson(this);
}

/// Payment fee model
@JsonSerializable()
class PaymentFee {
  final double amount;
  final String currency;
  final String type;
  final String description;
  final double percentage;

  const PaymentFee({
    required this.amount,
    required this.currency,
    required this.type,
    required this.description,
    required this.percentage,
  });

  factory PaymentFee.fromJson(Map<String, dynamic> json) => _$PaymentFeeFromJson(json);
  Map<String, dynamic> toJson() => _$PaymentFeeToJson(this);
}

/// Payment tax model
@JsonSerializable()
class PaymentTax {
  final double amount;
  final String currency;
  final String type;
  final String description;
  final double percentage;
  final String? taxId;

  const PaymentTax({
    required this.amount,
    required this.currency,
    required this.type,
    required this.description,
    required this.percentage,
    this.taxId,
  });

  factory PaymentTax.fromJson(Map<String, dynamic> json) => _$PaymentTaxFromJson(json);
  Map<String, dynamic> toJson() => _$PaymentTaxToJson(this);
}

/// Payment discount model
@JsonSerializable()
class PaymentDiscount {
  final double amount;
  final String currency;
  final String type;
  final String description;
  final String? couponCode;
  final double percentage;

  const PaymentDiscount({
    required this.amount,
    required this.currency,
    required this.type,
    required this.description,
    this.couponCode,
    required this.percentage,
  });

  factory PaymentDiscount.fromJson(Map<String, dynamic> json) => _$PaymentDiscountFromJson(json);
  Map<String, dynamic> toJson() => _$PaymentDiscountToJson(this);
}

/// Invoice model
@JsonSerializable()
class Invoice {
  final String id;
  final String userId;
  final String? paymentId;
  final String? propertyId;
  final String? projectId;
  final String invoiceNumber;
  final InvoiceStatus status;
  final double amount;
  final String currency;
  final String? description;
  final DateTime issueDate;
  final DateTime dueDate;
  final DateTime? paidDate;
  final InvoiceItem items;
  final InvoiceAddress billingAddress;
  final InvoiceAddress? shippingAddress;
  final PaymentFee? fee;
  final PaymentTax? tax;
  final PaymentDiscount? discount;
  final String? notes;
  final String? terms;
  final String? pdfUrl;
  final Map<String, dynamic> metadata;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Invoice({
    required this.id,
    required this.userId,
    this.paymentId,
    this.propertyId,
    this.projectId,
    required this.invoiceNumber,
    required this.status,
    required this.amount,
    required this.currency,
    this.description,
    required this.issueDate,
    required this.dueDate,
    this.paidDate,
    required this.items,
    required this.billingAddress,
    this.shippingAddress,
    this.fee,
    this.tax,
    this.discount,
    this.notes,
    this.terms,
    this.pdfUrl,
    required this.metadata,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Invoice.fromJson(Map<String, dynamic> json) => _$InvoiceFromJson(json);
  Map<String, dynamic> toJson() => _$InvoiceToJson(this);
}

/// Invoice item model
@JsonSerializable()
class InvoiceItem {
  final String id;
  final String name;
  final String description;
  final int quantity;
  final double unitPrice;
  final double totalPrice;
  final String currency;
  final String? category;
  final Map<String, dynamic> metadata;

  const InvoiceItem({
    required this.id,
    required this.name,
    required this.description,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
    required this.currency,
    this.category,
    required this.metadata,
  });

  factory InvoiceItem.fromJson(Map<String, dynamic> json) => _$InvoiceItemFromJson(json);
  Map<String, dynamic> toJson() => _$InvoiceItemToJson(this);
}

/// Invoice address model
@JsonSerializable()
class InvoiceAddress {
  final String name;
  final String? company;
  final String address1;
  final String? address2;
  final String city;
  final String state;
  final String postalCode;
  final String country;
  final String? phone;
  final String? email;

  const InvoiceAddress({
    required this.name,
    this.company,
    required this.address1,
    this.address2,
    required this.city,
    required this.state,
    required this.postalCode,
    required this.country,
    this.phone,
    this.email,
  });

  factory InvoiceAddress.fromJson(Map<String, dynamic> json) => _$InvoiceAddressFromJson(json);
  Map<String, dynamic> toJson() => _$InvoiceAddressToJson(this);
}

/// Payment gateway model
@JsonSerializable()
class PaymentGateway {
  final String id;
  final String name;
  final String type;
  final bool isActive;
  final Map<String, dynamic> configuration;
  final List<String> supportedMethods;
  final List<String> supportedCurrencies;
  final Map<String, dynamic> metadata;
  final DateTime createdAt;
  final DateTime updatedAt;

  const PaymentGateway({
    required this.id,
    required this.name,
    required this.type,
    required this.isActive,
    required this.configuration,
    required this.supportedMethods,
    required this.supportedCurrencies,
    required this.metadata,
    required this.createdAt,
    required this.updatedAt,
  });

  factory PaymentGateway.fromJson(Map<String, dynamic> json) => _$PaymentGatewayFromJson(json);
  Map<String, dynamic> toJson() => _$PaymentGatewayToJson(this);
}

/// Payment analytics model
@JsonSerializable()
class PaymentAnalytics {
  final String id;
  final String userId;
  final DateTime date;
  final double totalAmount;
  final int totalTransactions;
  final double averageTransactionAmount;
  final Map<String, int> methodBreakdown;
  final Map<String, int> statusBreakdown;
  final Map<String, double> currencyBreakdown;
  final Map<String, dynamic> metadata;

  const PaymentAnalytics({
    required this.id,
    required this.userId,
    required this.date,
    required this.totalAmount,
    required this.totalTransactions,
    required this.averageTransactionAmount,
    required this.methodBreakdown,
    required this.statusBreakdown,
    required this.currencyBreakdown,
    required this.metadata,
  });

  factory PaymentAnalytics.fromJson(Map<String, dynamic> json) => _$PaymentAnalyticsFromJson(json);
  Map<String, dynamic> toJson() => _$PaymentAnalyticsToJson(this);
}

/// Payment types enum
enum PaymentType {
  @JsonValue('property_purchase')
  propertyPurchase,
  @JsonValue('property_rent')
  propertyRent,
  @JsonValue('project_investment')
  projectInvestment,
  @JsonValue('subscription')
  subscription,
  @JsonValue('service_fee')
  serviceFee,
  @JsonValue('commission')
  commission,
  @JsonValue('refund')
  refund,
  @JsonValue('deposit')
  deposit,
  @JsonValue('maintenance')
  maintenance,
  @JsonValue('other')
  other,
}

/// Payment method types enum
enum PaymentMethodType {
  @JsonValue('card')
  card,
  @JsonValue('upi')
  upi,
  @JsonValue('netbanking')
  netbanking,
  @JsonValue('wallet')
  wallet,
  @JsonValue('bank_transfer')
  bankTransfer,
  @JsonValue('cash')
  cash,
  @JsonValue('cheque')
  cheque,
  @JsonValue('paypal')
  paypal,
  @JsonValue('stripe')
  stripe,
  @JsonValue('razorpay')
  razorpay,
  @JsonValue('paytm')
  paytm,
  @JsonValue('phonepe')
  phonepe,
  @JsonValue('google_pay')
  googlePay,
  @JsonValue('apple_pay')
  applePay,
  @JsonValue('amazon_pay')
  amazonPay,
  @JsonValue('payu')
  payu,
  @JsonValue('paystack')
  paystack,
  @JsonValue('flutterwave')
  flutterwave,
  @JsonValue('square')
  square,
}

/// Payment status enum
enum PaymentStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('processing')
  processing,
  @JsonValue('completed')
  completed,
  @JsonValue('failed')
  failed,
  @JsonValue('cancelled')
  cancelled,
  @JsonValue('refunded')
  refunded,
  @JsonValue('partially_refunded')
  partiallyRefunded,
  @JsonValue('disputed')
  disputed,
  @JsonValue('expired')
  expired,
}

/// Payment refund status enum
enum PaymentRefundStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('processing')
  processing,
  @JsonValue('completed')
  completed,
  @JsonValue('failed')
  failed,
  @JsonValue('cancelled')
  cancelled,
}

/// Invoice status enum
enum InvoiceStatus {
  @JsonValue('draft')
  draft,
  @JsonValue('sent')
  sent,
  @JsonValue('paid')
  paid,
  @JsonValue('overdue')
  overdue,
  @JsonValue('cancelled')
  cancelled,
  @JsonValue('refunded')
  refunded,
}


