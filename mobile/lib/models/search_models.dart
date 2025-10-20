import 'package:json_annotation/json_annotation.dart';

part 'search_models.g.dart';

/// Search query model
@JsonSerializable()
class SearchQuery {
  final String id;
  final String query;
  final SearchType type;
  final Map<String, dynamic> filters;
  final SearchLocation? location;
  final DateTime timestamp;
  final int resultCount;
  final bool isSaved;
  final String? userId;
  final List<String> tags;
  final SearchSortBy sortBy;
  final SearchSortOrder sortOrder;
  final int page;
  final int limit;
  final Map<String, dynamic> metadata;

  const SearchQuery({
    required this.id,
    required this.query,
    required this.type,
    required this.filters,
    this.location,
    required this.timestamp,
    required this.resultCount,
    this.isSaved = false,
    this.userId,
    this.tags = const [],
    this.sortBy = SearchSortBy.relevance,
    this.sortOrder = SearchSortOrder.desc,
    this.page = 1,
    this.limit = 20,
    this.metadata = const {},
  });

  factory SearchQuery.fromJson(Map<String, dynamic> json) => _$SearchQueryFromJson(json);
  Map<String, dynamic> toJson() => _$SearchQueryToJson(this);

  SearchQuery copyWith({
    String? id,
    String? query,
    SearchType? type,
    Map<String, dynamic>? filters,
    SearchLocation? location,
    DateTime? timestamp,
    int? resultCount,
    bool? isSaved,
    String? userId,
    List<String>? tags,
    SearchSortBy? sortBy,
    SearchSortOrder? sortOrder,
    int? page,
    int? limit,
    Map<String, dynamic>? metadata,
  }) {
    return SearchQuery(
      id: id ?? this.id,
      query: query ?? this.query,
      type: type ?? this.type,
      filters: filters ?? this.filters,
      location: location ?? this.location,
      timestamp: timestamp ?? this.timestamp,
      resultCount: resultCount ?? this.resultCount,
      isSaved: isSaved ?? this.isSaved,
      userId: userId ?? this.userId,
      tags: tags ?? this.tags,
      sortBy: sortBy ?? this.sortBy,
      sortOrder: sortOrder ?? this.sortOrder,
      page: page ?? this.page,
      limit: limit ?? this.limit,
      metadata: metadata ?? this.metadata,
    );
  }
}

/// Search location model
@JsonSerializable()
class SearchLocation {
  final String? address;
  final double? latitude;
  final double? longitude;
  final double? radius; // in kilometers
  final String? city;
  final String? state;
  final String? country;
  final String? postalCode;

  const SearchLocation({
    this.address,
    this.latitude,
    this.longitude,
    this.radius,
    this.city,
    this.state,
    this.country,
    this.postalCode,
  });

  factory SearchLocation.fromJson(Map<String, dynamic> json) => _$SearchLocationFromJson(json);
  Map<String, dynamic> toJson() => _$SearchLocationToJson(this);
}

/// Search filter model
@JsonSerializable()
class SearchFilter {
  final String key;
  final FilterType type;
  final dynamic value;
  final String? label;
  final List<dynamic>? options;
  final dynamic minValue;
  final dynamic maxValue;
  final bool isRequired;
  final bool isMultiple;

  const SearchFilter({
    required this.key,
    required this.type,
    required this.value,
    this.label,
    this.options,
    this.minValue,
    this.maxValue,
    this.isRequired = false,
    this.isMultiple = false,
  });

  factory SearchFilter.fromJson(Map<String, dynamic> json) => _$SearchFilterFromJson(json);
  Map<String, dynamic> toJson() => _$SearchFilterToJson(this);
}

/// Search result model
@JsonSerializable()
class SearchResult {
  final String id;
  final String title;
  final String description;
  final String? imageUrl;
  final String? type;
  final double? price;
  final String? currency;
  final Map<String, dynamic>? location;
  final double? relevanceScore;
  final Map<String, dynamic> metadata;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const SearchResult({
    required this.id,
    required this.title,
    required this.description,
    this.imageUrl,
    this.type,
    this.price,
    this.currency,
    this.location,
    this.relevanceScore,
    this.metadata = const {},
    this.createdAt,
    this.updatedAt,
  });

  factory SearchResult.fromJson(Map<String, dynamic> json) => _$SearchResultFromJson(json);
  Map<String, dynamic> toJson() => _$SearchResultToJson(this);
}

/// Search suggestion model
@JsonSerializable()
class SearchSuggestion {
  final String id;
  final String text;
  final SuggestionType type;
  final int frequency;
  final DateTime lastUsed;
  final String? category;
  final Map<String, dynamic> metadata;

  const SearchSuggestion({
    required this.id,
    required this.text,
    required this.type,
    required this.frequency,
    required this.lastUsed,
    this.category,
    this.metadata = const {},
  });

  factory SearchSuggestion.fromJson(Map<String, dynamic> json) => _$SearchSuggestionFromJson(json);
  Map<String, dynamic> toJson() => _$SearchSuggestionToJson(this);
}

/// Saved search model
@JsonSerializable()
class SavedSearch {
  final String id;
  final String name;
  final String description;
  final SearchQuery query;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String userId;
  final bool isActive;
  final List<String> tags;
  final Map<String, dynamic> metadata;

  const SavedSearch({
    required this.id,
    required this.name,
    required this.description,
    required this.query,
    required this.createdAt,
    required this.updatedAt,
    required this.userId,
    this.isActive = true,
    this.tags = const [],
    this.metadata = const {},
  });

  factory SavedSearch.fromJson(Map<String, dynamic> json) => _$SavedSearchFromJson(json);
  Map<String, dynamic> toJson() => _$SavedSearchToJson(this);
}

