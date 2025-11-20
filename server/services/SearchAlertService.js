const SavedSearch = require('../models/SavedSearch');
const Property = require('../models/Property');
const User = require('../models/User');
// const emailService = require('./emailService'); // Assuming you have an email service

class SearchAlertService {
  /**
   * Check all saved searches and send notifications for new matches
   */
  async checkAndSendAlerts() {
    try {
      const searches = await SavedSearch.find({
        notificationsEnabled: true
      }).populate('user');

      for (const search of searches) {
        await this.checkSearchAndNotify(search);
      }
    } catch (error) {
      console.error('Error checking search alerts:', error);
    }
  }

  /**
   * Check a single search and send notification if new properties found
   */
  async checkSearchAndNotify(search) {
    try {
      // Get properties matching the search filters
      const query = this.buildQueryFromFilters(search.filters);
      
      // Only get properties created after last notification
      if (search.lastNotified) {
        query.createdAt = { $gt: search.lastNotified };
      }

      const newProperties = await Property.find(query)
        .populate('agent', 'name email phone')
        .limit(10);

      if (newProperties.length > 0) {
        // Send notification based on frequency
        const shouldNotify = this.shouldNotify(search.frequency, search.lastNotified);
        
        if (shouldNotify) {
          await this.sendNotification(search.user, search, newProperties);
          
          // Update last notified time
          search.lastNotified = new Date();
          search.matchCount = newProperties.length;
          await search.save();
        }
      }
    } catch (error) {
      console.error(`Error checking search ${search._id}:`, error);
    }
  }

  /**
   * Build MongoDB query from saved search filters
   */
  buildQueryFromFilters(filters) {
    const query = {};

    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;
    if (filters.city) query['address.city'] = filters.city;
    if (filters.state) query['address.state'] = filters.state;

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    if (filters.minArea || filters.maxArea) {
      query.area = {};
      if (filters.minArea) query.area.$gte = filters.minArea;
      if (filters.maxArea) query.area.$lte = filters.maxArea;
    }

    if (filters.bedrooms) query.bedrooms = { $gte: filters.bedrooms };
    if (filters.bathrooms) query.bathrooms = { $gte: filters.bathrooms };
    if (filters.amenities && filters.amenities.length > 0) {
      query.amenities = { $in: filters.amenities };
    }

    return query;
  }

  /**
   * Determine if notification should be sent based on frequency
   */
  shouldNotify(frequency, lastNotified) {
    if (!lastNotified) return true; // First time

    const now = new Date();
    const timeSinceLastNotification = now - lastNotified;

    switch (frequency) {
      case 'instant':
        return true;
      case 'daily':
        return timeSinceLastNotification >= 24 * 60 * 60 * 1000; // 24 hours
      case 'weekly':
        return timeSinceLastNotification >= 7 * 24 * 60 * 60 * 1000; // 7 days
      default:
        return false;
    }
  }

  /**
   * Send notification to user
   */
  async sendNotification(user, search, properties) {
    try {
      // In-app notification (you can extend this to use a notification service)
      console.log(`Sending alert to user ${user._id} for search "${search.name}" with ${properties.length} new properties`);

      // Email notification
      if (user.email) {
        // await emailService.sendSearchAlert(user.email, search, properties);
        console.log(`Would send email to ${user.email} for search "${search.name}"`);
      }

      // TODO: Implement push notifications, SMS, etc.
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}

module.exports = new SearchAlertService();

