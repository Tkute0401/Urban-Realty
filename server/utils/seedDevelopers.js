const mongoose = require('mongoose');
const Developer = require('../models/Developer');

const seedDevelopers = async () => {
  try {
    // Clear existing developers
    await Developer.deleteMany({});
    console.log('Cleared existing developers');

    // Create sample developers
    const developers = [
      {
        name: 'Rustomjee Group',
        description: 'Rustomjee Group is one of Mumbai\'s most trusted real estate developers with over 25 years of experience in creating landmark residential and commercial projects. Known for their commitment to quality, innovation, and customer satisfaction.',
        website: 'https://www.rustomjee.com',
        foundedYear: 1996,
        headquarters: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        completedProjects: 45,
        ongoingProjects: 12,
        upcomingProjects: 8,
        flagshipProjects: [
          {
            name: 'Rustomjee Crown',
            description: 'A premium residential project in Bandra West featuring luxury apartments with world-class amenities.'
          },
          {
            name: 'Rustomjee Urbania',
            description: 'A mixed-use development in Thane offering residential and commercial spaces with modern facilities.'
          }
        ],
        team: [
          {
            name: 'Boman Rustomjee',
            designation: 'Chairman & Managing Director'
          },
          {
            name: 'Percy S. Chowdhry',
            designation: 'Director'
          },
          {
            name: 'Rustomjee Group Team',
            designation: 'Development Team'
          }
        ],
        specializations: [
          {
            name: 'Luxury Residential',
            description: 'High-end residential projects with premium amenities and modern design'
          },
          {
            name: 'Commercial Development',
            description: 'Office spaces and commercial complexes in prime locations'
          },
          {
            name: 'Mixed-Use Projects',
            description: 'Integrated developments combining residential, commercial, and retail spaces'
          }
        ],
        contact: {
          email: 'info@rustomjee.com',
          phone: '+91-22-1234-5678'
        },
        socialMedia: {
          facebook: 'https://facebook.com/rustomjee',
          linkedin: 'https://linkedin.com/company/rustomjee',
          instagram: 'https://instagram.com/rustomjee'
        },
        awards: [
          {
            name: 'Best Developer Award',
            year: 2023,
            category: 'Residential'
          },
          {
            name: 'Excellence in Construction',
            year: 2022,
            category: 'Quality'
          }
        ]
      },
      {
        name: 'Lodha Group',
        description: 'Lodha Group is India\'s largest real estate developer by market capitalization, known for creating iconic landmarks and transforming skylines across Mumbai, Pune, and London.',
        website: 'https://www.lodhagroup.com',
        foundedYear: 1980,
        headquarters: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        completedProjects: 150,
        ongoingProjects: 25,
        upcomingProjects: 15,
        flagshipProjects: [
          {
            name: 'Lodha World Towers',
            description: 'The tallest residential towers in India, featuring ultra-luxury apartments with panoramic city views.'
          },
          {
            name: 'Lodha Park',
            description: 'A massive township in Thane with residential, commercial, and retail spaces spread across 400 acres.'
          }
        ],
        team: [
          {
            name: 'Abhishek Lodha',
            designation: 'Managing Director'
          },
          {
            name: 'Mangal Prabhat Lodha',
            designation: 'Chairman'
          }
        ],
        specializations: [
          {
            name: 'Ultra-Luxury Residential',
            description: 'Premium residential projects with world-class amenities'
          },
          {
            name: 'Township Development',
            description: 'Large-scale integrated townships with all modern facilities'
          },
          {
            name: 'Commercial Real Estate',
            description: 'Grade A office spaces and commercial complexes'
          }
        ],
        contact: {
          email: 'info@lodhagroup.com',
          phone: '+91-22-9876-5432'
        },
        socialMedia: {
          facebook: 'https://facebook.com/lodhagroup',
          linkedin: 'https://linkedin.com/company/lodha-group',
          instagram: 'https://instagram.com/lodhagroup'
        }
      }
    ];

    // Insert developers
    const createdDevelopers = await Developer.insertMany(developers);
    console.log(`Created ${createdDevelopers.length} developers`);
    
    // Log the IDs for testing
    createdDevelopers.forEach(dev => {
      console.log(`${dev.name}: ${dev._id}`);
    });

    return createdDevelopers;
  } catch (error) {
    console.error('Error seeding developers:', error);
    throw error;
  }
};

module.exports = seedDevelopers;

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/real-estate', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    return seedDevelopers();
  })
  .then(() => {
    console.log('Developer seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}