/// Voice search result model
@JsonSerializable()
class VoiceSearchResult {
  final String id;
  final String transcript;
  final double confidence;
  final String language;
  final DateTime timestamp;
  final List<String> alternatives;
  final Map<String, dynamic> metadata;

  const VoiceSearchResult({
    required this.id,
    required this.transcript,
    required this.confidence,
    required this.language,
    required this.timestamp,
    this.alternatives = const [],
    this.metadata = const {},
  });

  factory VoiceSearchResult.fromJson(Map<String, dynamic> json) => _$VoiceSearchResultFromJson(json);
  Map<String, dynamic> toJson() => _$VoiceSearchResultToJson(this);
}

/// Search analytics model
@JsonSerializable()
class SearchAnalytics {
  final String id;
  final String query;
  final SearchType type;
  final int resultCount;
  final int clickCount;
  final int saveCount;
  final double averageRelevanceScore;
  final DateTime timestamp;
  final String? userId;
  final Map<String, dynamic> metadata;

  const SearchAnalytics({
    required this.id,
    required this.query,
    required this.type,
    required this.resultCount,
    required this.clickCount,
    required this.saveCount,
    required this.averageRelevanceScore,
    required this.timestamp,
    this.userId,
    this.metadata = const {},
  });

  factory SearchAnalytics.fromJson(Map<String, dynamic> json) => _$SearchAnalyticsFromJson(json);
  Map<String, dynamic> toJson() => _$SearchAnalyticsToJson(this);
}

/// Search types enum
enum SearchType {
  @JsonValue('property')
  property,
  @JsonValue('project')
  project,
  @JsonValue('agent')
  agent,
  @JsonValue('location')
  location,
  @JsonValue('amenity')
  amenity,
  @JsonValue('general')
  general,
}

/// Filter types enum
enum FilterType {
  @JsonValue('text')
  text,
  @JsonValue('number')
  number,
  @JsonValue('range')
  range,
  @JsonValue('select')
  select,
  @JsonValue('multiselect')
  multiselect,
  @JsonValue('date')
  date,
  @JsonValue('daterange')
  daterange,
  @JsonValue('boolean')
  boolean,
  @JsonValue('location')
  location,
}

/// Search sort by enum
enum SearchSortBy {
  @JsonValue('relevance')
  relevance,
  @JsonValue('price')
  price,
  @JsonValue('date')
  date,
  @JsonValue('distance')
  distance,
  @JsonValue('rating')
  rating,
  @JsonValue('popularity')
  popularity,
}

/// Search sort order enum
enum SearchSortOrder {
  @JsonValue('asc')
  asc,
  @JsonValue('desc')
  desc,
}

/// Suggestion types enum
enum SuggestionType {
  @JsonValue('query')
  query,
  @JsonValue('location')
  location,
  @JsonValue('amenity')
  amenity,
  @JsonValue('property_type')
  propertyType,
  @JsonValue('price_range')
  priceRange,
}

/// Search state model
@JsonSerializable()
class SearchState {
  final String? currentQuery;
  final SearchType? currentType;
  final Map<String, dynamic> currentFilters;
  final List<SearchResult> results;
  final List<SearchSuggestion> suggestions;
  final List<SearchQuery> searchHistory;
  final List<SavedSearch> savedSearches;
  final bool isLoading;
  final bool isVoiceSearching;
  final String? error;
  final int totalResults;
  final int currentPage;
  final bool hasMoreResults;
  final SearchLocation? currentLocation;
  final String? selectedLanguage;

  const SearchState({
    this.currentQuery,
    this.currentType,
    this.currentFilters = const {},
    this.results = const [],
    this.suggestions = const [],
    this.searchHistory = const [],
    this.savedSearches = const [],
    this.isLoading = false,
    this.isVoiceSearching = false,
    this.error,
    this.totalResults = 0,
    this.currentPage = 1,
    this.hasMoreResults = false,
    this.currentLocation,
    this.selectedLanguage,
  });

  factory SearchState.fromJson(Map<String, dynamic> json) => _$SearchStateFromJson(json);
  Map<String, dynamic> toJson() => _$SearchStateToJson(this);

  SearchState copyWith({
    String? currentQuery,
    SearchType? currentType,
    Map<String, dynamic>? currentFilters,
    List<SearchResult>? results,
    List<SearchSuggestion>? suggestions,
    List<SearchQuery>? searchHistory,
    List<SavedSearch>? savedSearches,
    bool? isLoading,
    bool? isVoiceSearching,
    String? error,
    int? totalResults,
    int? currentPage,
    bool? hasMoreResults,
    SearchLocation? currentLocation,
    String? selectedLanguage,
  }) {
    return SearchState(
      currentQuery: currentQuery ?? this.currentQuery,
      currentType: currentType ?? this.currentType,
      currentFilters: currentFilters ?? this.currentFilters,
      results: results ?? this.results,
      suggestions: suggestions ?? this.suggestions,
      searchHistory: searchHistory ?? this.searchHistory,
      savedSearches: savedSearches ?? this.savedSearches,
      isLoading: isLoading ?? this.isLoading,
      isVoiceSearching: isVoiceSearching ?? this.isVoiceSearching,
      error: error ?? this.error,
      totalResults: totalResults ?? this.totalResults,
      currentPage: currentPage ?? this.currentPage,
      hasMoreResults: hasMoreResults ?? this.hasMoreResults,
      currentLocation: currentLocation ?? this.currentLocation,
      selectedLanguage: selectedLanguage ?? this.selectedLanguage,
    );
  }
}


