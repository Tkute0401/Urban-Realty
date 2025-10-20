// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SearchQuery _$SearchQueryFromJson(Map<String, dynamic> json) => SearchQuery(
      id: json['id'] as String,
      query: json['query'] as String,
      type: $enumDecode(_$SearchTypeEnumMap, json['type']),
      filters: json['filters'] as Map<String, dynamic>,
      location: json['location'] == null
          ? null
          : SearchLocation.fromJson(json['location'] as Map<String, dynamic>),
      timestamp: DateTime.parse(json['timestamp'] as String),
      resultCount: (json['resultCount'] as num).toInt(),
      isSaved: json['isSaved'] as bool? ?? false,
      userId: json['userId'] as String?,
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
              const [],
      sortBy: $enumDecodeNullable(_$SearchSortByEnumMap, json['sortBy']) ??
          SearchSortBy.relevance,
      sortOrder:
          $enumDecodeNullable(_$SearchSortOrderEnumMap, json['sortOrder']) ??
              SearchSortOrder.desc,
      page: (json['page'] as num?)?.toInt() ?? 1,
      limit: (json['limit'] as num?)?.toInt() ?? 20,
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$SearchQueryToJson(SearchQuery instance) =>
    <String, dynamic>{
      'id': instance.id,
      'query': instance.query,
      'type': _$SearchTypeEnumMap[instance.type]!,
      'filters': instance.filters,
      'location': instance.location,
      'timestamp': instance.timestamp.toIso8601String(),
      'resultCount': instance.resultCount,
      'isSaved': instance.isSaved,
      'userId': instance.userId,
      'tags': instance.tags,
      'sortBy': _$SearchSortByEnumMap[instance.sortBy]!,
      'sortOrder': _$SearchSortOrderEnumMap[instance.sortOrder]!,
      'page': instance.page,
      'limit': instance.limit,
      'metadata': instance.metadata,
    };

const _$SearchTypeEnumMap = {
  SearchType.property: 'property',
  SearchType.project: 'project',
  SearchType.agent: 'agent',
  SearchType.location: 'location',
  SearchType.amenity: 'amenity',
  SearchType.general: 'general',
};

const _$SearchSortByEnumMap = {
  SearchSortBy.relevance: 'relevance',
  SearchSortBy.price: 'price',
  SearchSortBy.date: 'date',
  SearchSortBy.distance: 'distance',
  SearchSortBy.rating: 'rating',
  SearchSortBy.popularity: 'popularity',
};

const _$SearchSortOrderEnumMap = {
  SearchSortOrder.asc: 'asc',
  SearchSortOrder.desc: 'desc',
};

SearchLocation _$SearchLocationFromJson(Map<String, dynamic> json) =>
    SearchLocation(
      address: json['address'] as String?,
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      radius: (json['radius'] as num?)?.toDouble(),
      city: json['city'] as String?,
      state: json['state'] as String?,
      country: json['country'] as String?,
      postalCode: json['postalCode'] as String?,
    );

Map<String, dynamic> _$SearchLocationToJson(SearchLocation instance) =>
    <String, dynamic>{
      'address': instance.address,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'radius': instance.radius,
      'city': instance.city,
      'state': instance.state,
      'country': instance.country,
      'postalCode': instance.postalCode,
    };

SearchFilter _$SearchFilterFromJson(Map<String, dynamic> json) => SearchFilter(
      key: json['key'] as String,
      type: $enumDecode(_$FilterTypeEnumMap, json['type']),
      value: json['value'],
      label: json['label'] as String?,
      options: json['options'] as List<dynamic>?,
      minValue: json['minValue'],
      maxValue: json['maxValue'],
      isRequired: json['isRequired'] as bool? ?? false,
      isMultiple: json['isMultiple'] as bool? ?? false,
    );

Map<String, dynamic> _$SearchFilterToJson(SearchFilter instance) =>
    <String, dynamic>{
      'key': instance.key,
      'type': _$FilterTypeEnumMap[instance.type]!,
      'value': instance.value,
      'label': instance.label,
      'options': instance.options,
      'minValue': instance.minValue,
      'maxValue': instance.maxValue,
      'isRequired': instance.isRequired,
      'isMultiple': instance.isMultiple,
    };

const _$FilterTypeEnumMap = {
  FilterType.text: 'text',
  FilterType.number: 'number',
  FilterType.range: 'range',
  FilterType.select: 'select',
  FilterType.multiselect: 'multiselect',
  FilterType.date: 'date',
  FilterType.daterange: 'daterange',
  FilterType.boolean: 'boolean',
  FilterType.location: 'location',
};

