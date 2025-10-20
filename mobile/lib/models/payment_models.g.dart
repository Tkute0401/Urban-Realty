// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'payment_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Payment _$PaymentFromJson(Map<String, dynamic> json) => Payment(
      id: json['id'] as String,
      userId: json['userId'] as String,
      propertyId: json['propertyId'] as String?,
      projectId: json['projectId'] as String?,
      subscriptionId: json['subscriptionId'] as String?,
      type: $enumDecode(_$PaymentTypeEnumMap, json['type']),
      method: PaymentMethod.fromJson(json['method'] as Map<String, dynamic>),
      status: $enumDecode(_$PaymentStatusEnumMap, json['status']),
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      description: json['description'] as String?,
      reference: json['reference'] as String?,
      transactionId: json['transactionId'] as String?,
      gatewayTransactionId: json['gatewayTransactionId'] as String?,
      gatewayResponse: json['gatewayResponse'] as Map<String, dynamic>,
      metadata: json['metadata'] as Map<String, dynamic>,
      createdAt: DateTime.parse(json['createdAt'] as String),
      processedAt: json['processedAt'] == null
          ? null
          : DateTime.parse(json['processedAt'] as String),
      completedAt: json['completedAt'] == null
          ? null
          : DateTime.parse(json['completedAt'] as String),
      failedAt: json['failedAt'] == null
          ? null
          : DateTime.parse(json['failedAt'] as String),
      failureReason: json['failureReason'] as String?,
      receiptUrl: json['receiptUrl'] as String?,
      invoiceUrl: json['invoiceUrl'] as String?,
      refunds: (json['refunds'] as List<dynamic>?)
              ?.map((e) => PaymentRefund.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      fee: json['fee'] == null
          ? null
          : PaymentFee.fromJson(json['fee'] as Map<String, dynamic>),
      tax: json['tax'] == null
          ? null
          : PaymentTax.fromJson(json['tax'] as Map<String, dynamic>),
      discount: json['discount'] == null
          ? null
          : PaymentDiscount.fromJson(json['discount'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$PaymentToJson(Payment instance) => <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'propertyId': instance.propertyId,
      'projectId': instance.projectId,
      'subscriptionId': instance.subscriptionId,
      'type': _$PaymentTypeEnumMap[instance.type]!,
      'method': instance.method,
      'status': _$PaymentStatusEnumMap[instance.status]!,
      'amount': instance.amount,
      'currency': instance.currency,
      'description': instance.description,
      'reference': instance.reference,
      'transactionId': instance.transactionId,
      'gatewayTransactionId': instance.gatewayTransactionId,
      'gatewayResponse': instance.gatewayResponse,
      'metadata': instance.metadata,
      'createdAt': instance.createdAt.toIso8601String(),
      'processedAt': instance.processedAt?.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
      'failedAt': instance.failedAt?.toIso8601String(),
      'failureReason': instance.failureReason,
      'receiptUrl': instance.receiptUrl,
      'invoiceUrl': instance.invoiceUrl,
      'refunds': instance.refunds,
      'fee': instance.fee,
      'tax': instance.tax,
      'discount': instance.discount,
    };

const _$PaymentTypeEnumMap = {
  PaymentType.propertyPurchase: 'property_purchase',
  PaymentType.propertyRent: 'property_rent',
  PaymentType.projectInvestment: 'project_investment',
  PaymentType.subscription: 'subscription',
  PaymentType.serviceFee: 'service_fee',
  PaymentType.commission: 'commission',
  PaymentType.refund: 'refund',
  PaymentType.deposit: 'deposit',
  PaymentType.maintenance: 'maintenance',
  PaymentType.other: 'other',
};

const _$PaymentStatusEnumMap = {
  PaymentStatus.pending: 'pending',
  PaymentStatus.processing: 'processing',
  PaymentStatus.completed: 'completed',
  PaymentStatus.failed: 'failed',
  PaymentStatus.cancelled: 'cancelled',
  PaymentStatus.refunded: 'refunded',
  PaymentStatus.partiallyRefunded: 'partially_refunded',
  PaymentStatus.disputed: 'disputed',
  PaymentStatus.expired: 'expired',
};

PaymentMethod _$PaymentMethodFromJson(Map<String, dynamic> json) =>
    PaymentMethod(
      id: json['id'] as String,
      userId: json['userId'] as String,
      type: $enumDecode(_$PaymentMethodTypeEnumMap, json['type']),
      name: json['name'] as String,
      last4: json['last4'] as String?,
      brand: json['brand'] as String?,
      expiryMonth: json['expiryMonth'] as String?,
      expiryYear: json['expiryYear'] as String?,
      isDefault: json['isDefault'] as bool,
      isActive: json['isActive'] as bool,
      metadata: json['metadata'] as Map<String, dynamic>,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$PaymentMethodToJson(PaymentMethod instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'type': _$PaymentMethodTypeEnumMap[instance.type]!,
      'name': instance.name,
      'last4': instance.last4,
      'brand': instance.brand,
      'expiryMonth': instance.expiryMonth,
      'expiryYear': instance.expiryYear,
      'isDefault': instance.isDefault,
      'isActive': instance.isActive,
      'metadata': instance.metadata,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$PaymentMethodTypeEnumMap = {
  PaymentMethodType.card: 'card',
  PaymentMethodType.upi: 'upi',
  PaymentMethodType.netbanking: 'netbanking',
  PaymentMethodType.wallet: 'wallet',
  PaymentMethodType.bankTransfer: 'bank_transfer',
  PaymentMethodType.cash: 'cash',
  PaymentMethodType.cheque: 'cheque',
  PaymentMethodType.paypal: 'paypal',
  PaymentMethodType.stripe: 'stripe',
  PaymentMethodType.razorpay: 'razorpay',
  PaymentMethodType.paytm: 'paytm',
  PaymentMethodType.phonepe: 'phonepe',
  PaymentMethodType.googlePay: 'google_pay',
  PaymentMethodType.applePay: 'apple_pay',
  PaymentMethodType.amazonPay: 'amazon_pay',
  PaymentMethodType.payu: 'payu',
  PaymentMethodType.paystack: 'paystack',
  PaymentMethodType.flutterwave: 'flutterwave',
  PaymentMethodType.square: 'square',
};

PaymentRefund _$PaymentRefundFromJson(Map<String, dynamic> json) =>
    PaymentRefund(
      id: json['id'] as String,
      paymentId: json['paymentId'] as String,
      amount: (json['amount'] as num).toDouble(),
      reason: json['reason'] as String,
      status: $enumDecode(_$PaymentRefundStatusEnumMap, json['status']),
      gatewayRefundId: json['gatewayRefundId'] as String?,
      gatewayResponse: json['gatewayResponse'] as Map<String, dynamic>,
      createdAt: DateTime.parse(json['createdAt'] as String),
      processedAt: json['processedAt'] == null
          ? null
          : DateTime.parse(json['processedAt'] as String),
      failureReason: json['failureReason'] as String?,
    );

Map<String, dynamic> _$PaymentRefundToJson(PaymentRefund instance) =>
    <String, dynamic>{
      'id': instance.id,
      'paymentId': instance.paymentId,
      'amount': instance.amount,
      'reason': instance.reason,
      'status': _$PaymentRefundStatusEnumMap[instance.status]!,
      'gatewayRefundId': instance.gatewayRefundId,
      'gatewayResponse': instance.gatewayResponse,
      'createdAt': instance.createdAt.toIso8601String(),
      'processedAt': instance.processedAt?.toIso8601String(),
      'failureReason': instance.failureReason,
    };

const _$PaymentRefundStatusEnumMap = {
  PaymentRefundStatus.pending: 'pending',
  PaymentRefundStatus.processing: 'processing',
  PaymentRefundStatus.completed: 'completed',
  PaymentRefundStatus.failed: 'failed',
  PaymentRefundStatus.cancelled: 'cancelled',
};

PaymentFee _$PaymentFeeFromJson(Map<String, dynamic> json) => PaymentFee(
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      type: json['type'] as String,
      description: json['description'] as String,
      percentage: (json['percentage'] as num).toDouble(),
    );

Map<String, dynamic> _$PaymentFeeToJson(PaymentFee instance) =>
    <String, dynamic>{
      'amount': instance.amount,
      'currency': instance.currency,
      'type': instance.type,
      'description': instance.description,
      'percentage': instance.percentage,
    };

PaymentTax _$PaymentTaxFromJson(Map<String, dynamic> json) => PaymentTax(
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      type: json['type'] as String,
      description: json['description'] as String,
      percentage: (json['percentage'] as num).toDouble(),
      taxId: json['taxId'] as String?,
    );

Map<String, dynamic> _$PaymentTaxToJson(PaymentTax instance) =>
    <String, dynamic>{
      'amount': instance.amount,
      'currency': instance.currency,
      'type': instance.type,
      'description': instance.description,
      'percentage': instance.percentage,
      'taxId': instance.taxId,
    };

PaymentDiscount _$PaymentDiscountFromJson(Map<String, dynamic> json) =>
    PaymentDiscount(
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      type: json['type'] as String,
      description: json['description'] as String,
      couponCode: json['couponCode'] as String?,
      percentage: (json['percentage'] as num).toDouble(),
    );

Map<String, dynamic> _$PaymentDiscountToJson(PaymentDiscount instance) =>
    <String, dynamic>{
      'amount': instance.amount,
      'currency': instance.currency,
      'type': instance.type,
      'description': instance.description,
      'couponCode': instance.couponCode,
      'percentage': instance.percentage,
    };

Invoice _$InvoiceFromJson(Map<String, dynamic> json) => Invoice(
      id: json['id'] as String,
      userId: json['userId'] as String,
      paymentId: json['paymentId'] as String?,
      propertyId: json['propertyId'] as String?,
      projectId: json['projectId'] as String?,
      invoiceNumber: json['invoiceNumber'] as String,
      status: $enumDecode(_$InvoiceStatusEnumMap, json['status']),
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      description: json['description'] as String?,
      issueDate: DateTime.parse(json['issueDate'] as String),
      dueDate: DateTime.parse(json['dueDate'] as String),
      paidDate: json['paidDate'] == null
          ? null
          : DateTime.parse(json['paidDate'] as String),
      items: InvoiceItem.fromJson(json['items'] as Map<String, dynamic>),
      billingAddress: InvoiceAddress.fromJson(
          json['billingAddress'] as Map<String, dynamic>),
      shippingAddress: json['shippingAddress'] == null
          ? null
          : InvoiceAddress.fromJson(
              json['shippingAddress'] as Map<String, dynamic>),
      fee: json['fee'] == null
          ? null
          : PaymentFee.fromJson(json['fee'] as Map<String, dynamic>),
      tax: json['tax'] == null
          ? null
          : PaymentTax.fromJson(json['tax'] as Map<String, dynamic>),
      discount: json['discount'] == null
          ? null
          : PaymentDiscount.fromJson(json['discount'] as Map<String, dynamic>),
      notes: json['notes'] as String?,
      terms: json['terms'] as String?,
      pdfUrl: json['pdfUrl'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$InvoiceToJson(Invoice instance) => <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'paymentId': instance.paymentId,
      'propertyId': instance.propertyId,
      'projectId': instance.projectId,
      'invoiceNumber': instance.invoiceNumber,
      'status': _$InvoiceStatusEnumMap[instance.status]!,
      'amount': instance.amount,
      'currency': instance.currency,
      'description': instance.description,
      'issueDate': instance.issueDate.toIso8601String(),
      'dueDate': instance.dueDate.toIso8601String(),
      'paidDate': instance.paidDate?.toIso8601String(),
      'items': instance.items,
      'billingAddress': instance.billingAddress,
      'shippingAddress': instance.shippingAddress,
      'fee': instance.fee,
      'tax': instance.tax,
      'discount': instance.discount,
      'notes': instance.notes,
      'terms': instance.terms,
      'pdfUrl': instance.pdfUrl,
      'metadata': instance.metadata,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$InvoiceStatusEnumMap = {
  InvoiceStatus.draft: 'draft',
  InvoiceStatus.sent: 'sent',
  InvoiceStatus.paid: 'paid',
  InvoiceStatus.overdue: 'overdue',
  InvoiceStatus.cancelled: 'cancelled',
  InvoiceStatus.refunded: 'refunded',
};

InvoiceItem _$InvoiceItemFromJson(Map<String, dynamic> json) => InvoiceItem(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      quantity: (json['quantity'] as num).toInt(),
      unitPrice: (json['unitPrice'] as num).toDouble(),
      totalPrice: (json['totalPrice'] as num).toDouble(),
      currency: json['currency'] as String,
      category: json['category'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$InvoiceItemToJson(InvoiceItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'quantity': instance.quantity,
      'unitPrice': instance.unitPrice,
      'totalPrice': instance.totalPrice,
      'currency': instance.currency,
      'category': instance.category,
      'metadata': instance.metadata,
    };

InvoiceAddress _$InvoiceAddressFromJson(Map<String, dynamic> json) =>
    InvoiceAddress(
      name: json['name'] as String,
      company: json['company'] as String?,
      address1: json['address1'] as String,
      address2: json['address2'] as String?,
      city: json['city'] as String,
      state: json['state'] as String,
      postalCode: json['postalCode'] as String,
      country: json['country'] as String,
      phone: json['phone'] as String?,
      email: json['email'] as String?,
    );

Map<String, dynamic> _$InvoiceAddressToJson(InvoiceAddress instance) =>
    <String, dynamic>{
      'name': instance.name,
      'company': instance.company,
      'address1': instance.address1,
      'address2': instance.address2,
      'city': instance.city,
      'state': instance.state,
      'postalCode': instance.postalCode,
      'country': instance.country,
      'phone': instance.phone,
      'email': instance.email,
    };

PaymentGateway _$PaymentGatewayFromJson(Map<String, dynamic> json) =>
    PaymentGateway(
      id: json['id'] as String,
      name: json['name'] as String,
      type: json['type'] as String,
      isActive: json['isActive'] as bool,
      configuration: json['configuration'] as Map<String, dynamic>,
      supportedMethods: (json['supportedMethods'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      supportedCurrencies: (json['supportedCurrencies'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$PaymentGatewayToJson(PaymentGateway instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'type': instance.type,
      'isActive': instance.isActive,
      'configuration': instance.configuration,
      'supportedMethods': instance.supportedMethods,
      'supportedCurrencies': instance.supportedCurrencies,
      'metadata': instance.metadata,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

PaymentAnalytics _$PaymentAnalyticsFromJson(Map<String, dynamic> json) =>
    PaymentAnalytics(
      id: json['id'] as String,
      userId: json['userId'] as String,
      date: DateTime.parse(json['date'] as String),
      totalAmount: (json['totalAmount'] as num).toDouble(),
      totalTransactions: (json['totalTransactions'] as num).toInt(),
      averageTransactionAmount:
          (json['averageTransactionAmount'] as num).toDouble(),
      methodBreakdown: Map<String, int>.from(json['methodBreakdown'] as Map),
      statusBreakdown: Map<String, int>.from(json['statusBreakdown'] as Map),
      currencyBreakdown:
          (json['currencyBreakdown'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(k, (e as num).toDouble()),
      ),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$PaymentAnalyticsToJson(PaymentAnalytics instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'date': instance.date.toIso8601String(),
      'totalAmount': instance.totalAmount,
      'totalTransactions': instance.totalTransactions,
      'averageTransactionAmount': instance.averageTransactionAmount,
      'methodBreakdown': instance.methodBreakdown,
      'statusBreakdown': instance.statusBreakdown,
      'currencyBreakdown': instance.currencyBreakdown,
      'metadata': instance.metadata,
    };
