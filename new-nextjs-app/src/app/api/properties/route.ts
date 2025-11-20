import { NextRequest, NextResponse } from 'next/server';

// Import database connection and models
import { connectDB } from '@/lib/database';
import Property from '@/models/Property';

export async function GET(request: NextRequest) {
  console.log('🔧 API: /api/properties GET request received');
  try {
    // Connect to database
    await connectDB();

    const { searchParams } = new URL(request.url);
    console.log('🔧 API: Search params:', Object.fromEntries(searchParams.entries()));
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '100000000');
    const minArea = parseInt(searchParams.get('minArea') || '0');
    const maxArea = parseInt(searchParams.get('maxArea') || '10000');
    // Handle both single number and comma-separated values
    const bedroomsParam = searchParams.get('bedrooms');
    const bedrooms = bedroomsParam 
      ? (bedroomsParam.includes(',') ? bedroomsParam.split(',').map(Number) : [Number(bedroomsParam)])
      : [];
    
    const bathroomsParam = searchParams.get('bathrooms');
    const bathrooms = bathroomsParam
      ? (bathroomsParam.includes(',') ? bathroomsParam.split(',').map(Number) : [Number(bathroomsParam)])
      : [];
    
    console.log('🔍 Bedrooms param:', bedroomsParam, 'Processed:', bedrooms);
    console.log('🔍 Bathrooms param:', bathroomsParam, 'Processed:', bathrooms);
    const city = searchParams.get('city') || '';
    const amenities = searchParams.get('amenities')?.split(',') || [];
    console.log('🔍 Raw amenities from URL:', searchParams.get('amenities'));
    console.log('🔍 Processed amenities array:', amenities);
    console.log('🔍 Amenities array length:', amenities.length);
    console.log('🔍 Amenities array items:', amenities.map(a => `"${a}"`));

    // Build MongoDB filter
    const filter: any = {};

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }

    // Type filter
    if (type) {
      filter.type = type;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < 100000000) {
      filter.price = {};
      if (minPrice > 0) filter.price.$gte = minPrice;
      if (maxPrice < 100000000) filter.price.$lte = maxPrice;
      console.log('🔍 Filtering by price range:', { minPrice, maxPrice });
    }

    // Area range filter
    if (minArea > 0 || maxArea < 10000) {
      filter.area = {};
      if (minArea > 0) filter.area.$gte = minArea;
      if (maxArea < 10000) filter.area.$lte = maxArea;
    }

    // Bedrooms filter - use minimum (>=) instead of exact match
    if (bedrooms.length > 0) {
      const minBedrooms = Math.min(...bedrooms);
      filter.bedrooms = { $gte: minBedrooms };
      console.log('🔍 Filtering by bedrooms (>=):', minBedrooms);
    }

    // Bathrooms filter - use minimum (>=) instead of exact match
    if (bathrooms.length > 0) {
      const minBathrooms = Math.min(...bathrooms);
      filter.bathrooms = { $gte: minBathrooms };
      console.log('🔍 Filtering by bathrooms (>=):', minBathrooms);
    }

    // City filter
    if (city) {
      filter['address.city'] = city;
    }

    // Amenities filter - show properties that have ANY of the selected amenities
    if (amenities.length > 0) {
      filter.amenities = { $in: amenities };
      console.log('🔍 Filtering by amenities:', amenities);
    }

    // Advanced filters
    const constructionStatus = searchParams.get('constructionStatus');
    if (constructionStatus) {
      const statusArray = constructionStatus.split(',');
      filter.constructionStatus = { $in: statusArray };
    }

    const furnished = searchParams.get('furnished');
    if (furnished !== null) {
      filter.furnished = furnished === 'true';
    }

    const facing = searchParams.get('facing');
    if (facing) {
      filter.facing = facing;
    }

    const floorRangeMin = searchParams.get('floorRangeMin');
    const floorRangeMax = searchParams.get('floorRangeMax');
    if (floorRangeMin || floorRangeMax) {
      filter.$or = filter.$or || [];
      if (floorRangeMin) {
        filter['floorRange.min'] = { $gte: Number(floorRangeMin) };
      }
      if (floorRangeMax) {
        filter['floorRange.max'] = { $lte: Number(floorRangeMax) };
      }
    }

    const parkingSpaces = searchParams.get('parkingSpaces');
    if (parkingSpaces) {
      filter.parkingSpaces = { $gte: Number(parkingSpaces) };
    }

    const verified = searchParams.get('verified');
    if (verified !== null) {
      filter.verified = verified === 'true';
    }

    const hasVirtualTour = searchParams.get('hasVirtualTour');
    if (hasVirtualTour === 'true') {
      filter.virtualTour = { $exists: true, $ne: null };
    }

    const developer = searchParams.get('developer');
    if (developer) {
      filter.developer = developer;
    }

    // Proximity filters
    const nearSchools = searchParams.get('nearSchools');
    if (nearSchools === 'true') {
      filter['nearbyLocalities.hasSchool'] = true;
    }

    const nearHospitals = searchParams.get('nearHospitals');
    if (nearHospitals === 'true') {
      filter['nearbyLocalities.hasHospital'] = true;
    }

    const nearMalls = searchParams.get('nearMalls');
    if (nearMalls === 'true') {
      filter['nearbyLocalities.hasMall'] = true;
    }

    const nearMetro = searchParams.get('nearMetro');
    if (nearMetro === 'true') {
      filter['nearbyLocalities.hasTransport'] = true;
    }

    const nearParks = searchParams.get('nearParks');
    if (nearParks === 'true') {
      filter['nearbyLocalities.hasPark'] = true;
    }

    const possessionDate = searchParams.get('possessionDate');
    if (possessionDate) {
      filter.possessionDate = { $lte: new Date(possessionDate) };
    }

    const ageOfProperty = searchParams.get('ageOfProperty');
    if (ageOfProperty) {
      filter.ageOfProperty = { $lte: Number(ageOfProperty) };
    }

    console.log('🔍 Final MongoDB filter:', JSON.stringify(filter, null, 2));

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count and properties from database
    const [total, properties] = await Promise.all([
      Property.countDocuments(filter),
      Property.find(filter)
        .populate('agent', 'name email phone')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
    ]);

    console.log('🔍 Found properties:', properties.length);
    console.log('🔍 Total count:', total);

    // Debug: Show sample properties and their amenities
    if (properties.length > 0) {
      console.log('🔍 Sample property amenities:', properties[0].amenities);
      console.log('🔍 Sample property price:', properties[0].price);
      console.log('🔍 Sample property title:', properties[0].title);
      console.log('🔍 All properties amenities:', properties.map(p => ({ title: p.title, amenities: p.amenities })));
    } else {
      console.log('🔍 No properties found with current filters');
    }
    
    // Debug: Check total properties in database
    const totalInDB = await Property.countDocuments({});
    console.log('🔍 Total properties in database:', totalInDB);
    
    // Debug: Check if any properties have the requested amenities
    if (amenities.length > 0) {
      const propertiesWithAmenities = await Property.find({
        amenities: { $in: amenities }
      }).limit(5);
      console.log('🔍 Properties with requested amenities:', propertiesWithAmenities.length);
      if (propertiesWithAmenities.length > 0) {
        console.log('🔍 Sample property with amenities:', {
          title: propertiesWithAmenities[0].title,
          amenities: propertiesWithAmenities[0].amenities
        });
      }
    }

    const totalPages = Math.ceil(total / limit);

    console.log(`🔧 API: Returning ${properties.length} properties from database (page ${page}/${totalPages})`);

    return NextResponse.json({
      data: properties,
      pagination: {
        currentPage: page,
        limit,
        totalResults: total,
        totalPages
      },
      success: true
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    const formData = await request.formData();
    
    // Extract property data from form data
    const propertyData = {
      title: formData.get('title') as string,
      buildingName: formData.get('buildingName') as string,
      price: parseInt(formData.get('price') as string),
      area: parseInt(formData.get('area') as string),
      bedrooms: parseInt(formData.get('bedrooms') as string),
      bathrooms: parseInt(formData.get('bathrooms') as string),
      type: formData.get('type') as string,
      status: formData.get('status') as string,
      description: formData.get('description') as string,
      address: JSON.parse(formData.get('address') as string),
      amenities: formData.getAll('amenities') as string[],
      highlights: formData.getAll('highlights') as string[],
      images: [], // Handle image uploads separately
      projectDetails: {
        developer: formData.get('developer') as string || 'Unknown'
      },
      location: {
        latitude: parseFloat(formData.get('latitude') as string) || 0,
        longitude: parseFloat(formData.get('longitude') as string) || 0
      },
      agent: formData.get('agentId') as string || null
    };

    // Create new property in database
    const newProperty = new Property(propertyData);
    await newProperty.save();

    // Populate agent data
    await newProperty.populate('agent', 'name email phone');

    console.log(`🔧 API: Created property ${newProperty._id} in database`);

    return NextResponse.json({
      property: newProperty,
      success: true,
      message: 'Property created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
