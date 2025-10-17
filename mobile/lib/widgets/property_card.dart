import "package:flutter/material.dart";
import "package:cached_network_image/cached_network_image.dart";
import "../models/property.dart";
import "../config/design_tokens.dart";
import "../components/ui/index.dart";

class PropertyCard extends StatefulWidget {
  final Property property;
  final VoidCallback? onTap;
  final VoidCallback? onFavorite;
  final bool isFavorite;
  final PropertyCardType type;
  final bool enableSwipeActions;
  final VoidCallback? onShare;
  final VoidCallback? onCompare;

  const PropertyCard({
    super.key,
    required this.property,
    this.onTap,
    this.onFavorite,
    this.isFavorite = false,
    this.type = PropertyCardType.grid,
    this.enableSwipeActions = true,
    this.onShare,
    this.onCompare,
  });

  @override
  State<PropertyCard> createState() => _PropertyCardState();
}

class _PropertyCardState extends State<PropertyCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: DesignTokens.durationFast,
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: DesignTokens.curveEaseOut,
    ));
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: _buildCard(context),
        );
      },
    );
  }

  Widget _buildCard(BuildContext context) {
    return switch (widget.type) {
      PropertyCardType.grid => _buildGridCard(context),
      PropertyCardType.list => _buildListCard(context),
      PropertyCardType.featured => _buildFeaturedCard(context),
    };
  }

  Widget _buildGridCard(BuildContext context) {
    return AppCard(
      onTap: widget.onTap,
      margin: const EdgeInsets.all(DesignTokens.space3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildImageSection(context),
          const SizedBox(height: DesignTokens.space4),
          _buildContentSection(context),
        ],
      ),
    );
  }

  Widget _buildListCard(BuildContext context) {
    return AppCard(
      onTap: widget.onTap,
      margin: const EdgeInsets.symmetric(
        horizontal: DesignTokens.space5,
        vertical: DesignTokens.space2,
      ),
      child: Row(
        children: [
          _buildImageSection(context, isList: true),
          const SizedBox(width: DesignTokens.space4),
          Expanded(child: _buildContentSection(context)),
        ],
      ),
    );
  }

  Widget _buildFeaturedCard(BuildContext context) {
    return AppCard(
      onTap: widget.onTap,
      margin: const EdgeInsets.all(DesignTokens.space3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildImageSection(context, isFeatured: true),
          const SizedBox(height: DesignTokens.space4),
          _buildContentSection(context, isFeatured: true),
        ],
      ),
    );
  }

  Widget _buildImageSection(BuildContext context, {bool isList = false, bool isFeatured = false}) {
    final aspectRatio = isList ? 1.0 : (isFeatured ? 1.5 : 16 / 9);
    final height = isList ? 100 : (isFeatured ? 200 : null);

    return Stack(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(DesignTokens.radius2xl),
          child: AspectRatio(
            aspectRatio: aspectRatio,
            child: SizedBox(
              height: height,
              child: widget.property.images.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: widget.property.images.first.url,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(
                        color: Colors.grey.shade200,
                        child: const Center(
                          child: CircularProgressIndicator(),
                        ),
                      ),
                      errorWidget: (context, url, error) => Container(
                        color: Colors.grey.shade200,
                        child: const Icon(
                          Icons.home,
                          size: 50,
                          color: Colors.grey,
                        ),
                      ),
                    )
                  : Container(
                      color: Colors.grey.shade200,
                      child: const Icon(
                        Icons.home,
                        size: 50,
                        color: Colors.grey,
                      ),
                    ),
            ),
          ),
        ),
        _buildImageOverlay(context),
      ],
    );
  }

  Widget _buildImageOverlay(BuildContext context) {
    return Positioned(
      top: DesignTokens.space3,
      right: DesignTokens.space3,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (widget.property.isFeatured)
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: DesignTokens.space3,
                vertical: DesignTokens.space1,
              ),
              decoration: BoxDecoration(
                color: const Color(0xFFF76B1C),
                borderRadius: BorderRadius.circular(DesignTokens.radiusPill),
              ),
              child: const Text(
                'FEATURED',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: DesignTokens.fontSizeXs,
                  fontWeight: DesignTokens.fontWeightBold,
                ),
              ),
            ),
          const SizedBox(width: DesignTokens.space2),
          GestureDetector(
            onTap: widget.onFavorite,
            child: Container(
              padding: const EdgeInsets.all(DesignTokens.space3),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.9),
                shape: BoxShape.circle,
                boxShadow: DesignTokens.shadowSm,
              ),
              child: Icon(
                widget.isFavorite ? Icons.favorite : Icons.favorite_border,
                color: widget.isFavorite ? Colors.red : Colors.grey,
                size: DesignTokens.iconSizeMd,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContentSection(BuildContext context, {bool isFeatured = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTitle(context),
        const SizedBox(height: DesignTokens.space2),
        _buildLocation(context),
        const SizedBox(height: DesignTokens.space3),
        _buildPriceAndDetails(context),
        if (isFeatured) ...[
          const SizedBox(height: DesignTokens.space3),
          _buildAmenities(context),
        ],
      ],
    );
  }

  Widget _buildTitle(BuildContext context) {
    return Text(
      widget.property.title,
      style: const TextStyle(
        fontSize: DesignTokens.fontSizeLg,
        fontWeight: DesignTokens.fontWeightSemibold,
      ),
      maxLines: 2,
      overflow: TextOverflow.ellipsis,
    );
  }

  Widget _buildLocation(BuildContext context) {
    return Row(
      children: [
        Icon(
          Icons.location_on_outlined,
          size: DesignTokens.iconSizeSm,
          color: Colors.grey[600],
        ),
        const SizedBox(width: DesignTokens.space1),
        Expanded(
          child: Text(
            widget.property.location,
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: DesignTokens.fontSizeSm,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  Widget _buildPriceAndDetails(BuildContext context) {
    return Row(
      children: [
        Icon(
          Icons.currency_rupee,
          size: DesignTokens.iconSizeSm,
          color: Colors.green[700],
        ),
        Text(
          '${widget.property.price}',
          style: TextStyle(
            fontSize: DesignTokens.fontSizeLg,
            fontWeight: DesignTokens.fontWeightBold,
            color: Colors.green[700],
          ),
        ),
        const Spacer(),
        AppBadgeVariants.bhk('${widget.property.bedrooms} BHK'),
        const SizedBox(width: DesignTokens.space2),
        AppBadgeVariants.area('${widget.property.area} sq ft'),
      ],
    );
  }

  Widget _buildAmenities(BuildContext context) {
    final amenities = widget.property.amenities.take(3).toList();
    return Wrap(
      spacing: DesignTokens.space2,
      runSpacing: DesignTokens.space1,
      children: amenities.map((amenity) => AppBadge(
        text: amenity,
        variant: AppBadgeVariant.outline,
        size: AppBadgeSize.small,
      )).toList(),
    );
  }

  void _onTapDown(TapDownDetails details) {
    if (widget.enableSwipeActions) {
      setState(() {
        _isPressed = true;
      });
      _animationController.forward();
    }
  }

  void _onTapUp(TapUpDetails details) {
    if (widget.enableSwipeActions) {
      setState(() {
        _isPressed = false;
      });
      _animationController.reverse();
    }
  }

  void _onTapCancel() {
    if (widget.enableSwipeActions) {
      setState(() {
        _isPressed = false;
      });
      _animationController.reverse();
    }
  }
}

enum PropertyCardType {
  grid,
  list,
  featured,
}