SearchResult _$SearchResultFromJson(Map<String, dynamic> json) => SearchResult(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      imageUrl: json['imageUrl'] as String?,
      type: json['type'] as String?,
      price: (json['price'] as num?)?.toDouble(),
      currency: json['currency'] as String?,
      location: json['location'] as Map<String, dynamic>?,
      relevanceScore: (json['relevanceScore'] as num?)?.toDouble(),
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$SearchResultToJson(SearchResult instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'imageUrl': instance.imageUrl,
      'type': instance.type,
      'price': instance.price,
      'currency': instance.currency,
      'location': instance.location,
      'relevanceScore': instance.relevanceScore,
      'metadata': instance.metadata,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };

SearchSuggestion _$SearchSuggestionFromJson(Map<String, dynamic> json) =>
    SearchSuggestion(
      id: json['id'] as String,
      text: json['text'] as String,
      type: $enumDecode(_$SuggestionTypeEnumMap, json['type']),
      frequency: (json['frequency'] as num).toInt(),
      lastUsed: DateTime.parse(json['lastUsed'] as String),
      category: json['category'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$SearchSuggestionToJson(SearchSuggestion instance) =>
    <String, dynamic>{
      'id': instance.id,
      'text': instance.text,
      'type': _$SuggestionTypeEnumMap[instance.type]!,
      'frequency': instance.frequency,
      'lastUsed': instance.lastUsed.toIso8601String(),
      'category': instance.category,
      'metadata': instance.metadata,
    };

const _$SuggestionTypeEnumMap = {
  SuggestionType.query: 'query',
  SuggestionType.location: 'location',
  SuggestionType.amenity: 'amenity',
  SuggestionType.propertyType: 'property_type',
  SuggestionType.priceRange: 'price_range',
};

SavedSearch _$SavedSearchFromJson(Map<String, dynamic> json) => SavedSearch(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      query: SearchQuery.fromJson(json['query'] as Map<String, dynamic>),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      userId: json['userId'] as String,
      isActive: json['isActive'] as bool? ?? true,
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
              const [],
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$SavedSearchToJson(SavedSearch instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'query': instance.query,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'userId': instance.userId,
      'isActive': instance.isActive,
      'tags': instance.tags,
      'metadata': instance.metadata,
    };

VoiceSearchResult _$VoiceSearchResultFromJson(Map<String, dynamic> json) =>
    VoiceSearchResult(
      id: json['id'] as String,
      transcript: json['transcript'] as String,
      confidence: (json['confidence'] as num).toDouble(),
      language: json['language'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
      alternatives: (json['alternatives'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$VoiceSearchResultToJson(VoiceSearchResult instance) =>
    <String, dynamic>{
      'id': instance.id,
      'transcript': instance.transcript,
      'confidence': instance.confidence,
      'language': instance.language,
      'timestamp': instance.timestamp.toIso8601String(),
      'alternatives': instance.alternatives,
      'metadata': instance.metadata,
    };

SearchAnalytics _$SearchAnalyticsFromJson(Map<String, dynamic> json) =>
    SearchAnalytics(
      id: json['id'] as String,
      query: json['query'] as String,
      type: $enumDecode(_$SearchTypeEnumMap, json['type']),
      resultCount: (json['resultCount'] as num).toInt(),
      clickCount: (json['clickCount'] as num).toInt(),
      saveCount: (json['saveCount'] as num).toInt(),
      averageRelevanceScore: (json['averageRelevanceScore'] as num).toDouble(),
      timestamp: DateTime.parse(json['timestamp'] as String),
      userId: json['userId'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$SearchAnalyticsToJson(SearchAnalytics instance) =>
    <String, dynamic>{
      'id': instance.id,
      'query': instance.query,
      'type': _$SearchTypeEnumMap[instance.type]!,
      'resultCount': instance.resultCount,
      'clickCount': instance.clickCount,
      'saveCount': instance.saveCount,
      'averageRelevanceScore': instance.averageRelevanceScore,
      'timestamp': instance.timestamp.toIso8601String(),
      'userId': instance.userId,
      'metadata': instance.metadata,
    };

SearchState _$SearchStateFromJson(Map<String, dynamic> json) => SearchState(
      currentQuery: json['currentQuery'] as String?,
      currentType:
          $enumDecodeNullable(_$SearchTypeEnumMap, json['currentType']),
      currentFilters:
          json['currentFilters'] as Map<String, dynamic>? ?? const {},
      results: (json['results'] as List<dynamic>?)
              ?.map((e) => SearchResult.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      suggestions: (json['suggestions'] as List<dynamic>?)
              ?.map((e) => SearchSuggestion.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      searchHistory: (json['searchHistory'] as List<dynamic>?)
              ?.map((e) => SearchQuery.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      savedSearches: (json['savedSearches'] as List<dynamic>?)
              ?.map((e) => SavedSearch.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      isLoading: json['isLoading'] as bool? ?? false,
      isVoiceSearching: json['isVoiceSearching'] as bool? ?? false,
      error: json['error'] as String?,
      totalResults: (json['totalResults'] as num?)?.toInt() ?? 0,
      currentPage: (json['currentPage'] as num?)?.toInt() ?? 1,
      hasMoreResults: json['hasMoreResults'] as bool? ?? false,
      currentLocation: json['currentLocation'] == null
          ? null
          : SearchLocation.fromJson(
              json['currentLocation'] as Map<String, dynamic>),
      selectedLanguage: json['selectedLanguage'] as String?,
    );

Map<String, dynamic> _$SearchStateToJson(SearchState instance) =>
    <String, dynamic>{
      'currentQuery': instance.currentQuery,
      'currentType': _$SearchTypeEnumMap[instance.currentType],
      'currentFilters': instance.currentFilters,
      'results': instance.results,
      'suggestions': instance.suggestions,
      'searchHistory': instance.searchHistory,
      'savedSearches': instance.savedSearches,
      'isLoading': instance.isLoading,
      'isVoiceSearching': instance.isVoiceSearching,
      'error': instance.error,
      'totalResults': instance.totalResults,
      'currentPage': instance.currentPage,
      'hasMoreResults': instance.hasMoreResults,
      'currentLocation': instance.currentLocation,
      'selectedLanguage': instance.selectedLanguage,
    };
